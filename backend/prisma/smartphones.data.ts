// import { Category, Prisma } from '@prisma/client';

// export interface SmartphoneAttributes extends Prisma.JsonObject {
//   ram: number;
//   storage: number;
//   screenSize: number;
//   screenType: 'AMOLED' | 'OLED' | 'IPS';
//   refreshRate?: number;
//   processor: string;
//   battery?: number;
//   mainCamera?: number;
//   frontCamera?: number;
//   os: 'iOS' | 'Android';
//   simType?: 'Nano-SIM' | 'Dual SIM' | 'eSIM + Nano-SIM';
//   color: string;
//   weight?: number;
//   has5G?: boolean;
//   hasNfc?: boolean;
//   eSimSupport?: boolean;
// }

// export interface RawSmartphoneData {
//   name: string;
//   category: Category;
//   brand: string;
//   price: number;
//   stockQuantity: number;
//   images: string[];
//   description: string;
//   attributes: SmartphoneAttributes;
// }

// const smartphones: RawSmartphoneData[] = [
//   // ==================== APPLE ====================
//   {
//     name: 'Apple iPhone 16',
//     category: Category.SMARTPHONE,
//     brand: 'Apple',
//     price: 799.99,
//     stockQuantity: 40,
//     images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569'],
//     description:
//       'Base flagship introducing the Action Button, Camera Control, A18 chip built for Apple Intelligence, and vibrant color-infused glass.',
//     attributes: {
//       ram: 8,
//       storage: 128,
//       screenSize: 6.1,
//       screenType: 'OLED',
//       refreshRate: 60,
//       processor: 'Apple A18',
//       battery: 3561,
//       mainCamera: 48,
//       frontCamera: 12,
//       os: 'iOS',
//       simType: 'eSIM + Nano-SIM',
//       color: 'Ultramarine',
//       weight: 170,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: true,
//     },
//   },
//   {
//     name: 'Apple iPhone 16 Pro Max',
//     category: Category.SMARTPHONE,
//     brand: 'Apple',
//     price: 1199.99,
//     stockQuantity: 30,
//     images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569'],
//     description:
//       'Features a larger 6.9-inch display, Grade 5 Titanium frame, A18 Pro chip, and dedicated Camera Control button.',
//     attributes: {
//       ram: 8,
//       storage: 256,
//       screenSize: 6.9,
//       screenType: 'OLED',
//       refreshRate: 120,
//       processor: 'Apple A18 Pro',
//       battery: 4685,
//       mainCamera: 48,
//       frontCamera: 12,
//       os: 'iOS',
//       simType: 'eSIM + Nano-SIM',
//       color: 'Desert Titanium',
//       weight: 227,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: true,
//     },
//   },
//   {
//     name: 'Apple iPhone 17',
//     category: Category.SMARTPHONE,
//     brand: 'Apple',
//     price: 899.99,
//     stockQuantity: 35,
//     images: ['https://images.unsplash.com/photo-1695048065057-0243e33b6643'],
//     description:
//       'Standard 2025 iPhone upgraded with 120Hz ProMotion display, A19 chip, and enhanced front TrueDepth camera.',
//     attributes: {
//       ram: 8,
//       storage: 256,
//       screenSize: 6.3,
//       screenType: 'OLED',
//       refreshRate: 120,
//       processor: 'Apple A19',
//       battery: 3800,
//       mainCamera: 48,
//       frontCamera: 24,
//       os: 'iOS',
//       simType: 'eSIM + Nano-SIM',
//       color: 'Sage Green',
//       weight: 177,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: true,
//     },
//   },
//   {
//     name: 'Apple iPhone 17 Pro',
//     category: Category.SMARTPHONE,
//     brand: 'Apple',
//     price: 1099.99,
//     stockQuantity: 35,
//     images: ['https://images.unsplash.com/photo-1695048065057-0243e33b6643'],
//     description:
//       'Powered by the A19 Pro chip with 12GB RAM, 120Hz ProMotion screen, and upgraded 48MP lenses on all rear cameras.',
//     attributes: {
//       ram: 12,
//       storage: 256,
//       screenSize: 6.3,
//       screenType: 'OLED',
//       refreshRate: 120,
//       processor: 'Apple A19 Pro',
//       battery: 4100,
//       mainCamera: 48,
//       frontCamera: 24,
//       os: 'iOS',
//       simType: 'eSIM + Nano-SIM',
//       color: 'Teal Titanium',
//       weight: 191,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: true,
//     },
//   },
//   {
//     name: 'Apple iPhone 18 Pro',
//     category: Category.SMARTPHONE,
//     brand: 'Apple',
//     price: 1199.99,
//     stockQuantity: 20,
//     images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569'],
//     description:
//       'Next-gen flagship featuring 2nm A20 Pro SoC, under-display Face ID, and variable mechanical aperture lens.',
//     attributes: {
//       ram: 12,
//       storage: 256,
//       screenSize: 6.3,
//       screenType: 'OLED',
//       refreshRate: 120,
//       processor: 'Apple A20 Pro',
//       battery: 4300,
//       mainCamera: 48,
//       frontCamera: 24,
//       os: 'iOS',
//       simType: 'eSIM + Nano-SIM',
//       color: 'Deep Titanium',
//       weight: 188,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: true,
//     },
//   },

