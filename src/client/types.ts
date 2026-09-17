export interface MarketplaceLocation {
  city: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
}

export interface MarketplaceSeller {
  id: string;
  name: string;
  avatarUrl?: string;
  profileUrl?: string;
  joinDate?: string;
  rating?: number;
  ratingsCount?: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    formatted: string;
  };
  location: MarketplaceLocation;
  seller: MarketplaceSeller;
  primaryPhotoUrl: string;
  photoUrls: string[];
  category: string;
  condition?: 'new' | 'used_like_new' | 'used_good' | 'used_fair';
  creationTime?: string;
  isSold: boolean;
  isPending: boolean;
  url: string;
  attributes?: Record<string, string>;
}

export type SortOrder =
  | 'best_match'
  | 'price_asc'
  | 'price_desc'
  | 'distance_asc'
  | 'creation_time_desc';

export interface MarketplaceSearchParams {
  query?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  condition?: 'new' | 'used_like_new' | 'used_good' | 'used_fair';
  sortBy?: SortOrder;
  daysListed?: number;
  limit?: number;
  cursor?: string;
  userCookie?: string;
}

export interface MarketplaceSearchResult {
  items: MarketplaceItem[];
  totalCount: number;
  hasNextPage: boolean;
  nextCursor?: string;
  location: string;
  query?: string;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  subcategories?: { id: string; name: string; slug: string }[];
}

export interface ClientConfig {
  cookie?: string;
  dtsgToken?: string;
  proxyUrl?: string;
  userAgent?: string;
  requestDelayMs?: number;
  mockOnBlocked?: boolean;
  defaultLocation?: string;
}

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: any;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id?: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}
