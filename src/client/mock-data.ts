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
    "id": "729481902830192",
    "title": "MacBook Pro M3 14 Inch Space Gray 512GB (2023) Garansi Resmi iBox",
    "description": "Dijual MacBook Pro M3 14 Inch Space Gray 512GB garansi resmi iBox Indonesia. Kondisi mulus 99% like new, battery health 100%, fullset box charger original. COD Jakarta Selatan / ekspedisi.",
    "price": {
      "amount": 24500000,
      "currency": "IDR",
      "formatted": "Rp 24.500.000"
    },
    "location": {
      "city": "Jakarta Selatan",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.2615,
      "longitude": 106.8106
    },
    "seller": {
      "id": "seller_729481902830192",
      "name": "David Kurniawan",
      "rating": 4.95,
      "ratingsCount": 42
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/800721658_28171144779232581_1762349814729114515_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=104&ccb=1-7&_nc_sid=92e707&_nc_ohc=yN1YhfD4YhkQ7kNvwEmhGTN&_nc_oc=AdpW3dFxewIo-wiuZgsECTuQ98XMqHPZXqN63tXBvz0cG8Xh1nDlKUDaTiNdslTlzYY&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQJYdmyvdMK0-TOuBNXQV_kjLZJji1w5UrSNFJ522y_p2w&oe=6AB260BF",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/800721658_28171144779232581_1762349814729114515_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=104&ccb=1-7&_nc_sid=92e707&_nc_ohc=yN1YhfD4YhkQ7kNvwEmhGTN&_nc_oc=AdpW3dFxewIo-wiuZgsECTuQ98XMqHPZXqN63tXBvz0cG8Xh1nDlKUDaTiNdslTlzYY&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQJYdmyvdMK0-TOuBNXQV_kjLZJji1w5UrSNFJ522y_p2w&oe=6AB260BF"
    ],
    "category": "electronics",
    "condition": "used_like_new",
    "creationTime": "2026-09-17T08:30:00.000Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/729481902830192/"
  },
  {
    "id": "810394829103918",
    "title": "Honda Vario 160 ABS 2023 Hitam Doff Pajak Hidup Plat B",
    "description": "Honda Vario 160 ABS tahun 2023 warna hitam doff. Kondisi mulus terawat, mesin halus standar pabrik, kelistrikan dan rem ABS normal. Surat-surat lengkap (BPKB, STNK, Faktur), pajak hidup panjang. Lokasi Jakarta Selatan.",
    "price": {
      "amount": 23800000,
      "currency": "IDR",
      "formatted": "Rp 23.800.000"
    },
    "location": {
      "city": "Jakarta Selatan",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.2715,
      "longitude": 106.8006
    },
    "seller": {
      "id": "seller_810394829103918",
      "name": "Bambang Wijaya",
      "rating": 4.9,
      "ratingsCount": 35
    },
    "primaryPhotoUrl": "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/807590916_1396203462718026_4571568057066821630_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=jFmlShOQ1G4Q7kNvwGqP-jK&_nc_oc=Adq2_tPcp09FozaUu3bd9GWy2eKIY5nH6jUN15_pebrvibQuHIzsCCEb3Zytpno5aR4&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=VcpaXDhDfkVhMor7Q5RQ0w&_nc_ss=721a0&oh=00_AQKfvd1r3R9EiKDwQsPjwBK3plKqGfx7RjzSH_1vjtFaKg&oe=6AB2576F",
    "photoUrls": [
      "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/807590916_1396203462718026_4571568057066821630_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=jFmlShOQ1G4Q7kNvwGqP-jK&_nc_oc=Adq2_tPcp09FozaUu3bd9GWy2eKIY5nH6jUN15_pebrvibQuHIzsCCEb3Zytpno5aR4&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=VcpaXDhDfkVhMor7Q5RQ0w&_nc_ss=721a0&oh=00_AQKfvd1r3R9EiKDwQsPjwBK3plKqGfx7RjzSH_1vjtFaKg&oe=6AB2576F"
    ],
    "category": "vehicles",
    "condition": "used_like_new",
    "creationTime": "2026-09-16T14:15:00.000Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/810394829103918/"
  },
  {
    "id": "3452139801633174",
    "title": "VGA RX 580 Sapphire Nitro+ 8GB",
    "description": "VGA RX 580 Sapphire Nitro+ 8GB. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 1250000,
      "currency": "IDR",
      "formatted": "IDR1,250,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.2088,
      "longitude": 106.8456
    },
    "seller": {
      "id": "seller_3452139801633174",
      "name": "Budi Santoso",
      "rating": 4.8,
      "ratingsCount": 12
    },
    "primaryPhotoUrl": "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/813692452_1818361982693324_4707038577854665262_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=111&ccb=1-7&_nc_sid=92e707&_nc_ohc=mfCExYc_m7YQ7kNvwFENNO9&_nc_oc=AdrMFI3Vh9nE81gL1kOp8dIyNYtdy6lpow2TlDeCktMbvGb814lNhks0UwSaAz9QHuQ&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQIx5DOezlnYhUxYyrt_x6aZ_0lGewylUGL_fFKDnRJ4PQ&oe=6AB257AC",
    "photoUrls": [
      "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/813692452_1818361982693324_4707038577854665262_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=111&ccb=1-7&_nc_sid=92e707&_nc_ohc=mfCExYc_m7YQ7kNvwFENNO9&_nc_oc=AdrMFI3Vh9nE81gL1kOp8dIyNYtdy6lpow2TlDeCktMbvGb814lNhks0UwSaAz9QHuQ&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQIx5DOezlnYhUxYyrt_x6aZ_0lGewylUGL_fFKDnRJ4PQ&oe=6AB257AC"
    ],
    "category": "1792291877663080",
    "condition": "used_like_new",
    "creationTime": "2026-09-18T01:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/3452139801633174/"
  },
  {
    "id": "28226384390382932",
    "title": "VGA RX 6700 XT 12GB 192 BIT GDDR6 POWERCOLOR FIGTHER SEGEL 12 GB",
    "description": "VGA RX 6700 XT 12GB 192 BIT GDDR6 POWERCOLOR FIGTHER SEGEL 12 GB. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 3300000,
      "currency": "IDR",
      "formatted": "IDR3,300,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.2038,
      "longitude": 106.8506
    },
    "seller": {
      "id": "seller_28226384390382932",
      "name": "Reza Pratama",
      "rating": 4.8999999999999995,
      "ratingsCount": 15
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/771739143_1494342386071064_7612270427229487326_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=105&ccb=1-7&_nc_sid=92e707&_nc_ohc=-dBX16Nz42IQ7kNvwHH0MtP&_nc_oc=AdqVtHs0GVasUCtpI2TXiqN_dp9Fr-izXqntKLbPEK1_VgDUcqhmxbj0ZaNAVqk1Fs4&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQK_3KKjHVqdZEOeYJmD-unZVrfmlGMFX4ND1-peOb0d9Q&oe=6AB27608",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/771739143_1494342386071064_7612270427229487326_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=105&ccb=1-7&_nc_sid=92e707&_nc_ohc=-dBX16Nz42IQ7kNvwHH0MtP&_nc_oc=AdqVtHs0GVasUCtpI2TXiqN_dp9Fr-izXqntKLbPEK1_VgDUcqhmxbj0ZaNAVqk1Fs4&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQK_3KKjHVqdZEOeYJmD-unZVrfmlGMFX4ND1-peOb0d9Q&oe=6AB27608"
    ],
    "category": "1792291877663080",
    "condition": "used_good",
    "creationTime": "2026-09-17T21:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/28226384390382932/"
  },
  {
    "id": "1736406027652180",
    "title": "TP Link Archer AX10 AX1500",
    "description": "TP Link Archer AX10 AX1500. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 250000,
      "currency": "IDR",
      "formatted": "IDR250,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1988,
      "longitude": 106.85560000000001
    },
    "seller": {
      "id": "seller_1736406027652180",
      "name": "Dimas Wijaya",
      "rating": 5,
      "ratingsCount": 18
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/794512863_1392898859068774_7171208311850031796_n.jpg?stp=c209.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=36i3gHQ7494Q7kNvwFq-gZg&_nc_oc=Adow5SXENpfokiW6h5JNUl-YkRIjucKY_tBViPVQTv1H7UYre6hTViE87GSaT9XoK_w&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQL4slH1XaSarMYzVZKDEiCjY66w0oJ1b4RQptwTkY9Hqw&oe=6AB2718B",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/794512863_1392898859068774_7171208311850031796_n.jpg?stp=c209.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=36i3gHQ7494Q7kNvwFq-gZg&_nc_oc=Adow5SXENpfokiW6h5JNUl-YkRIjucKY_tBViPVQTv1H7UYre6hTViE87GSaT9XoK_w&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQL4slH1XaSarMYzVZKDEiCjY66w0oJ1b4RQptwTkY9Hqw&oe=6AB2718B"
    ],
    "category": "1792291877663080",
    "condition": "used_like_new",
    "creationTime": "2026-09-17T17:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1736406027652180/"
  },
  {
    "id": "1012687531792103",
    "title": "Sepatu Puma Interflex Size 42 Like New",
    "description": "Sepatu Puma Interflex Size 42 Like New. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 350000,
      "currency": "IDR",
      "formatted": "IDR350,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1938,
      "longitude": 106.8606
    },
    "seller": {
      "id": "seller_1012687531792103",
      "name": "Agus Setiawan",
      "rating": 4.8,
      "ratingsCount": 21
    },
    "primaryPhotoUrl": "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/801928228_1618946193203313_779965768364317293_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=cnbp3Z808GUQ7kNvwG37JB6&_nc_oc=AdrgLYKGLwXMFq1IIDfiRs5FmeIgEua49MXVXL3Mcj-WxifV4Ij9NwD2GCKiqlF5fjY&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQIct-eMauk3F4zgWhvNgD4CJg59K7srV3d2n27slIscZQ&oe=6AB268BE",
    "photoUrls": [
      "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/801928228_1618946193203313_779965768364317293_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=cnbp3Z808GUQ7kNvwG37JB6&_nc_oc=AdrgLYKGLwXMFq1IIDfiRs5FmeIgEua49MXVXL3Mcj-WxifV4Ij9NwD2GCKiqlF5fjY&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQIct-eMauk3F4zgWhvNgD4CJg59K7srV3d2n27slIscZQ&oe=6AB268BE"
    ],
    "category": "931157863635831",
    "condition": "used_good",
    "creationTime": "2026-09-17T13:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1012687531792103/"
  },
  {
    "id": "29399994802922473",
    "title": "1990 BMW M40",
    "description": "1990 BMW M40. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 15000000,
      "currency": "IDR",
      "formatted": "IDR15,000,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1888000000000005,
      "longitude": 106.8656
    },
    "seller": {
      "id": "seller_29399994802922473",
      "name": "Hendra Gunawan",
      "rating": 4.8999999999999995,
      "ratingsCount": 24
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.30808-6/807921350_122179481546962345_2361390617551137289_n.jpg?stp=c0.130.1180.1180a_dst-jpg_tt6&cstp=mx1180x1180&ctp=s565x565&_nc_cat=110&ccb=1-7&_nc_sid=454cf4&_nc_ohc=WfcsI8C1850Q7kNvwF7qKm9&_nc_oc=AdppSU2kUAO6WCWicZk-HhyneUGnrRYbokG8SB131q4TUbkMDHYPDXSJUQzWC7MBS5k&_nc_zt=23&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJ7s_h1h1qrZUkeDwrB-KbJ5icGeQnzZtUO0O3xq6dIjw&oe=6AB26E1A",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.30808-6/807921350_122179481546962345_2361390617551137289_n.jpg?stp=c0.130.1180.1180a_dst-jpg_tt6&cstp=mx1180x1180&ctp=s565x565&_nc_cat=110&ccb=1-7&_nc_sid=454cf4&_nc_ohc=WfcsI8C1850Q7kNvwF7qKm9&_nc_oc=AdppSU2kUAO6WCWicZk-HhyneUGnrRYbokG8SB131q4TUbkMDHYPDXSJUQzWC7MBS5k&_nc_zt=23&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJ7s_h1h1qrZUkeDwrB-KbJ5icGeQnzZtUO0O3xq6dIjw&oe=6AB26E1A"
    ],
    "category": "807311116002614",
    "condition": "used_like_new",
    "creationTime": "2026-09-17T09:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/29399994802922473/"
  },
  {
    "id": "1106203161967859",
    "title": "jual cepet aja nie Dell Inspiron 14 7490 i5 gen 10",
    "description": "jual cepet aja nie Dell Inspiron 14 7490 i5 gen 10. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Tangerang. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 3550000,
      "currency": "IDR",
      "formatted": "IDR3,550,000"
    },
    "location": {
      "city": "Tangerang",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1838,
      "longitude": 106.87060000000001
    },
    "seller": {
      "id": "seller_1106203161967859",
      "name": "Fajar Nugraha",
      "rating": 5,
      "ratingsCount": 27
    },
    "primaryPhotoUrl": "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/812427199_1396864179310003_2763515448459235513_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=108&ccb=1-7&_nc_sid=92e707&_nc_ohc=B4P2D6cI5UsQ7kNvwHG0vZs&_nc_oc=AdpAACCXzhwryp68PMrSbMoqUZP9tNKB_HX5ZImAvxTB4PHsBhZVMOTrSOGwYc16fT8&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQIEnaGjD9ByrELRR_mGwhWROHSmQSVNiC2dkTjdj-K_ow&oe=6AB27D48",
    "photoUrls": [
      "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/812427199_1396864179310003_2763515448459235513_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=108&ccb=1-7&_nc_sid=92e707&_nc_ohc=B4P2D6cI5UsQ7kNvwHG0vZs&_nc_oc=AdpAACCXzhwryp68PMrSbMoqUZP9tNKB_HX5ZImAvxTB4PHsBhZVMOTrSOGwYc16fT8&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQIEnaGjD9ByrELRR_mGwhWROHSmQSVNiC2dkTjdj-K_ow&oe=6AB27D48"
    ],
    "category": "1792291877663080",
    "condition": "used_good",
    "creationTime": "2026-09-17T05:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1106203161967859/"
  },
  {
    "id": "1699909997737075",
    "title": "ROUTER ASUS ROG RT-AC5300",
    "description": "ROUTER ASUS ROG RT-AC5300. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 725000,
      "currency": "IDR",
      "formatted": "IDR725,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1788,
      "longitude": 106.8756
    },
    "seller": {
      "id": "seller_1699909997737075",
      "name": "Rian Hidayat",
      "rating": 4.8,
      "ratingsCount": 30
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/808547248_832562389901730_2804812334732033766_n.jpg?stp=c0.0.526.526a_dst-jpg_p526x395_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=_2kNBzx19pcQ7kNvwG60Lln&_nc_oc=AdpcAtKjM4TiSrmwhAkNyAYA-tFXXaJNIVht2uSutaeHDu6Ur-gTC0wzPNh0SBEq-UE&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQLYHhIj9OCkfkGN2B4OyLVE4YRgcyOSNajtYQhlbZCwCg&oe=6AB266C3",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/808547248_832562389901730_2804812334732033766_n.jpg?stp=c0.0.526.526a_dst-jpg_p526x395_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=_2kNBzx19pcQ7kNvwG60Lln&_nc_oc=AdpcAtKjM4TiSrmwhAkNyAYA-tFXXaJNIVht2uSutaeHDu6Ur-gTC0wzPNh0SBEq-UE&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQLYHhIj9OCkfkGN2B4OyLVE4YRgcyOSNajtYQhlbZCwCg&oe=6AB266C3"
    ],
    "category": "1792291877663080",
    "condition": "used_like_new",
    "creationTime": "2026-09-17T01:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1699909997737075/"
  },
  {
    "id": "2235057210403517",
    "title": "JUAL TV LG 50 IN SERI 50LB561 DIGITAL AJA BELUM ANDROID",
    "description": "JUAL TV LG 50 IN SERI 50LB561 DIGITAL AJA BELUM ANDROID. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 1700000,
      "currency": "IDR",
      "formatted": "IDR1,700,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1738,
      "longitude": 106.8806
    },
    "seller": {
      "id": "seller_2235057210403517",
      "name": "Budi Santoso",
      "rating": 4.8999999999999995,
      "ratingsCount": 33
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/809386656_1069469459127057_5391308391110304443_n.jpg?stp=c90.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=MPhLARrRZ34Q7kNvwGsvC9v&_nc_oc=AdrciPz8nNzXvfO_16uMnkPOEU9Y0HJcoik2ObdkZLQZILG6YgzVRfueWgxV_flmN_8&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQL8yl7kUy0QZmy_hkBa1FNKszx1g-xaZKNaiAS6TRhCqw&oe=6AB28262",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/809386656_1069469459127057_5391308391110304443_n.jpg?stp=c90.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=MPhLARrRZ34Q7kNvwGsvC9v&_nc_oc=AdrciPz8nNzXvfO_16uMnkPOEU9Y0HJcoik2ObdkZLQZILG6YgzVRfueWgxV_flmN_8&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQL8yl7kUy0QZmy_hkBa1FNKszx1g-xaZKNaiAS6TRhCqw&oe=6AB28262"
    ],
    "category": "1792291877663080",
    "condition": "used_good",
    "creationTime": "2026-09-16T21:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/2235057210403517/"
  },
  {
    "id": "902665879540250",
    "title": "VGA MSI GAMING Z+ GEFORCE GTX 1660 SUPER 6GB GDDR6 - DUAL FAN",
    "description": "VGA MSI GAMING Z+ GEFORCE GTX 1660 SUPER 6GB GDDR6 - DUAL FAN. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 1900000,
      "currency": "IDR",
      "formatted": "IDR1,900,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1688,
      "longitude": 106.88560000000001
    },
    "seller": {
      "id": "seller_902665879540250",
      "name": "Reza Pratama",
      "rating": 5,
      "ratingsCount": 36
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/728463117_1548055773526690_2045344493421311264_n.jpg?stp=c90.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=g4j6QzvcdgEQ7kNvwGFvQ3x&_nc_oc=Ado-I_FbugnFIF_J86h8kwxSPg-IS3M233pUijot7fKhzrSr6XrV7byn4PVayF4IWFE&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQKvSYQFT567kU-jSo4sWnvDT-giHYuqLG1FWxhaVmp9tg&oe=6AB264BD",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/728463117_1548055773526690_2045344493421311264_n.jpg?stp=c90.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=g4j6QzvcdgEQ7kNvwGFvQ3x&_nc_oc=Ado-I_FbugnFIF_J86h8kwxSPg-IS3M233pUijot7fKhzrSr6XrV7byn4PVayF4IWFE&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQKvSYQFT567kU-jSo4sWnvDT-giHYuqLG1FWxhaVmp9tg&oe=6AB264BD"
    ],
    "category": "1792291877663080",
    "condition": "used_like_new",
    "creationTime": "2026-09-16T17:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/902665879540250/"
  },
  {
    "id": "2928621767489834",
    "title": "‎Asus ROG Strix G512LI",
    "description": "‎Asus ROG Strix G512LI. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 9500000,
      "currency": "IDR",
      "formatted": "IDR9,500,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1638,
      "longitude": 106.8906
    },
    "seller": {
      "id": "seller_2928621767489834",
      "name": "Dimas Wijaya",
      "rating": 4.8,
      "ratingsCount": 39
    },
    "primaryPhotoUrl": "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/799251057_1795806781778688_793299626655138629_n.jpg?stp=c0.88.526.526a_dst-jpg_p526x395_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=kmjqr1v4ASgQ7kNvwEuTxXv&_nc_oc=AdouJw750zUEl3YfX3y3c8Zt3L0FDLMWkwHPbsrzuOVqZ70oj_E95za1MyRQJRPcDHo&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJqth4yFN9HEniaamM4ry3L3zuYOlf1Oi6qtDjMKWmN8w&oe=6AB28136",
    "photoUrls": [
      "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/799251057_1795806781778688_793299626655138629_n.jpg?stp=c0.88.526.526a_dst-jpg_p526x395_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=kmjqr1v4ASgQ7kNvwEuTxXv&_nc_oc=AdouJw750zUEl3YfX3y3c8Zt3L0FDLMWkwHPbsrzuOVqZ70oj_E95za1MyRQJRPcDHo&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJqth4yFN9HEniaamM4ry3L3zuYOlf1Oi6qtDjMKWmN8w&oe=6AB28136"
    ],
    "category": "1792291877663080",
    "condition": "used_good",
    "creationTime": "2026-09-16T13:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/2928621767489834/"
  },
  {
    "id": "1626913898793909",
    "title": "Gogle pixel 9 Pro xl",
    "description": "Gogle pixel 9 Pro xl. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 123456,
      "currency": "IDR",
      "formatted": "IDR123,456"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1588,
      "longitude": 106.8956
    },
    "seller": {
      "id": "seller_1626913898793909",
      "name": "Agus Setiawan",
      "rating": 4.8999999999999995,
      "ratingsCount": 42
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/813244122_1605006347703301_5757945407604138058_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=105&ccb=1-7&_nc_sid=92e707&_nc_ohc=ZtUkWmt8nn8Q7kNvwG6E0kw&_nc_oc=AdoRM0eW3iuNS10OS5VNDtLerXCBxh1lZgE2JAJjP9eX4xyfqZyjMmMPPSoztCkKVaQ&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQK4LoOKEiSCoYzK-S7Tiw8o8h8D9BaZiTfRosNfpU9imA&oe=6AB26670",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/813244122_1605006347703301_5757945407604138058_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=105&ccb=1-7&_nc_sid=92e707&_nc_ohc=ZtUkWmt8nn8Q7kNvwG6E0kw&_nc_oc=AdoRM0eW3iuNS10OS5VNDtLerXCBxh1lZgE2JAJjP9eX4xyfqZyjMmMPPSoztCkKVaQ&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQK4LoOKEiSCoYzK-S7Tiw8o8h8D9BaZiTfRosNfpU9imA&oe=6AB26670"
    ],
    "category": "1557869527812749",
    "condition": "used_like_new",
    "creationTime": "2026-09-16T09:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1626913898793909/"
  },
  {
    "id": "923292890849481",
    "title": "RAZER Wolferine Ultimate",
    "description": "RAZER Wolferine Ultimate. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 400000,
      "currency": "IDR",
      "formatted": "IDR400,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1538,
      "longitude": 106.90060000000001
    },
    "seller": {
      "id": "seller_923292890849481",
      "name": "Hendra Gunawan",
      "rating": 5,
      "ratingsCount": 45
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/790301032_925297943508900_5711053602776221755_n.jpg?stp=c0.204.526.526a_dst-jpg_p526x395_tt6&_nc_cat=104&ccb=1-7&_nc_sid=92e707&_nc_ohc=z1bPfc3Pl4UQ7kNvwEDSOZo&_nc_oc=Adofh_gsZaY9kW0BHdUdAgjt4BViDCvFREgvtHDxWA9pNHEV5GS-8OJX5CHRZRYQ9bc&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQLmiodMOhtl5YYLkYBIz_4WEg7DAldLpbpWUCxpjNqngw&oe=6AB27C63",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/790301032_925297943508900_5711053602776221755_n.jpg?stp=c0.204.526.526a_dst-jpg_p526x395_tt6&_nc_cat=104&ccb=1-7&_nc_sid=92e707&_nc_ohc=z1bPfc3Pl4UQ7kNvwEDSOZo&_nc_oc=Adofh_gsZaY9kW0BHdUdAgjt4BViDCvFREgvtHDxWA9pNHEV5GS-8OJX5CHRZRYQ9bc&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQLmiodMOhtl5YYLkYBIz_4WEg7DAldLpbpWUCxpjNqngw&oe=6AB27C63"
    ],
    "category": "606456512821491",
    "condition": "used_good",
    "creationTime": "2026-09-16T05:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/923292890849481/"
  },
  {
    "id": "1341951571053168",
    "title": "VGA RX 590 GME ASROCK PHANTOM GAMING 8GB 256 BIT GDDR6 SEGEL",
    "description": "VGA RX 590 GME ASROCK PHANTOM GAMING 8GB 256 BIT GDDR6 SEGEL. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 1200000,
      "currency": "IDR",
      "formatted": "IDR1,200,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1488000000000005,
      "longitude": 106.9056
    },
    "seller": {
      "id": "seller_1341951571053168",
      "name": "Fajar Nugraha",
      "rating": 4.8,
      "ratingsCount": 48
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/787103364_27713319708363606_7327840310895086978_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=LTVwm02-hHYQ7kNvwFLieIT&_nc_oc=AdogjUgaw4eFuYbHsZsKzADqmfuZTFYv30xDUSS0yMLcOVdNfRnTU6N93PaNikppKO0&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQKAfIodJgKKfG4V2i3qYTgRsgLi_gM2ctRZShU-qIvDmw&oe=6AB24F7A",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/787103364_27713319708363606_7327840310895086978_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=LTVwm02-hHYQ7kNvwFLieIT&_nc_oc=AdogjUgaw4eFuYbHsZsKzADqmfuZTFYv30xDUSS0yMLcOVdNfRnTU6N93PaNikppKO0&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQKAfIodJgKKfG4V2i3qYTgRsgLi_gM2ctRZShU-qIvDmw&oe=6AB24F7A"
    ],
    "category": "1792291877663080",
    "condition": "used_like_new",
    "creationTime": "2026-09-16T01:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1341951571053168/"
  },
  {
    "id": "1384870287163531",
    "title": "RTX 3090 Evga 24gb",
    "description": "RTX 3090 Evga 24gb. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 2500000,
      "currency": "IDR",
      "formatted": "IDR2,500,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1438,
      "longitude": 106.9106
    },
    "seller": {
      "id": "seller_1384870287163531",
      "name": "Rian Hidayat",
      "rating": 4.8999999999999995,
      "ratingsCount": 51
    },
    "primaryPhotoUrl": "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/806337370_1555133396350985_5294288042625141522_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=111&ccb=1-7&_nc_sid=92e707&_nc_ohc=fs8GmEpDhN4Q7kNvwFRtc9P&_nc_oc=AdobcqwEe05-QFQ28x-l0qSVBSuJq6x_4ks__MR4OqWEDxJUTc9RQtCib66xFW_d9VQ&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJ7gypC00S3m1afSJmFaHKShbKPnwXkgkCReen5EIuTbA&oe=6AB27E64",
    "photoUrls": [
      "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/806337370_1555133396350985_5294288042625141522_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=111&ccb=1-7&_nc_sid=92e707&_nc_ohc=fs8GmEpDhN4Q7kNvwFRtc9P&_nc_oc=AdobcqwEe05-QFQ28x-l0qSVBSuJq6x_4ks__MR4OqWEDxJUTc9RQtCib66xFW_d9VQ&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJ7gypC00S3m1afSJmFaHKShbKPnwXkgkCReen5EIuTbA&oe=6AB27E64"
    ],
    "category": "1792291877663080",
    "condition": "used_good",
    "creationTime": "2026-09-15T21:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1384870287163531/"
  },
  {
    "id": "1388916243220750",
    "title": "ASRock Mini Desk x300 mini PC hemat daya",
    "description": "ASRock Mini Desk x300 mini PC hemat daya. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 1,
      "currency": "IDR",
      "formatted": "IDR1"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1388,
      "longitude": 106.9156
    },
    "seller": {
      "id": "seller_1388916243220750",
      "name": "Budi Santoso",
      "rating": 5,
      "ratingsCount": 54
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/811437882_1627079098762927_1978108296393554016_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=100&ccb=1-7&_nc_sid=92e707&_nc_ohc=TYNBE5-2Dx0Q7kNvwEJKmVE&_nc_oc=AdrLZdDNml4RjBiZOA97oKKrm-yLP3zzZfTpZeRoYG8VuOTuRwnYEH84y2VFbCmKj9o&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQIeM7lJ_sC1dsfGN9M41Jm4hcItHvtRFDmI9odu7LhLgQ&oe=6AB25EF2",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/811437882_1627079098762927_1978108296393554016_n.jpg?stp=c0.87.526.526a_dst-jpg_p526x395_tt6&_nc_cat=100&ccb=1-7&_nc_sid=92e707&_nc_ohc=TYNBE5-2Dx0Q7kNvwEJKmVE&_nc_oc=AdrLZdDNml4RjBiZOA97oKKrm-yLP3zzZfTpZeRoYG8VuOTuRwnYEH84y2VFbCmKj9o&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQIeM7lJ_sC1dsfGN9M41Jm4hcItHvtRFDmI9odu7LhLgQ&oe=6AB25EF2"
    ],
    "category": "1792291877663080",
    "condition": "used_like_new",
    "creationTime": "2026-09-15T17:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1388916243220750/"
  },
  {
    "id": "1372788674639194",
    "title": "Gainward GTX 1660 Super Ghost 6GB DDR6",
    "description": "Gainward GTX 1660 Super Ghost 6GB DDR6. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 2000000,
      "currency": "IDR",
      "formatted": "IDR2,000,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1338,
      "longitude": 106.92060000000001
    },
    "seller": {
      "id": "seller_1372788674639194",
      "name": "Reza Pratama",
      "rating": 4.8,
      "ratingsCount": 57
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/795644288_1807074933954856_9161753818226260968_n.jpg?stp=c210.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=C6uGbXHRMycQ7kNvwEP3q8u&_nc_oc=Adp6f2veyEvA8A8LX0NVdxqZuTFvIojrY4Ymt1V9vQ7Ia6V90sFkdSMSRFZoA74HRBw&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQL0g44Ucn_S5PxTaGJj-w6do2GgQ-jK-c13e74pM8gQWg&oe=6AB27112",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/795644288_1807074933954856_9161753818226260968_n.jpg?stp=c210.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=C6uGbXHRMycQ7kNvwEP3q8u&_nc_oc=Adp6f2veyEvA8A8LX0NVdxqZuTFvIojrY4Ymt1V9vQ7Ia6V90sFkdSMSRFZoA74HRBw&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQL0g44Ucn_S5PxTaGJj-w6do2GgQ-jK-c13e74pM8gQWg&oe=6AB27112"
    ],
    "category": "1792291877663080",
    "condition": "used_good",
    "creationTime": "2026-09-15T13:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1372788674639194/"
  },
  {
    "id": "1591415959120838",
    "title": "Tv LG 55inch",
    "description": "Tv LG 55inch. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 1000000,
      "currency": "IDR",
      "formatted": "IDR1,000,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1288,
      "longitude": 106.9256
    },
    "seller": {
      "id": "seller_1591415959120838",
      "name": "Dimas Wijaya",
      "rating": 4.8999999999999995,
      "ratingsCount": 60
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/809544118_4274150266228971_8208291418328699232_n.jpg?stp=c210.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=XLCulXLwqWEQ7kNvwGvpQZ8&_nc_oc=AdpnFNMPLYS6yHdz3if-bWQnf6cIOt3B71Sw1Zy92KhIlAPigdj2g6NS3jeA9DrbwA0&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJaicTytD5LmYrC4TbUHzUqVjj1Sn3U6YfdsEqtT9kdWA&oe=6AB28516",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/809544118_4274150266228971_8208291418328699232_n.jpg?stp=c210.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=XLCulXLwqWEQ7kNvwGvpQZ8&_nc_oc=AdpnFNMPLYS6yHdz3if-bWQnf6cIOt3B71Sw1Zy92KhIlAPigdj2g6NS3jeA9DrbwA0&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJaicTytD5LmYrC4TbUHzUqVjj1Sn3U6YfdsEqtT9kdWA&oe=6AB28516"
    ],
    "category": "1792291877663080",
    "condition": "used_like_new",
    "creationTime": "2026-09-15T09:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1591415959120838/"
  },
  {
    "id": "1611402940348911",
    "title": "TV Samsung 43 Inch\nUntuk Keluarga Tercinta",
    "description": "TV Samsung 43 Inch\nUntuk Keluarga Tercinta. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 2500000,
      "currency": "IDR",
      "formatted": "IDR2,500,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1238,
      "longitude": 106.9306
    },
    "seller": {
      "id": "seller_1611402940348911",
      "name": "Agus Setiawan",
      "rating": 5,
      "ratingsCount": 63
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/809094866_1428419979164784_5448115491841564426_n.jpg?stp=c35.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=wDjfc9b4J18Q7kNvwHLUBs6&_nc_oc=Adq9NtJgMrIQsZFcYltz-VJ-QTg5DbCFWIJdutzHKP5F2koJJK56xbou-uzhVRtpbFk&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQItDROzOrFJWcpMJLOlEo1Rg82tXYcPXSbvG15RP8r_8Q&oe=6AB2561B",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/809094866_1428419979164784_5448115491841564426_n.jpg?stp=c35.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=wDjfc9b4J18Q7kNvwHLUBs6&_nc_oc=Adq9NtJgMrIQsZFcYltz-VJ-QTg5DbCFWIJdutzHKP5F2koJJK56xbou-uzhVRtpbFk&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQItDROzOrFJWcpMJLOlEo1Rg82tXYcPXSbvG15RP8r_8Q&oe=6AB2561B"
    ],
    "category": "1792291877663080",
    "condition": "used_good",
    "creationTime": "2026-09-15T05:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1611402940348911/"
  },
  {
    "id": "1545097370366795",
    "title": "VGA GIGABYTE GEFORCE GTX 1660 Ti OC edition 6G",
    "description": "VGA GIGABYTE GEFORCE GTX 1660 Ti OC edition 6G. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Bekasi. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 1700000,
      "currency": "IDR",
      "formatted": "IDR1,700,000"
    },
    "location": {
      "city": "Bekasi",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1188,
      "longitude": 106.93560000000001
    },
    "seller": {
      "id": "seller_1545097370366795",
      "name": "Hendra Gunawan",
      "rating": 4.8,
      "ratingsCount": 66
    },
    "primaryPhotoUrl": "https://scontent-cgk1-1.xx.fbcdn.net/v/t39.84726-6/686971370_1324958066172115_1448833300965011076_n.jpg?stp=c90.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=109&ccb=1-7&_nc_sid=92e707&_nc_ohc=pOUhlixaMloQ7kNvwFVwTxN&_nc_oc=Adrq5CelH-KwCaakNb7Bs_qlb5Dg79TAQW8hUKi39aK2Ofa2t1CoYPEe6mB5CkDxdnI&_nc_zt=14&_nc_ht=scontent-cgk1-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJJhYpFT6rg7Gnem-NfgqKgywYpczlYAkhjPk4JmF-oGw&oe=6AB27EC3",
    "photoUrls": [
      "https://scontent-cgk1-1.xx.fbcdn.net/v/t39.84726-6/686971370_1324958066172115_1448833300965011076_n.jpg?stp=c90.0.540.540a_dst-jpg_p180x540_tt6&_nc_cat=109&ccb=1-7&_nc_sid=92e707&_nc_ohc=pOUhlixaMloQ7kNvwFVwTxN&_nc_oc=Adrq5CelH-KwCaakNb7Bs_qlb5Dg79TAQW8hUKi39aK2Ofa2t1CoYPEe6mB5CkDxdnI&_nc_zt=14&_nc_ht=scontent-cgk1-1.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQJJhYpFT6rg7Gnem-NfgqKgywYpczlYAkhjPk4JmF-oGw&oe=6AB27EC3"
    ],
    "category": "1792291877663080",
    "condition": "used_like_new",
    "creationTime": "2026-09-15T01:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1545097370366795/"
  },
  {
    "id": "1379130866969671",
    "title": "Sepatu NB 741 size 43",
    "description": "Sepatu NB 741 size 43. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 260000,
      "currency": "IDR",
      "formatted": "IDR260,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1138,
      "longitude": 106.9406
    },
    "seller": {
      "id": "seller_1379130866969671",
      "name": "Fajar Nugraha",
      "rating": 4.8999999999999995,
      "ratingsCount": 69
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/770719946_1381561086756203_6390130209434000172_n.jpg?stp=c0.204.526.526a_dst-jpg_p526x395_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=5bvGAh6MeUkQ7kNvwFQWjXB&_nc_oc=AdqnCG40AYeUEAQTc4RGM7bIidk8_Ueh7aoXQdn-nt45247CKJNIlVWvJ11F9GnlikU&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQLYQjqsscnzayz1yrXzI_zXjd3Cf9ZSA28l-w4bIiT60Q&oe=6AB25A44",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/770719946_1381561086756203_6390130209434000172_n.jpg?stp=c0.204.526.526a_dst-jpg_p526x395_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=5bvGAh6MeUkQ7kNvwFQWjXB&_nc_oc=AdqnCG40AYeUEAQTc4RGM7bIidk8_Ueh7aoXQdn-nt45247CKJNIlVWvJ11F9GnlikU&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=uem0oM7oOtAEcohdh3w-1g&_nc_ss=732a8&oh=00_AQLYQjqsscnzayz1yrXzI_zXjd3Cf9ZSA28l-w4bIiT60Q&oe=6AB25A44"
    ],
    "category": "931157863635831",
    "condition": "used_good",
    "creationTime": "2026-09-14T21:52:42.838Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1379130866969671/"
  },
  {
    "id": "1375899577579125",
    "title": "Macbook pro 2019 13inch 8/128",
    "description": "Macbook pro 2019 13inch 8/128. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Bekasi. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 4000000,
      "currency": "IDR",
      "formatted": "Rp 4,000,000"
    },
    "location": {
      "city": "Bekasi",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1088000000000005,
      "longitude": 106.9456
    },
    "seller": {
      "id": "seller_1375899577579125",
      "name": "Rian Hidayat",
      "rating": 5,
      "ratingsCount": 72
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/800959210_1432700778746566_176953869725544950_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=106&ccb=1-7&_nc_sid=92e707&_nc_ohc=vG84jQhrqGsQ7kNvwG0FEZ7&_nc_oc=AdqOz1TVN64n9TAY4gBVqmp62BJDxyKc5sFpn5arrVK3iDxhKUUUw0cSijVG1JJCrhQ&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQKBcFmFV_CAKovP8aE3UVce66cF0PB3bLnAHIAKlAHG0w&oe=6AB27121",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/800959210_1432700778746566_176953869725544950_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=106&ccb=1-7&_nc_sid=92e707&_nc_ohc=vG84jQhrqGsQ7kNvwG0FEZ7&_nc_oc=AdqOz1TVN64n9TAY4gBVqmp62BJDxyKc5sFpn5arrVK3iDxhKUUUw0cSijVG1JJCrhQ&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQKBcFmFV_CAKovP8aE3UVce66cF0PB3bLnAHIAKlAHG0w&oe=6AB27121"
    ],
    "category": "electronics",
    "condition": "used_like_new",
    "creationTime": "2026-09-14T17:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1375899577579125/"
  },
  {
    "id": "1080253254610812",
    "title": "Macbook Air 2019",
    "description": "Macbook Air 2019. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 4888888,
      "currency": "IDR",
      "formatted": "Rp 4,888,888"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.1038,
      "longitude": 106.95060000000001
    },
    "seller": {
      "id": "seller_1080253254610812",
      "name": "Budi Santoso",
      "rating": 4.8,
      "ratingsCount": 75
    },
    "primaryPhotoUrl": "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/812372981_914845688050246_8583166256382049947_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=5FyYj6RZ4ScQ7kNvwHYBA-f&_nc_oc=Adr2oMqVqHM5G7fYsduZ7w0mSNRSKXLU5AidnUOYNYguJpJ5R36frK9hkjDbZ9GGagc&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQKSbOooOhSshsI1_SFdetDwdOqlbwlmfB0zWlSooeFwoQ&oe=6AB25FD6",
    "photoUrls": [
      "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/812372981_914845688050246_8583166256382049947_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=5FyYj6RZ4ScQ7kNvwHYBA-f&_nc_oc=Adr2oMqVqHM5G7fYsduZ7w0mSNRSKXLU5AidnUOYNYguJpJ5R36frK9hkjDbZ9GGagc&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQKSbOooOhSshsI1_SFdetDwdOqlbwlmfB0zWlSooeFwoQ&oe=6AB25FD6"
    ],
    "category": "electronics",
    "condition": "used_good",
    "creationTime": "2026-09-14T13:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1080253254610812/"
  },
  {
    "id": "4349331471993524",
    "title": "Macbook Pro M2 8/256 (2022)",
    "description": "Macbook Pro M2 8/256 (2022). Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Depok. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 12500000,
      "currency": "IDR",
      "formatted": "Rp 12,500,000"
    },
    "location": {
      "city": "Depok",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.0988,
      "longitude": 106.9556
    },
    "seller": {
      "id": "seller_4349331471993524",
      "name": "Reza Pratama",
      "rating": 4.8999999999999995,
      "ratingsCount": 78
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/800721658_28171144779232581_1762349814729114515_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=104&ccb=1-7&_nc_sid=92e707&_nc_ohc=yN1YhfD4YhkQ7kNvwEmhGTN&_nc_oc=AdpW3dFxewIo-wiuZgsECTuQ98XMqHPZXqN63tXBvz0cG8Xh1nDlKUDaTiNdslTlzYY&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQJYdmyvdMK0-TOuBNXQV_kjLZJji1w5UrSNFJ522y_p2w&oe=6AB260BF",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/800721658_28171144779232581_1762349814729114515_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=104&ccb=1-7&_nc_sid=92e707&_nc_ohc=yN1YhfD4YhkQ7kNvwEmhGTN&_nc_oc=AdpW3dFxewIo-wiuZgsECTuQ98XMqHPZXqN63tXBvz0cG8Xh1nDlKUDaTiNdslTlzYY&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQJYdmyvdMK0-TOuBNXQV_kjLZJji1w5UrSNFJ522y_p2w&oe=6AB260BF"
    ],
    "category": "electronics",
    "condition": "used_like_new",
    "creationTime": "2026-09-14T09:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/4349331471993524/"
  },
  {
    "id": "1409705007792848",
    "title": "Macbook Pro 2016 Touchbar",
    "description": "Macbook Pro 2016 Touchbar. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Ciledug Selatan, Jawa Barat, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 4600000,
      "currency": "IDR",
      "formatted": "Rp 4,600,000"
    },
    "location": {
      "city": "Ciledug Selatan, Jawa Barat, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.0938,
      "longitude": 106.9606
    },
    "seller": {
      "id": "seller_1409705007792848",
      "name": "Dimas Wijaya",
      "rating": 5,
      "ratingsCount": 81
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/810931262_1844545376366888_2072879997090985661_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=1sFZlncEHF0Q7kNvwEmLcCm&_nc_oc=AdqBMjDKLuERSLhdA5g6jApJ9cpmoKKk27Nx1MDmT36O2JpPnFYnoYcID2K5cWLC6lQ&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQL-BFQt4BUYJYMHjKiqsi0fcCGoxk6A8uH1airHaM4fcQ&oe=6AB26126",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/810931262_1844545376366888_2072879997090985661_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=1sFZlncEHF0Q7kNvwEmLcCm&_nc_oc=AdqBMjDKLuERSLhdA5g6jApJ9cpmoKKk27Nx1MDmT36O2JpPnFYnoYcID2K5cWLC6lQ&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQL-BFQt4BUYJYMHjKiqsi0fcCGoxk6A8uH1airHaM4fcQ&oe=6AB26126"
    ],
    "category": "electronics",
    "condition": "used_good",
    "creationTime": "2026-09-14T05:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1409705007792848/"
  },
  {
    "id": "1305752331529323",
    "title": "MACBOOK AIR 2019 CORE I5 RAM 8 SSD 256 FULLSET",
    "description": "MACBOOK AIR 2019 CORE I5 RAM 8 SSD 256 FULLSET. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 5200000,
      "currency": "IDR",
      "formatted": "Rp 5,200,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.0888,
      "longitude": 106.96560000000001
    },
    "seller": {
      "id": "seller_1305752331529323",
      "name": "Agus Setiawan",
      "rating": 4.8,
      "ratingsCount": 84
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/810813819_935486402451443_6509538610852794891_n.jpg?stp=c43.0.260.260a_dst-jpg_p261x260_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=nViTsNK5EUkQ7kNvwG5buzX&_nc_oc=AdqXgO_pyczSJNhXeKZqHDrnZJDz8UFfI_wOfcBE8fvji-yY7wiikxcCdM5r1F6e2f4&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQLBHzNRU4jH-ZRZRtaIbnJbi9E2bfb1OSt4BcPOBkvZlg&oe=6AB25627",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/810813819_935486402451443_6509538610852794891_n.jpg?stp=c43.0.260.260a_dst-jpg_p261x260_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=nViTsNK5EUkQ7kNvwG5buzX&_nc_oc=AdqXgO_pyczSJNhXeKZqHDrnZJDz8UFfI_wOfcBE8fvji-yY7wiikxcCdM5r1F6e2f4&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQLBHzNRU4jH-ZRZRtaIbnJbi9E2bfb1OSt4BcPOBkvZlg&oe=6AB25627"
    ],
    "category": "electronics",
    "condition": "used_like_new",
    "creationTime": "2026-09-14T01:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1305752331529323/"
  },
  {
    "id": "1084343850766792",
    "title": "Laptop Macbook Pro , Layar 17 Inch , Ram 6Gb , Mac Os Elcapitan , Batre Awet (Siap Pakai)",
    "description": "Laptop Macbook Pro , Layar 17 Inch , Ram 6Gb , Mac Os Elcapitan , Batre Awet (Siap Pakai). Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Bekasi. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 1000000,
      "currency": "IDR",
      "formatted": "Rp 1,000,000"
    },
    "location": {
      "city": "Bekasi",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.0838,
      "longitude": 106.9706
    },
    "seller": {
      "id": "seller_1084343850766792",
      "name": "Hendra Gunawan",
      "rating": 4.8999999999999995,
      "ratingsCount": 87
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/802121410_1345614634040841_5571410751282030919_n.jpg?stp=c0.62.261.261a_dst-jpg_p261x260_tt6&_nc_cat=100&ccb=1-7&_nc_sid=92e707&_nc_ohc=xHyVDzfbV8YQ7kNvwE2OOLE&_nc_oc=Adqu95HanbT5m3kNOGaHnxq3NYL2qzeb2bZ8Rz8hbUwf1SD3X9ZO_ZIkLkxsUY5B3oQ&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQIWIB0MLVj_hTcixe2KYSK367yikT6g-CiSEZGFsJT1XQ&oe=6AB2739F",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/802121410_1345614634040841_5571410751282030919_n.jpg?stp=c0.62.261.261a_dst-jpg_p261x260_tt6&_nc_cat=100&ccb=1-7&_nc_sid=92e707&_nc_ohc=xHyVDzfbV8YQ7kNvwE2OOLE&_nc_oc=Adqu95HanbT5m3kNOGaHnxq3NYL2qzeb2bZ8Rz8hbUwf1SD3X9ZO_ZIkLkxsUY5B3oQ&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQIWIB0MLVj_hTcixe2KYSK367yikT6g-CiSEZGFsJT1XQ&oe=6AB2739F"
    ],
    "category": "electronics",
    "condition": "used_good",
    "creationTime": "2026-09-13T21:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1084343850766792/"
  },
  {
    "id": "1632930385005224",
    "title": "Macbook Air M2 8/512 GB EX DIGIMAP",
    "description": "Macbook Air M2 8/512 GB EX DIGIMAP. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 14000000,
      "currency": "IDR",
      "formatted": "Rp 14,000,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.0788,
      "longitude": 106.9756
    },
    "seller": {
      "id": "seller_1632930385005224",
      "name": "Fajar Nugraha",
      "rating": 5,
      "ratingsCount": 90
    },
    "primaryPhotoUrl": "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/797339557_841525102382431_8091167184281218754_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=qRib9g3qme4Q7kNvwEZ7uel&_nc_oc=AdqPxmN14AjBdx-a_NfPwObk6rod5FtU7fwwV5XGAEXAZzhfAhAyX136cJTOev1c-Bo&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQL5Kxg85TpiDWF3Xyx7_i5PGAk6QgfEnN7wQsNmdnYE0Q&oe=6AB2795D",
    "photoUrls": [
      "https://scontent-cgk1-2.xx.fbcdn.net/v/t39.84726-6/797339557_841525102382431_8091167184281218754_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e707&_nc_ohc=qRib9g3qme4Q7kNvwEZ7uel&_nc_oc=AdqPxmN14AjBdx-a_NfPwObk6rod5FtU7fwwV5XGAEXAZzhfAhAyX136cJTOev1c-Bo&_nc_zt=14&_nc_ht=scontent-cgk1-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQL5Kxg85TpiDWF3Xyx7_i5PGAk6QgfEnN7wQsNmdnYE0Q&oe=6AB2795D"
    ],
    "category": "electronics",
    "condition": "used_like_new",
    "creationTime": "2026-09-13T17:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1632930385005224/"
  },
  {
    "id": "1440249954655463",
    "title": "Macbook pro 2012 A1278",
    "description": "Macbook pro 2012 A1278. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Depok. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 800000,
      "currency": "IDR",
      "formatted": "Rp 800,000"
    },
    "location": {
      "city": "Depok",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.0738,
      "longitude": 106.98060000000001
    },
    "seller": {
      "id": "seller_1440249954655463",
      "name": "Rian Hidayat",
      "rating": 4.8,
      "ratingsCount": 93
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/813520337_1989758488390105_770475209438772337_n.jpg?stp=c0.101.261.261a_dst-jpg_p261x260_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=3SyUKxLHyi0Q7kNvwGYjgr7&_nc_oc=Ado6HXVm-4TvPZCFMcvCVxqu6cjyahT3PPazfcFNyQQMAVXja5xw1yVXRSgYRxpnl7o&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQITTaSwLP3AoK3bUTS0vNSm4Y1cMHk4vJ7FtKq0K_rUSg&oe=6AB27350",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/813520337_1989758488390105_770475209438772337_n.jpg?stp=c0.101.261.261a_dst-jpg_p261x260_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=3SyUKxLHyi0Q7kNvwGYjgr7&_nc_oc=Ado6HXVm-4TvPZCFMcvCVxqu6cjyahT3PPazfcFNyQQMAVXja5xw1yVXRSgYRxpnl7o&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQITTaSwLP3AoK3bUTS0vNSm4Y1cMHk4vJ7FtKq0K_rUSg&oe=6AB27350"
    ],
    "category": "electronics",
    "condition": "used_good",
    "creationTime": "2026-09-13T13:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1440249954655463/"
  },
  {
    "id": "1015325048192059",
    "title": "Macbook Pro 2020 16/512 TouchBar Space Grey",
    "description": "Macbook Pro 2020 16/512 TouchBar Space Grey. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 8800000,
      "currency": "IDR",
      "formatted": "Rp 8,800,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.0688,
      "longitude": 106.9856
    },
    "seller": {
      "id": "seller_1015325048192059",
      "name": "Budi Santoso",
      "rating": 4.8999999999999995,
      "ratingsCount": 96
    },
    "primaryPhotoUrl": "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/802863677_977073442073129_662401595957455259_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=6JKaNIO2f-QQ7kNvwHq3xPo&_nc_oc=Ado8WYOlcsYAB7wZYExQQmnG14JkYCq9Ulbq7_2mdWE77vs58Ps6yg2cM-1nWlPDCsU&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQJldU6u1hVOxDz-x6lGezXQC25uzasxuwGwK70iTK1uXg&oe=6AB28402",
    "photoUrls": [
      "https://scontent-cgk2-1.xx.fbcdn.net/v/t39.84726-6/802863677_977073442073129_662401595957455259_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=6JKaNIO2f-QQ7kNvwHq3xPo&_nc_oc=Ado8WYOlcsYAB7wZYExQQmnG14JkYCq9Ulbq7_2mdWE77vs58Ps6yg2cM-1nWlPDCsU&_nc_zt=14&_nc_ht=scontent-cgk2-1.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQJldU6u1hVOxDz-x6lGezXQC25uzasxuwGwK70iTK1uXg&oe=6AB28402"
    ],
    "category": "electronics",
    "condition": "used_like_new",
    "creationTime": "2026-09-13T09:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1015325048192059/"
  },
  {
    "id": "1077040678149540",
    "title": "Macbook Pro 13 2019 sec Nego",
    "description": "Macbook Pro 13 2019 sec Nego. Kondisi terawat siap pakai, pemakaian pribadi. Lokasi Jakarta, Indonesia. Minat bisa langsung hubungi atau chat di Facebook Marketplace.",
    "price": {
      "amount": 7000000,
      "currency": "IDR",
      "formatted": "Rp 7,000,000"
    },
    "location": {
      "city": "Jakarta, Indonesia",
      "state": "DKI Jakarta",
      "country": "Indonesia",
      "latitude": -6.0638000000000005,
      "longitude": 106.9906
    },
    "seller": {
      "id": "seller_1077040678149540",
      "name": "Reza Pratama",
      "rating": 5,
      "ratingsCount": 99
    },
    "primaryPhotoUrl": "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/809458803_2619945631791007_4873145980593545268_n.jpg?stp=c0.101.261.261a_dst-jpg_p261x260_tt6&_nc_cat=110&ccb=1-7&_nc_sid=92e707&_nc_ohc=cTtEpJNf1rAQ7kNvwFTSQ9C&_nc_oc=Adrk4hLsEcoC6fu2icvrdhSQ9vEWAcS9pfLuuDb439XvvqSxApNn6GgdQNVD6HteTjY&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQITEsKqswpYkEmDhLNJtEI1drkRAS46r1kmdkwpsqQhJg&oe=6AB27FF8",
    "photoUrls": [
      "https://scontent-cgk2-2.xx.fbcdn.net/v/t39.84726-6/809458803_2619945631791007_4873145980593545268_n.jpg?stp=c0.101.261.261a_dst-jpg_p261x260_tt6&_nc_cat=110&ccb=1-7&_nc_sid=92e707&_nc_ohc=cTtEpJNf1rAQ7kNvwFTSQ9C&_nc_oc=Adrk4hLsEcoC6fu2icvrdhSQ9vEWAcS9pfLuuDb439XvvqSxApNn6GgdQNVD6HteTjY&_nc_zt=14&_nc_ht=scontent-cgk2-2.xx&_nc_gid=K8PKCYQZ4nWm6rlQNnUJCg&_nc_ss=7f2a8&oh=00_AQITEsKqswpYkEmDhLNJtEI1drkRAS46r1kmdkwpsqQhJg&oe=6AB27FF8"
    ],
    "category": "electronics",
    "condition": "used_good",
    "creationTime": "2026-09-13T05:52:42.839Z",
    "isSold": false,
    "isPending": false,
    "url": "https://www.facebook.com/marketplace/item/1077040678149540/"
  }
];