//   // ==================== SAMSUNG ====================
//   {
//     name: 'Samsung Galaxy A55 5G',
//     category: Category.SMARTPHONE,
//     brand: 'Samsung',
//     price: 449.99,
//     stockQuantity: 60,
//     images: ['https://images.unsplash.com/photo-1583573636246-18cb2246697f'],
//     description:
//       'Mid-range champ with a metal frame, 6.6-inch FHD+ Super AMOLED 120Hz display, and Samsung Knox Vault security.',
//     attributes: {
//       ram: 8,
//       storage: 128,
//       screenSize: 6.6,
//       screenType: 'AMOLED',
//       refreshRate: 120,
//       processor: 'Exynos 1480',
//       battery: 5000,
//       mainCamera: 50,
//       frontCamera: 32,
//       os: 'Android',
//       simType: 'Dual SIM',
//       color: 'Awesome Iceblue',
//       weight: 213,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: true,
//     },
//   },
//   {
//     name: 'Samsung Galaxy S24 Ultra',
//     category: Category.SMARTPHONE,
//     brand: 'Samsung',
//     price: 1299.99,
//     stockQuantity: 25,
//     images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf'],
//     description:
//       'Built with Galaxy AI, a flat 6.8-inch QHD+ AMOLED display, Titanium frame, integrated S Pen, and 200MP Quad Telephoto camera.',
//     attributes: {
//       ram: 12,
//       storage: 512,
//       screenSize: 6.8,
//       screenType: 'AMOLED',
//       refreshRate: 120,
//       processor: 'Qualcomm Snapdragon 8 Gen 3',
//       battery: 5000,
//       mainCamera: 200,
//       frontCamera: 12,
//       os: 'Android',
//       simType: 'eSIM + Nano-SIM',
//       color: 'Titanium Gray',
//       weight: 232,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: true,
//     },
//   },
//   {
//     name: 'Samsung Galaxy S25 Ultra',
//     category: Category.SMARTPHONE,
//     brand: 'Samsung',
//     price: 1299.99,
//     stockQuantity: 40,
//     images: ['https://images.unsplash.com/photo-1583573636246-18cb2246697f'],
//     description:
//       'Features rounded ergonomic corners, Snapdragon 8 Elite SoC, 16GB RAM for local AI models, and upgraded 50MP Ultrawide lens.',
//     attributes: {
//       ram: 16,
//       storage: 512,
//       screenSize: 6.86,
//       screenType: 'AMOLED',
//       refreshRate: 120,
//       processor: 'Qualcomm Snapdragon 8 Elite',
//       battery: 5000,
//       mainCamera: 200,
//       frontCamera: 12,
//       os: 'Android',
//       simType: 'eSIM + Nano-SIM',
//       color: 'Titanium Silver',
//       weight: 219,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: true,
//     },
//   },

//   // ==================== XIAOMI ====================
//   {
//     name: 'Xiaomi 14 Ultra',
//     category: Category.SMARTPHONE,
//     brand: 'Xiaomi',
//     price: 1399.99,
//     stockQuantity: 18,
//     images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
//     description:
//       'Co-engineered with Leica, featuring quad-camera system with 1-inch Sony LYT-900 sensor and stepless variable aperture.',
//     attributes: {
//       ram: 16,
//       storage: 512,
//       screenSize: 6.73,
//       screenType: 'AMOLED',
//       refreshRate: 120,
//       processor: 'Qualcomm Snapdragon 8 Gen 3',
//       battery: 5000,
//       mainCamera: 50,
//       frontCamera: 32,
//       os: 'Android',
//       simType: 'Dual SIM',
//       color: 'Black',
//       weight: 220,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: false,
//     },
//   },
//   {
//     name: 'Poco X6 Pro',
//     category: Category.SMARTPHONE,
//     brand: 'Xiaomi',
//     price: 329.99,
//     stockQuantity: 50,
//     images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97'],
//     description:
//       'Performance beast for budget gaming featuring Dimensity 8300-Ultra, CrystalRes 120Hz Flow AMOLED, and 67W Turbo Charging.',
//     attributes: {
//       ram: 12,
//       storage: 512,
//       screenSize: 6.67,
//       screenType: 'AMOLED',
//       refreshRate: 120,
//       processor: 'MediaTek Dimensity 8300-Ultra',
//       battery: 5000,
//       mainCamera: 64,
//       frontCamera: 16,
//       os: 'Android',
//       simType: 'Dual SIM',
//       color: 'Yellow',
//       weight: 186,
//       has5G: true,
//       hasNfc: true,
//       eSimSupport: false,
//     },
//   },
// ];

// export default smartphones;
