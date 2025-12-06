import requests
from bs4 import BeautifulSoup
import re

url = "https://www.koreaherald.com/search/index.php?q=data+breach"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
res = requests.get(url, headers=headers, timeout=10)
soup = BeautifulSoup(res.text, 'html.parser')

print("Scanning <ul> elements for news-like content...")
uls = soup.find_all('ul')
for i, ul in enumerate(uls):
    lis = ul.find_all('li', recursive=False)
    if not lis: continue
    
    # Check text length of first LI
    first_li_text = lis[0].get_text().strip()
    clean_text = re.sub(r'\s+', ' ', first_li_text)
    
    if len(clean_text) > 50:
        print(f"UL [{i}] Class: {ul.get('class')}")
        print(f"  First LI text ({len(clean_text)} chars): {clean_text[:100]}...")
        
        # Check if it has an image or title class
        has_img = lis[0].find('img') is not None
        tit = lis[0].find(class_='tit')
        print(f"  Has Img: {has_img}, Title tag: {tit}")
        print("-" * 30)
