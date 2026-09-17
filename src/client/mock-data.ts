import { MarketplaceCategory, MarketplaceItem, MarketplaceSearchParams, MarketplaceSearchResult } from './types.js';
import { formatPrice } from '../utils/formatters.js';

export const MOCK_CATEGORIES: MarketplaceCategory[] = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    slug: 'vehicles',
    icon: 'car',
    subcategories: [
      { id: 'cars', name: 'Cars, Trucks & Motorcycles', slug: 'cars' },
      { id: 'motorcycles', name: 'Motorcycles & Scooters', slug: 'motorcycles' },
      { id: 'auto_parts', name: 'Auto Parts & Tires', slug: 'auto-parts' },
    ],
  },
  {
    id: 'property_rentals',
    name: 'Property Rentals',
    slug: 'propertyrentals',
    icon: 'home',
    subcategories: [
      { id: 'apartments', name: 'Apartments / Condos', slug: 'apartments' },
      { id: 'houses', name: 'Houses for Rent', slug: 'houses' },
      { id: 'rooms', name: 'Room Rentals', slug: 'rooms' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'laptop',
    subcategories: [
      { id: 'computers', name: 'Computers & Laptops', slug: 'computers' },
      { id: 'cell_phones', name: 'Cell Phones & Accessories', slug: 'cell-phones' },
      { id: 'audio', name: 'Headphones & Audio', slug: 'audio' },
      { id: 'gaming', name: 'Video Games & Consoles', slug: 'video-games' },
    ],
  },
  {
    id: 'home_goods',
    name: 'Home Goods & Furniture',
    slug: 'home-goods',
    icon: 'couch',
    subcategories: [
      { id: 'furniture', name: 'Living Room & Bedroom Furniture', slug: 'furniture' },
      { id: 'appliances', name: 'Kitchen Appliances', slug: 'appliances' },
      { id: 'tools', name: 'Home Improvement & Tools', slug: 'tools' },
    ],
  },
  {
    id: 'apparel',
    name: 'Apparel & Accessories',
    slug: 'apparel',
    icon: 'shirt',
    subcategories: [
      { id: 'men_clothing', name: "Men's Clothing & Shoes", slug: 'mens-clothing' },
      { id: 'women_clothing', name: "Women's Clothing & Bags", slug: 'womens-clothing' },
      { id: 'jewelry', name: 'Jewelry & Watches', slug: 'jewelry' },
    ],
  },
  {
    id: 'hobbies',
    name: 'Hobbies & Sports',
    slug: 'hobbies',
    icon: 'bicycle',
    subcategories: [
      { id: 'bicycles', name: 'Bicycles & Cycling', slug: 'bicycles' },
      { id: 'musical_instruments', name: 'Musical Instruments', slug: 'musical-instruments' },
      { id: 'fitness', name: 'Fitness & Gym Equipment', slug: 'fitness' },
    ],
  },
];

export const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: '729481902830192',
    title: 'Apple MacBook Pro 14" M3 Pro (18GB / 512GB Space Black) - Like New',
    description: 'Selling my MacBook Pro 14 M3 Pro in pristine condition. Battery health 98% with only 34 cycle counts. Complete with original 70W MagSafe charger, braided black cable, and box. No scratches, clean screen. Reason for selling: Upgraded to M3 Max for heavy video editing.',
    price: {
      amount: 25500000,
      currency: 'IDR',
      formatted: 'Rp 25.500.000',
    },
    location: {
      city: 'Jakarta Selatan',
      state: 'DKI Jakarta',
      country: 'Indonesia',
      latitude: -6.2615,
      longitude: 106.8106,
    },
    seller: {
      id: '10008472910384',
      name: 'Reza Pratama',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      profileUrl: 'https://www.facebook.com/profile.php?id=10008472910384',
      joinDate: 'Joined Facebook in 2014',
      rating: 4.9,
      ratingsCount: 42,
    },
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    photoUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
    ],
    category: 'electronics',
    condition: 'used_like_new',
    creationTime: '2026-09-17T09:30:00Z',
    isSold: false,
    isPending: false,
    url: 'https://www.facebook.com/marketplace/item/729481902830192/',
    attributes: {
      brand: 'Apple',
      model: 'MacBook Pro 14"',
      processor: 'Apple M3 Pro 11-core',
      ram: '18 GB Unified Memory',
      storage: '512 GB SSD',
      color: 'Space Black',
    },
  },
  {
    id: '810394829103918',
    title: 'Honda Vario 160 ABS 2024 - Pajak Hidup Plat B Jaksel',
    description: 'Dijual motor Honda Vario 160 ABS tahun 2024 warna Grande Matte White. Odometer 6.200 km jalan. Servis rutin selalu di AHASS, buku servis & kunci cadangan smart key lengkap. Surat lengkap STNK + BPKB atas nama pribadi, pajak panjang sampai Mei 2027. Lokasi Kebayoran Baru, Jakarta Selatan.',
    price: {
      amount: 26800000,
      currency: 'IDR',
      formatted: 'Rp 26.800.000',
    },
    location: {
      city: 'Jakarta Selatan',
      state: 'DKI Jakarta',
      country: 'Indonesia',
      latitude: -6.2415,
      longitude: 106.8021,
    },
    seller: {
      id: '10002938472910',
      name: 'Dimas Wijaya',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      profileUrl: 'https://www.facebook.com/profile.php?id=10002938472910',
      joinDate: 'Joined Facebook in 2011',
      rating: 5.0,
      ratingsCount: 18,
    },
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
    photoUrls: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
    ],
    category: 'vehicles',
    condition: 'used_like_new',
    creationTime: '2026-09-16T14:15:00Z',
    isSold: false,
    isPending: false,
    url: 'https://www.facebook.com/marketplace/item/810394829103918/',
    attributes: {
      brand: 'Honda',
      model: 'Vario 160 ABS',
      year: '2024',
      mileage: '6200 km',
      transmission: 'Automatic',
    },
  },
  {
    id: '901293847192039',
    title: 'Sony PlayStation 5 Slim Disc Edition + 2 DualSense Controllers + FC 25',
    description: 'PS5 Slim Disc version bought 3 months ago. Includes 2 original DualSense controllers (White & Midnight Black), original HDMI 2.1 cable, power cord, and EA Sports FC 25 physical disc. Mint condition, clean fans, smoke-free home.',
    price: {
      amount: 460,
      currency: 'USD',
      formatted: '$460.00',
    },
    location: {
      city: 'New York',
      state: 'NY',
      country: 'United States',
      latitude: 40.7128,
      longitude: -74.006,
    },
    seller: {
      id: '10009482019382',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      profileUrl: 'https://www.facebook.com/profile.php?id=10009482019382',
      joinDate: 'Joined Facebook in 2016',
      rating: 4.8,
      ratingsCount: 35,
    },
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
    photoUrls: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
    ],
    category: 'electronics',
    condition: 'used_like_new',
    creationTime: '2026-09-15T18:20:00Z',
    isSold: false,
    isPending: false,
    url: 'https://www.facebook.com/marketplace/item/901293847192039/',
    attributes: {
      brand: 'Sony',
      platform: 'PlayStation 5 Slim',
      storage: '1 TB SSD',
    },
  },
  {
    id: '192837465910293',
    title: 'Herman Miller Aeron Chair (Size B, Fully Loaded with PostureFit SL)',
    description: 'Authentic Herman Miller Aeron ergonomic office chair in Mineral/Graphite finish. Size B (Medium). Features PostureFit SL lumbar support, fully adjustable armrests, forward tilt, and tilt limiter. All mechanisms operate flawlessly.',
    price: {
      amount: 680,
      currency: 'USD',
      formatted: '$680.00',
    },
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    seller: {
      id: '10001029384756',
      name: 'Sarah Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      profileUrl: 'https://www.facebook.com/profile.php?id=10001029384756',
      joinDate: 'Joined Facebook in 2012',
      rating: 5.0,
      ratingsCount: 64,
    },
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1580481077195-c9a7590d968a?w=800',
    photoUrls: [
      'https://images.unsplash.com/photo-1580481077195-c9a7590d968a?w=800',
    ],
    category: 'home_goods',
    condition: 'used_good',
    creationTime: '2026-09-14T11:00:00Z',
    isSold: false,
    isPending: false,
    url: 'https://www.facebook.com/marketplace/item/192837465910293/',
    attributes: {
      brand: 'Herman Miller',
      model: 'Aeron',
      size: 'Size B (Medium)',
      color: 'Graphite',
    },
  },
  {
    id: '671928401928374',
    title: 'iPhone 15 Pro Max 256GB Natural Titanium (Garansi iBox Aktif)',
    description: 'Dijual iPhone 15 Pro Max 256GB warna Natural Titanium. Region resmi Indonesia (PA/A - iBox), sinyal aman seumur hidup. Battery Health 94%, fisik 99% mulus terpasang tempered glass Spigen dan casing original sejak hari pertama.',
    price: {
      amount: 17800000,
      currency: 'IDR',
      formatted: 'Rp 17.800.000',
    },
    location: {
      city: 'Jakarta Barat',
      state: 'DKI Jakarta',
      country: 'Indonesia',
      latitude: -6.1683,
      longitude: 106.7589,
    },
    seller: {
      id: '10003847291048',
      name: 'Budi Santoso',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      profileUrl: 'https://www.facebook.com/profile.php?id=10003847291048',
      joinDate: 'Joined Facebook in 2017',
      rating: 4.7,
      ratingsCount: 29,
    },
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
    photoUrls: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
    ],
    category: 'electronics',
    condition: 'used_like_new',
    creationTime: '2026-09-17T12:00:00Z',
    isSold: false,
    isPending: false,
    url: 'https://www.facebook.com/marketplace/item/671928401928374/',
    attributes: {
      brand: 'Apple',
      model: 'iPhone 15 Pro Max',
      capacity: '256 GB',
      color: 'Natural Titanium',
    },
  },
  {
    id: '492817294820194',
    title: 'Fujifilm X-T5 Mirrorless Camera Body (Silver) - Low Shutter Count',
    description: 'Fujifilm X-T5 body only, Silver finish. Shutter count is only 2,800 actuations. Sensor is completely clean, screens protected by glass screen protector. Includes 2 OEM NP-W235 batteries, dual battery charger, strap, and box.',
    price: {
      amount: 1450,
      currency: 'USD',
      formatted: '$1,450.00',
    },
    location: {
      city: 'London',
      state: 'Greater London',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
    },
    seller: {
      id: '10005738291048',
      name: 'Oliver Hughes',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      profileUrl: 'https://www.facebook.com/profile.php?id=10005738291048',
      joinDate: 'Joined Facebook in 2013',
      rating: 5.0,
      ratingsCount: 51,
    },
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    photoUrls: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    ],
    category: 'electronics',
    condition: 'used_like_new',
    creationTime: '2026-09-13T10:45:00Z',
    isSold: false,
    isPending: false,
    url: 'https://www.facebook.com/marketplace/item/492817294820194/',
    attributes: {
      brand: 'Fujifilm',
      model: 'X-T5',
      sensor: '40.2MP X-Trans CMOS 5 HR',
      color: 'Silver',
    },
  },
  {
    id: '381920491827364',
    title: 'Apartemen 2BR Sudirman Park Furnished - Siap Huni Strategis',
    description: 'Disewakan Apartemen Sudirman Park Tower B lantai 18. Tipe 2 Kamar Tidur + 1 Kamar Mandi, luas 48 m2. Full furnished: AC di setiap kamar & ruang tamu, Smart TV, kulkas 2 pintu, water heater, kitchen set, kompor gas, sofa bed, ranjang queen. Fasilitas gym, kolam renang, minimarket 24 jam.',
    price: {
      amount: 7500000,
      currency: 'IDR',
      formatted: 'Rp 7.500.000 / bln',
    },
    location: {
      city: 'Jakarta Pusat',
      state: 'DKI Jakarta',
      country: 'Indonesia',
      latitude: -6.2088,
      longitude: 106.8188,
    },
    seller: {
      id: '10004928371920',
      name: 'Indah Kusuma',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      profileUrl: 'https://www.facebook.com/profile.php?id=10004928371920',
      joinDate: 'Joined Facebook in 2015',
      rating: 4.9,
      ratingsCount: 23,
    },
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    photoUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    category: 'property_rentals',
    condition: 'used_like_new',
    creationTime: '2026-09-15T08:00:00Z',
    isSold: false,
    isPending: false,
    url: 'https://www.facebook.com/marketplace/item/381920491827364/',
    attributes: {
      propertyType: 'Apartment',
      bedrooms: '2',
      bathrooms: '1',
      furnished: 'Fully Furnished',
      size: '48 m2',
    },
  },
];

