import crypto from 'node:crypto';

export interface ParsedMarketplaceUrl {
  isValid: boolean;
  type: 'item' | 'search' | 'category' | 'unknown';
  listingId?: string;
  location?: string;
  query?: string;
  rawUrl: string;
}

/**
 * Parses and extracts data from Facebook Marketplace URLs.
 * Handles desktop, mobile, and localized formats:
 * - https://www.facebook.com/marketplace/item/123456789012345/
 * - https://m.facebook.com/marketplace/item/123456789012345?ref=search
 * - https://facebook.com/marketplace/item/123456789012345
 * - https://www.facebook.com/marketplace/jakarta/search/?query=laptop
 * - https://www.facebook.com/marketplace/nyc/vehicles
 */
export function parseMarketplaceUrl(urlStr: string): ParsedMarketplaceUrl {
  const result: ParsedMarketplaceUrl = {
    isValid: false,
    type: 'unknown',
    rawUrl: urlStr,
  };

  try {
    const trimmed = urlStr.trim();
    // Allow parsing without protocol prefix if user pasted facebook.com/...
    const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const url = new URL(normalized);

    const hostname = url.hostname.toLowerCase();
    if (!hostname.includes('facebook.com') && !hostname.includes('fb.com')) {
      return result;
    }

    const pathname = url.pathname;
    const parts = pathname.split('/').filter(Boolean);

    // Look for /marketplace/
    const marketplaceIndex = parts.indexOf('marketplace');
    if (marketplaceIndex === -1) {
      return result;
    }

    result.isValid = true;
    const remainingParts = parts.slice(marketplaceIndex + 1);

    if (remainingParts.length === 0) {
      result.type = 'search';
      result.query = url.searchParams.get('query') || undefined;
      return result;
    }

    // Check for item listing: /marketplace/item/<id>/
    if (remainingParts[0] === 'item' && remainingParts[1]) {
      result.type = 'item';
      result.listingId = remainingParts[1].replace(/[^0-9]/g, '');
      return result;
    }

    // Check for location search: /marketplace/<location>/search/?query=...
    if (remainingParts.length >= 2 && remainingParts[1] === 'search') {
      result.type = 'search';
      result.location = remainingParts[0];
      result.query = url.searchParams.get('query') || undefined;
      return result;
    }

    // Check for location or category feed: /marketplace/<location>/ or /marketplace/<category>/
    result.location = remainingParts[0];
    if (url.searchParams.has('query')) {
      result.type = 'search';
      result.query = url.searchParams.get('query') || undefined;
    } else {
      result.type = 'category';
    }

    return result;
  } catch {
    return result;
  }
}

/**
 * Normalizes price values and formats currency strings.
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  try {
    const upperCurrency = currency.toUpperCase();
    if (upperCurrency === 'IDR') {
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: upperCurrency,
      maximumFractionDigits: upperCurrency === 'JPY' || upperCurrency === 'IDR' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/**
 * Creates an SHA-256 hash salt for user session cookies to ensure
 * cache isolation across tenants without storing or logging cookie values.
 */
export function hashCookieSalt(cookie?: string): string {
  if (!cookie) return 'public';
  return crypto.createHash('sha256').update(cookie.trim()).digest('hex').substring(0, 16);
}

/**
 * Sanitizes and cleanses HTML and multi-line whitespace from descriptions.
 */
export function cleanDescription(text?: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
