#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime
import os
import random

# Configuration
BASE_URL = "https://www.koreaherald.com"
SEARCH_URL = "https://www.koreaherald.com/search"
OUTPUT_FILE = "../frontend/src/data/incidents.json"
# Refined Keywords
TARGET_KEYWORDS = [
    "data breach", 
    "personal information leak", 
    "customer data hacking",
    "privacy leak",
    "coupang",
    "kakao"
]
MAX_PAGES = 5

# Headers to mimic a browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

BLACKLIST_TERMS = [
    "album", "concert", "music video", "premiere", "netflix", "drama", "k-pop", 
    "stray kids", "blackpink", "bts", "newjeans", "actor", "actress", "festival",
    "weather", "snow", "rain", "forecast", "typhoon", "award", "ceremony"
]

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def extract_date(date_str):
    try:
        match = re.search(r'(\d{4})-(\d{2})-(\d{2})', date_str)
        if match:
            return f"{match.group(1)}.{match.group(2)}.{match.group(3)}"
        dt = datetime.strptime(date_str, "%b %d, %Y")
        return dt.strftime("%Y.%m.%d")
    except:
        return datetime.now().strftime("%Y.%m.%d")

def is_relevant(title, description):
    text = (title + " " + description).lower()
    
    # 1. Check Blacklist first
    for term in BLACKLIST_TERMS:
        if term in text:
            return False

    # 2. Strict Subject + Action Check
    # Relaxed: Check for specific strong phrases first
    strong_phrases = ["data breach", "info leak", "hacking", "cyberattack", "ransomware", "security breach", "data leak", "privacy violation", "fined", "penalty", "stolen", "breach"]
    if any(phrase in text for phrase in strong_phrases):
        return True

    # Must have at least one from EACH group to be a "breach" event
    subjects = ["data", "information", "info", "privacy", "record", "account", "password", "email", "security", "customer", "user"]
    actions = ["leak", "breach", "hack", "stole", "exposed", "compromised", "vulnerability", "attack", "theft", "violation", "fine", "sanction"]
    
    has_subject = any(s in text for s in subjects)
    has_action = any(a in text for a in actions)
    
    if has_subject and has_action:
        return True
    
    # Debug info (optional, helps understand what's lost)
    print(f"Rejected: {title} (No Subject+Action match)")
        
    return False

def determine_severity_and_count(text):
    text_lower = text.lower()
    count = 0
    severity = "info"
    
    multipliers = {'million': 1000000, 'm': 1000000, 'billion': 1000000000, 'k': 1000, 'thousand': 1000}
    number_pattern = re.search(r'([\d\.]+)\s*(million|m|billion|k|thousand)?\s*(users|records|people|accounts|customers)', text_lower)
    
    if number_pattern:
        num_str = number_pattern.group(1)
        multiplier_str = number_pattern.group(2)
        try:
            val = float(num_str)
            if multiplier_str in multipliers:
                val *= multipliers[multiplier_str]
            count = int(val)
        except:
            pass

    if count > 1000000:
        severity = "critical"
    elif count > 100000:
        severity = "warning"
        
    # Keyword override for severity
    if "massive" in text_lower or "critical" in text_lower:
        if severity == "info": severity = "warning"

    return severity, count

def extract_leaked_items(text):
    items = set()
    keywords = {
        "email": "Email", "password": "Password", "phone": "Phone Number", 
        "address": "Address", "card": "Credit Card", "bank": "Bank Account",
        "name": "Name", "social security": "SSN", "resident": "RRN",
        "photo": "Photos", "video": "Videos"
    }
    text_lower = text.lower()
    for key, val in keywords.items():
        if key in text_lower:
            items.add(val)
    
    if not items and ("personal info" in text_lower or "data" in text_lower):
        items.add("Personal Info")
    
    return list(items)

def crawl():
    all_incidents = []
    seen_titles = set()
    incident_id = 1
    
    print(f"Starting REFINED crawl for keywords: {TARGET_KEYWORDS}")

    for keyword in TARGET_KEYWORDS:
        print(f"Searching for: {keyword}")
        for page in range(1, MAX_PAGES + 1):
            url = f"{SEARCH_URL}?q={keyword}&page={page}"
            
            try:
                print(f"Fetcher: {url}")
                response = requests.get(url, headers=HEADERS, timeout=10)
                if response.status_code != 200:
                    continue
                
                soup = BeautifulSoup(response.text, 'lxml')
                articles = soup.select('.news_list li, .search_result_list li')
                if not articles:
                     articles = soup.find_all('div', class_='tit')

                if not articles:
                    print("No articles found on this page.")
                    break
                    
                for article in articles:
                    title_tag = article.find('h3') or article.find('h2') or article.find('a')
                    if not title_tag: continue
                        
                    title = clean_text(title_tag.get_text())
                    
                    # LINK handling
                    link = title_tag.find('a')['href'] if title_tag.find('a') else title_tag.get('href', '')
                    if link and not link.startswith('http'):
                        link = BASE_URL + link
                    
                    if title in seen_titles: continue

                    desc_tag = article.find(class_='desc') or article.find('p')
                    description = clean_text(desc_tag.get_text()) if desc_tag else title
                    
                    # *** RELEVANCE CHECK ***
                    if not is_relevant(title, description):
                        # Log inside the function
                        continue
                        
                    seen_titles.add(title)
                    
                    date_tag = article.find(class_='date') or article.find(class_='time')
                    date_str = clean_text(date_tag.get_text()) if date_tag else datetime.now().strftime("%Y-%m-%d")
                    formatted_date = extract_date(date_str)
                    
                    severity, leaked_count = determine_severity_and_count(description + " " + title)
                    leaked_items = extract_leaked_items(description + " " + title)
                    
                    # Formatting Company Name
                    company_name = title.split(' ')[0]
                    if len(company_name) < 3:
                        company_name = " ".join(title.split(' ')[:2])

                    incident = {
                        "id": incident_id,
                        "company_name": company_name.strip(),
                        "incident_date": formatted_date,
                        "severity": severity,
                        "leaked_items": leaked_items,
                        "description": title,
                        "leaked_count": leaked_count,
                        "original_url": link
                    }
                    
                    all_incidents.append(incident)
                    incident_id += 1
                    print(f"Found: {title}")
            
            except Exception as e:
                print(f"Error processing {url}: {e}")
            
            time.sleep(random.uniform(1, 2))

    # Save
    print(f"Found {len(all_incidents)} RELEVANT incidents.")
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_incidents, f, indent=4, ensure_ascii=False)
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    crawl()