export function filterMockListings(params: MarketplaceSearchParams): MarketplaceSearchResult {
  let filtered = [...MOCK_ITEMS];

  // Keyword query search
  if (params.query) {
    const q = params.query.toLowerCase().trim();
    const queryTerms = q.split(/\s+/).filter(Boolean);
    filtered = filtered.filter((item) => {
      const title = item.title.toLowerCase();
      const desc = item.description.toLowerCase();
      const cat = item.category.toLowerCase();
      return queryTerms.every((term) => title.includes(term) || desc.includes(term) || cat.includes(term));
    });
  }

  // Location filter
  if (params.location && params.location !== 'all') {
    const loc = params.location.toLowerCase();
    const cityMatches = filtered.filter(
      (item) =>
        item.location.city.toLowerCase().includes(loc) ||
        (item.location.state && item.location.state.toLowerCase().includes(loc)) ||
        (item.location.country && item.location.country.toLowerCase().includes(loc))
    );
    // If exact location match has items, prioritize them
    if (cityMatches.length > 0) {
      filtered = cityMatches;
    }
  }

  // Category filter
  if (params.category && params.category !== 'all') {
    const cat = params.category.toLowerCase();
    filtered = filtered.filter(
      (item) => item.category.toLowerCase() === cat || item.category.toLowerCase().includes(cat)
    );
  }

  // Condition filter
  if (params.condition) {
    filtered = filtered.filter((item) => item.condition === params.condition);
  }

  // Price range filter
  if (params.minPrice !== undefined) {
    filtered = filtered.filter((item) => item.price.amount >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((item) => item.price.amount <= params.maxPrice!);
  }

  // Sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case 'creation_time_desc':
        filtered.sort((a, b) => (b.creationTime || '').localeCompare(a.creationTime || ''));
        break;
      case 'best_match':
      default:
        // default order
        break;
    }
  }

  const limit = Math.min(params.limit || 20, 50);
  const items = filtered.slice(0, limit);

  return {
    items,
    totalCount: filtered.length,
    hasNextPage: filtered.length > limit,
    location: params.location || 'jakarta',
    query: params.query,
  };
}
