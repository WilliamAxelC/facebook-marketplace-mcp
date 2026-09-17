import { z } from 'zod';
import { FacebookClient } from '../client/facebook-client.js';
import { parseMarketplaceUrl } from '../utils/formatters.js';

export const SearchMarketplaceSchema = z.object({
  query: z.string().optional().describe('Search term / product keyword (e.g., "MacBook Pro", "iPhone 15", "Vario 160")'),
  location: z.string().optional().default('jakarta').describe('Target city or location name (e.g., "jakarta", "nyc", "london", "singapore", "sanfrancisco")'),
  minPrice: z.number().min(0).optional().describe('Minimum price filter'),
  maxPrice: z.number().min(0).optional().describe('Maximum price filter'),
  category: z.enum(['all', 'vehicles', 'property_rentals', 'electronics', 'home_goods', 'apparel', 'hobbies']).optional().default('all').describe('Marketplace category filter'),
  condition: z.enum(['new', 'used_like_new', 'used_good', 'used_fair']).optional().describe('Item condition filter'),
  sortBy: z.enum(['best_match', 'price_asc', 'price_desc', 'creation_time_desc']).optional().default('best_match').describe('Sorting order'),
  limit: z.number().int().min(1).max(50).optional().default(20).describe('Number of items to return (1-50, default 20)'),
  cookie: z.string().optional().describe('Optional Facebook session cookie (c_user=...; xs=...) for personalized or live queries'),
});

export const GetListingDetailsSchema = z.object({
  listingIdOrUrl: z.string().describe('Facebook Marketplace Listing ID (e.g., "729481902830192") or full URL (e.g., "https://www.facebook.com/marketplace/item/729481902830192/")'),
  cookie: z.string().optional().describe('Optional Facebook session cookie for personalized or live queries'),
});

export const GetNearbyListingsSchema = z.object({
  location: z.string().optional().default('jakarta').describe('Target city name or slug (e.g. "jakarta", "nyc", "london")'),
  limit: z.number().int().min(1).max(50).optional().default(20).describe('Number of listings to return'),
  cookie: z.string().optional().describe('Optional Facebook session cookie'),
});

export const GetCategoriesSchema = z.object({
  filter: z.string().optional().describe('Optional category keyword filter'),
});

export const ParseListingUrlSchema = z.object({
  url: z.string().describe('Facebook Marketplace URL to parse and validate'),
});

export async function handleSearchMarketplace(client: FacebookClient, args: z.infer<typeof SearchMarketplaceSchema>) {
  return await client.searchListings({
    query: args.query,
    location: args.location,
    minPrice: args.minPrice,
    maxPrice: args.maxPrice,
    category: args.category === 'all' ? undefined : args.category,
    condition: args.condition,
    sortBy: args.sortBy,
    limit: args.limit,
    userCookie: args.cookie,
  });
}

export async function handleGetListingDetails(client: FacebookClient, args: z.infer<typeof GetListingDetailsSchema>) {
  return await client.getListingDetails(args.listingIdOrUrl, args.cookie);
}

export async function handleGetNearbyListings(client: FacebookClient, args: z.infer<typeof GetNearbyListingsSchema>) {
  return await client.getNearbyListings(args.location, args.limit, args.cookie);
}

export async function handleGetCategories(client: FacebookClient, args: z.infer<typeof GetCategoriesSchema>) {
  const categories = await client.getCategories();
  if (args.filter) {
    const q = args.filter.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }
  return categories;
}

export function handleParseListingUrl(args: z.infer<typeof ParseListingUrlSchema>) {
  return parseMarketplaceUrl(args.url);
}
