import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export type Locale = 'ko' | 'en';

/**
 * Format date based on locale
 * Korean: YYYY년 MM월 DD일
 * English: MMM DD, YYYY
 */
export function formatDate(date: string | Date, locale: Locale): string {
    const d = dayjs(date.toString().replace(/\./g, '-'));

    if (locale === 'ko') {
        dayjs.locale('ko');
        return d.format('YYYY년 MM월 DD일');
    } else {
        dayjs.locale('en');
        return d.format('MMM DD, YYYY');
    }
}

/**
 * Format short date (for timeline cards)
 * Korean: YY.MM.DD
 * English: MM/DD/YY
 */
export function formatShortDate(date: string | Date, locale: Locale): string {
    const d = dayjs(date.toString().replace(/\./g, '-'));

    if (locale === 'ko') {
        return d.format('YY.MM.DD');
    } else {
        return d.format('MM/DD/YY');
    }
}

/**
 * Get relative time (e.g., "3 days ago")
 */
export function getRelativeTime(date: string | Date, locale: Locale): string {
    const d = dayjs(date.toString().replace(/\./g, '-'));
    dayjs.locale(locale);
    return d.fromNow();
}

/**
 * Format number based on locale
 * Korean: 만, 억, 조
 * English: K, M, B
 */
export function formatNumber(num: number, locale: Locale): string {
    if (num === 0) return '0';

    if (locale === 'ko') {
        // Korean number system: 만 (10,000), 억 (100,000,000), 조 (1,000,000,000,000)
        const jo = 1_000_000_000_000;
        const eok = 100_000_000;
        const man = 10_000;

        if (num >= jo) {
            const joValue = Math.floor(num / jo);
            const eokValue = Math.floor((num % jo) / eok);
            return eokValue > 0 ? `${joValue}조 ${eokValue}억` : `${joValue}조`;
        } else if (num >= eok) {
            const eokValue = Math.floor(num / eok);
            const manValue = Math.floor((num % eok) / man);
            return manValue > 0 ? `${eokValue}억 ${manValue}만` : `${eokValue}억`;
        } else if (num >= man) {
            return `${Math.floor(num / man)}만`;
        } else {
            return num.toLocaleString('ko-KR');
        }
    } else {
        // English number system: K, M, B, T
        const trillion = 1_000_000_000_000;
        const billion = 1_000_000_000;
        const million = 1_000_000;
        const thousand = 1_000;

        if (num >= trillion) {
            return `${(num / trillion).toFixed(1)}T`;
        } else if (num >= billion) {
            return `${(num / billion).toFixed(1)}B`;
        } else if (num >= million) {
            return `${(num / million).toFixed(1)}M`;
        } else if (num >= thousand) {
            return `${(num / thousand).toFixed(1)}K`;
        } else {
            return num.toLocaleString('en-US');
        }
    }
}

/**
 * Format number with full precision (with commas)
 */
export function formatNumberFull(num: number, locale: Locale): string {
    return num.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US');
}

/**
 * Format currency (Korean Won)
 * Korean: 1,348억원
 * English: ₩134.8B
 */
export function formatCurrency(num: number, locale: Locale): string {
    if (locale === 'ko') {
        const eok = 100_000_000;
        const man = 10_000;

        if (num >= eok) {
            const eokValue = Math.floor(num / eok);
            const manValue = Math.floor((num % eok) / man);
            return manValue > 0 ? `${eokValue}억 ${manValue}만원` : `${eokValue}억원`;
        } else if (num >= man) {
            return `${Math.floor(num / man)}만원`;
        } else {
            return `${num.toLocaleString('ko-KR')}원`;
        }
    } else {
        const billion = 1_000_000_000;
        const million = 1_000_000;

        if (num >= billion) {
            return `₩${(num / billion).toFixed(1)}B`;
        } else if (num >= million) {
            return `₩${(num / million).toFixed(1)}M`;
        } else {
            return `₩${num.toLocaleString('en-US')}`;
        }
    }
}

/**
 * Format "affected count" with appropriate label
 * Korean: 3,370만 명
 * English: 33.7M users
 */
export function formatAffectedCount(num: number, locale: Locale): string {
    if (num === 0) return locale === 'ko' ? '미확인' : 'Unknown';

    const formatted = formatNumber(num, locale);
    return locale === 'ko' ? `${formatted}명` : `${formatted} users`;
}

/**
 * Get severity label
 */
export function getSeverityLabel(severity: string, locale: Locale): string {
    const labels: Record<string, Record<Locale, string>> = {
        critical: { ko: '심각', en: 'Critical' },
        warning: { ko: '주의', en: 'Warning' },
        info: { ko: '정보', en: 'Info' }
    };
    return labels[severity]?.[locale] || severity;
}