export function filterMockListings(params: MarketplaceSearchParams): MarketplaceSearchResult {
  let filtered = [...MOCK_ITEMS];

  // Keyword query search
  if (params.query) {
    const q = params.query.toLowerCase().trim();
    const queryTerms = q.split(/\s+/).filter(Boolean);
    const matches = filtered.filter((item) => {
      const title = item.title.toLowerCase();
      const desc = item.description.toLowerCase();
      const cat = item.category.toLowerCase();
      return queryTerms.some((term) => title.includes(term) || desc.includes(term) || cat.includes(term));
    });

    if (matches.length > 0) {
      filtered = matches;
    } else {
      // Dynamic fallback matching query without broken Unsplash placeholders
      const sampleItem = MOCK_ITEMS[0];
      filtered = [
        {
          id: `${Date.now()}101`,
          title: `${params.query.toUpperCase()} - Mulus Siap Pakai`,
          description: `Dijual ${params.query} kondisi prima, pemakaian apik. Lengkap dengan aksesoris original. Bisa COD Jakarta / kirim via ekspedisi.`,
          price: {
            amount: 2500000,
            currency: 'IDR',
            formatted: formatPrice(2500000, 'IDR'),
          },
          location: {
            city: params.location || 'Jakarta Selatan',
            state: 'DKI Jakarta',
            country: 'Indonesia',
          },
          seller: {
            id: 'seller_live_101',
            name: 'Penjual Facebook',
            rating: 4.9,
            ratingsCount: 28,
          },
          primaryPhotoUrl: sampleItem.primaryPhotoUrl,
          photoUrls: [sampleItem.primaryPhotoUrl],
          category: params.category || 'electronics',
          condition: 'used_like_new',
          creationTime: new Date().toISOString(),
          isSold: false,
          isPending: false,
          url: `https://www.facebook.com/marketplace/item/${Date.now()}101/`,
        },
        ...MOCK_ITEMS.slice(0, 4),
      ];
    }
  }

  // Category filter
  if (params.category && params.category !== 'all') {
    const cat = params.category.toLowerCase();
    const catMatches = filtered.filter(
      (item) => item.category.toLowerCase() === cat || item.category.toLowerCase().includes(cat)
    );
    if (catMatches.length > 0) {
      filtered = catMatches;
    }
  }

  // Condition filter
  if (params.condition) {
    const condMatches = filtered.filter((item) => item.condition === params.condition);
    if (condMatches.length > 0) {
      filtered = condMatches;
    }
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
      default:
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
