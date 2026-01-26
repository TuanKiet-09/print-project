import { BaseProduct } from './types';

export const CANVAS_SIZE = 600;

export const AVAILABLE_FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Oswald', value: 'Oswald' },
  { name: 'Pacifico', value: 'Pacifico' },
  { name: 'Arial', value: 'Arial' },
];

// Placeholder URLs for the White T-Shirt Base Images (Transparent PNGs)
// NOTE: Replace these with the actual URLs of the images provided if they are hosted, 
// or base64 strings. Using high-quality transparent mockups here for demonstration.
const SHIRT_FRONT_URL = "https://i.postimg.cc/sgXMdLWK/front-white-t-shirts.png";
const SHIRT_BACK_URL = "https://i.postimg.cc/K8z1SWTf/back-white-t-shirts.png"; // Assuming similar back view or reuse

const TSHIRT_VARIANTS = [
  { id: 'v1_white', name: 'White', colorHex: '#ffffff' },
  { id: 'v1_red', name: 'Red', colorHex: '#ef4444' },
  { id: 'v1_black', name: 'Black', colorHex: '#171717' }, // Dark grey to preserve some texture
  { id: 'v1_orange', name: 'Orange', colorHex: '#f97316' },
  { id: 'v1_yellow', name: 'Yellow', colorHex: '#eab308' },
  { id: 'v1_blue', name: 'Blue', colorHex: '#3b82f6' },
  { id: 'v1_grey', name: 'Grey', colorHex: '#6b7280' },
].map(v => ({
  ...v,
  imageFront: SHIRT_FRONT_URL,
  imageBack: SHIRT_BACK_URL,
  price: 150000
}));

export const MOCK_PRODUCTS: BaseProduct[] = [
  {
    id: 'p1',
    name: 'Classic Cotton T-Shirt',
    type: 't-shirt',
    printArea: { width: 200, height: 300, top: 150, left: 200 }, // Adjusted for the specific image layout
    variants: TSHIRT_VARIANTS
  },
  // {
  //   id: 'p2',
  //   name: 'Premium Hoodie',
  //   type: 'hoodie',
  //   printArea: { width: 280, height: 350, top: 120, left: 160 },
  //   variants: [
  //     {
  //       id: 'v2_grey',
  //       name: 'Heather Grey',
  //       colorHex: '#9ca3af',
  //       imageFront: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
  //       imageBack: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
  //       price: 350000,
  //     }
  //   ]
  // }
];

export const CLIPARTS = [
  { id: 'c1', url: 'https://cdn-icons-png.flaticon.com/512/2904/2904838.png', category: 'Emoji' },
  { id: 'c2', url: 'https://cdn-icons-png.flaticon.com/512/826/826955.png', category: 'Nature' },
  { id: 'c3', url: 'https://cdn-icons-png.flaticon.com/512/190/190666.png', category: 'Space' },
  { id: 'c4', url: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', category: 'Animals' },
];

export const MOCK_ORDERS = [
  { id: '#ORD-001', customerName: 'Nguyen Van A', date: '2023-10-25', status: 'processing', total: 150000, thumbnail: SHIRT_FRONT_URL },
  { id: '#ORD-002', customerName: 'Tran Thi B', date: '2023-10-26', status: 'pending', total: 350000, thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100' },
];
