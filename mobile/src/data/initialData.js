// Initial categories and pre-populated catalog for NP Electricals (React Native)

export const DEFAULT_CATEGORY_IMAGES = {
  bulb: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?w=600&auto=format&fit=crop&q=80',
  holder: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80',
  screw: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80',
  bend_elbow: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
  motor: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  switch: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
  tap: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  ball_valve: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80',
  bearing: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
  other: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80'
};

export const getCategoryDefaultImage = (categoryId) => {
  return DEFAULT_CATEGORY_IMAGES[categoryId] || DEFAULT_CATEGORY_IMAGES.other;
};

export const getProductDefaultImage = (product, categoryId) => {
  if (product && product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim()) {
    return product.imageUrl;
  }
  const cat = (product && (product.category || product.categoryId)) || categoryId || 'other';
  return getCategoryDefaultImage(cat);
};

export const INITIAL_CATEGORIES = [
  { id: 'bulb', name: 'Bulb', tamilName: 'பல்பு', icon: 'lightbulb-outline', sizesPreview: '9W, 12W, 20W, 25W, 0.5W', imageUrl: DEFAULT_CATEGORY_IMAGES.bulb },
  { id: 'holder', name: 'Holder', tamilName: 'ஹோல்டர்', icon: 'flash-outline', sizesPreview: 'Straight, Angle, Hanging, Adaptor', imageUrl: DEFAULT_CATEGORY_IMAGES.holder },
  { id: 'screw', name: 'Screw', tamilName: 'ஸ்க்ரூ', icon: 'build-outline', sizesPreview: '0.5 inch, 1 inch, 1.5 inch, 2 inch, 3 inch', imageUrl: DEFAULT_CATEGORY_IMAGES.screw },
  { id: 'bend_elbow', name: 'Bend / Elbow', tamilName: 'பெண்ட் / எல்போ', icon: 'git-branch-outline', sizesPreview: '1/2", 3/4", 1" (Conduit & Plumbing)', imageUrl: DEFAULT_CATEGORY_IMAGES.bend_elbow },
  { id: 'motor', name: 'Motor', tamilName: 'மோட்டார்', icon: 'hardware-chip-outline', sizesPreview: '0.5 HP, 1.0 HP, 1.5 HP, Starter Box', imageUrl: DEFAULT_CATEGORY_IMAGES.motor },
  { id: 'switch', name: 'Switch', tamilName: 'ஸ்விட்ச்', icon: 'toggle-outline', sizesPreview: '6A Piano, 16A Power, Modular, Bell Push', imageUrl: DEFAULT_CATEGORY_IMAGES.switch },
  { id: 'tap', name: 'Tap', tamilName: 'டேப்', icon: 'water-outline', sizesPreview: '1/2" Long Body, Brass, Swan Neck, 2-in-1', imageUrl: DEFAULT_CATEGORY_IMAGES.tap },
  { id: 'ball_valve', name: 'Ball Valve', tamilName: 'பால் வால்வு', icon: 'disc-outline', sizesPreview: '1/2", 3/4", 1", 1.5", 2" UPVC & Brass', imageUrl: DEFAULT_CATEGORY_IMAGES.ball_valve },
  { id: 'bearing', name: 'Bearing', tamilName: 'பேரிங்', icon: 'radio-button-on-outline', sizesPreview: '6201 ZZ, 6202 ZZ, 6203, 6204, 608 ZZ', imageUrl: DEFAULT_CATEGORY_IMAGES.bearing },
  { id: 'other', name: 'Other items', tamilName: 'மத்த சாமான்கள்', icon: 'cube-outline', sizesPreview: 'Wire 1.0/2.5 sq mm, Tape, Tester, M-Seal', imageUrl: DEFAULT_CATEGORY_IMAGES.other }
];

export const INITIAL_PRODUCTS = [
  // 1. Bulb
  { id: 'prod-bulb-1', categoryId: 'bulb', category: 'bulb', name: 'Bulb 9 Watt', size: '9 Watt (B22 White)', price: 95, stockCount: 24, stock: 24, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bulb-2', categoryId: 'bulb', category: 'bulb', name: 'Bulb 12 Watt', size: '12 Watt (B22 Bright)', price: 130, stockCount: 4, stock: 4, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1532007271951-c487760934ae?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bulb-3', categoryId: 'bulb', category: 'bulb', name: 'Bulb 20 Watt Batten Tubelight', size: '4 Feet / 20W', price: 210, stockCount: 12, stock: 12, lowStockAlert: 4, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bulb-4', categoryId: 'bulb', category: 'bulb', name: 'Bulb 0.5 Watt Night Deco', size: '0.5 Watt (Red/Blue/Green)', price: 35, stockCount: 30, stock: 30, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bulb-5', categoryId: 'bulb', category: 'bulb', name: 'Bulb 25 Watt High Beam', size: '25 Watt (B22 Heavy)', price: 280, stockCount: 2, stock: 2, lowStockAlert: 3, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80' },

  // 2. Holder
  { id: 'prod-holder-1', categoryId: 'holder', category: 'holder', name: 'Holder Batten Straight', size: 'Standard Straight', price: 35, stockCount: 40, stock: 40, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-holder-2', categoryId: 'holder', category: 'holder', name: 'Holder Angle Slant', size: 'Standard Angle', price: 40, stockCount: 18, stock: 18, lowStockAlert: 6, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-holder-3', categoryId: 'holder', category: 'holder', name: 'Holder Hanging Brass Cord', size: 'Hanging Cord Type', price: 45, stockCount: 3, stock: 3, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-holder-4', categoryId: 'holder', category: 'holder', name: 'Holder Multi-Adaptor 2-in-1', size: '2-Pin + B22 Adaptor', price: 55, stockCount: 15, stock: 15, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80' },

  // 3. Screw
  { id: 'prod-screw-1', categoryId: 'screw', category: 'screw', name: 'Screw 0.5 inch', size: '0.5 inch (Switch Board)', price: 45, stockCount: 20, stock: 20, lowStockAlert: 4, unit: 'pkt', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-screw-2', categoryId: 'screw', category: 'screw', name: 'Screw 1 inch', size: '1 inch (Star Head Wood)', price: 70, stockCount: 25, stock: 25, lowStockAlert: 5, unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-screw-3', categoryId: 'screw', category: 'screw', name: 'Screw 1.5 inch', size: '1.5 inch (Gypsum Screw)', price: 95, stockCount: 14, stock: 14, lowStockAlert: 5, unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-screw-4', categoryId: 'screw', category: 'screw', name: 'Screw 2 inch', size: '2 inch (Heavy Wood Screw)', price: 130, stockCount: 3, stock: 3, lowStockAlert: 5, unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-screw-5', categoryId: 'screw', category: 'screw', name: 'Screw 3 inch Wall Grip', size: '3 inch with Rawl Plug', price: 160, stockCount: 18, stock: 18, lowStockAlert: 4, unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },

  // 4. Bend / Elbow
  { id: 'prod-bend-1', categoryId: 'bend_elbow', category: 'bend_elbow', name: 'Bend 1/2 inch', size: '1/2 inch (20mm PVC)', price: 12, stockCount: 80, stock: 80, lowStockAlert: 15, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bend-2', categoryId: 'bend_elbow', category: 'bend_elbow', name: 'Bend 3/4 inch', size: '3/4 inch (25mm PVC)', price: 16, stockCount: 65, stock: 65, lowStockAlert: 15, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bend-3', categoryId: 'bend_elbow', category: 'bend_elbow', name: 'Bend 1 inch', size: '1 inch (32mm Conduit)', price: 24, stockCount: 5, stock: 5, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bend-4', categoryId: 'bend_elbow', category: 'bend_elbow', name: 'Elbow 1/2 inch CPVC', size: '1/2 inch (CPVC Plumbing)', price: 22, stockCount: 45, stock: 45, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bend-5', categoryId: 'bend_elbow', category: 'bend_elbow', name: 'Elbow 3/4 inch CPVC', size: '3/4 inch (CPVC Plumbing)', price: 32, stockCount: 35, stock: 35, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bend-6', categoryId: 'bend_elbow', category: 'bend_elbow', name: 'Elbow 1 inch UPVC', size: '1 inch (UPVC Pipe)', price: 38, stockCount: 28, stock: 28, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },

  // 5. Motor
  { id: 'prod-motor-1', categoryId: 'motor', category: 'motor', name: 'Motor 0.5 HP Monoblock', size: '0.5 HP (Single Phase)', price: 3650, stockCount: 4, stock: 4, lowStockAlert: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-motor-2', categoryId: 'motor', category: 'motor', name: 'Motor 1.0 HP Self-Priming', size: '1.0 HP (High Pressure)', price: 5400, stockCount: 1, stock: 1, lowStockAlert: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-motor-3', categoryId: 'motor', category: 'motor', name: 'Motor 1.5 HP Submersible', size: '1.5 HP Openwell Pump', price: 9800, stockCount: 2, stock: 2, lowStockAlert: 1, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-motor-4', categoryId: 'motor', category: 'motor', name: 'Motor Starter Box 1.0 HP', size: '1.0 HP with Capacitor', price: 850, stockCount: 6, stock: 6, lowStockAlert: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },

  // 6. Switch
  { id: 'prod-switch-1', categoryId: 'switch', category: 'switch', name: 'Switch 6A Piano 1-Way', size: '6 Ampere (Standard)', price: 25, stockCount: 75, stock: 75, lowStockAlert: 15, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-switch-2', categoryId: 'switch', category: 'switch', name: 'Switch 16A Power Heavy', size: '16 Ampere (Geyser/AC)', price: 55, stockCount: 40, stock: 40, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-switch-3', categoryId: 'switch', category: 'switch', name: 'Switch Bell Push with Light', size: '6 Ampere Bell Push', price: 45, stockCount: 18, stock: 18, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-switch-4', categoryId: 'switch', category: 'switch', name: 'Switch 6A Modular White', size: '6A Modular 1 Module', price: 75, stockCount: 2, stock: 2, lowStockAlert: 6, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },

  // 7. Tap
  { id: 'prod-tap-1', categoryId: 'tap', category: 'tap', name: 'Tap 1/2 inch PVC Long Body', size: '1/2 inch (Long Body)', price: 95, stockCount: 32, stock: 32, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-tap-2', categoryId: 'tap', category: 'tap', name: 'Tap 1/2 inch Solid Brass', size: '1/2 inch (Heavy Brass)', price: 240, stockCount: 8, stock: 8, lowStockAlert: 3, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-tap-3', categoryId: 'tap', category: 'tap', name: 'Tap 1/2 inch 2-in-1 Angle Cock', size: '1/2 inch (Dual Handle)', price: 320, stockCount: 11, stock: 11, lowStockAlert: 4, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },

  // 8. Ball Valve
  { id: 'prod-valve-1', categoryId: 'ball_valve', category: 'ball_valve', name: 'Ball Valve 1/2 inch UPVC', size: '1/2 inch (Handle Type)', price: 90, stockCount: 22, stock: 22, lowStockAlert: 6, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-valve-2', categoryId: 'ball_valve', category: 'ball_valve', name: 'Ball Valve 1 inch Tank', size: '1 inch Full Flow Tank', price: 175, stockCount: 4, stock: 4, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80' },

  // 9. Bearing
  { id: 'prod-bearing-1', categoryId: 'bearing', category: 'bearing', name: 'Bearing 6201 ZZ', size: '6201 ZZ (Ceiling Fan)', price: 85, stockCount: 35, stock: 35, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-bearing-2', categoryId: 'bearing', category: 'bearing', name: 'Bearing 6202 ZZ', size: '6202 ZZ (Fan Bottom)', price: 95, stockCount: 30, stock: 30, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },

  // 10. Other items
  { id: 'prod-other-1', categoryId: 'other', category: 'other', name: 'Tape Steelgrip PVC Insulation', size: '10 Metres Roll (Black)', price: 15, stockCount: 95, stock: 95, lowStockAlert: 20, unit: 'roll', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-other-2', categoryId: 'other', category: 'other', name: 'Wire Coil 1.0 Sq mm Copper', size: '90 Metres Coil (1.0 sq mm)', price: 1450, stockCount: 6, stock: 6, lowStockAlert: 3, unit: 'coil', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80' },
  { id: 'prod-other-3', categoryId: 'other', category: 'other', name: 'Tester Taparia Heavy Neon', size: '500V Heavy Duty Tester', price: 65, stockCount: 24, stock: 24, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80' }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Karthik Electrician',
    phone: '98401 23456',
    address: 'Bazaar Street, Shop Backside',
    balance: 2150,
    balanceOwed: 2150,
    purchaseHistory: [
      { id: 'bill_h1', date: '2026-10-01', amount: 2150, paymentType: 'Credit', items: [{ name: 'Wire Coil 1.0 Sq mm', qty: 1, price: 1450, total: 1450 }, { name: 'Switch 16A Power', qty: 10, price: 55, total: 550 }, { name: 'Tape Steelgrip', qty: 10, price: 15, total: 150 }] }
    ],
    settledHistory: [
      { id: 'settle_h1', date: '2026-09-25', amount: 1500, paymentMode: 'UPI', notes: 'GPay Settled' }
    ]
  },
  {
    id: 'cust-2',
    name: 'Murugan Plumber',
    phone: '97890 54321',
    address: 'Agraharam Road, Near Water Tank',
    balance: 850,
    balanceOwed: 850,
    purchaseHistory: [
      { id: 'bill_h2', date: '2026-10-02', amount: 850, paymentType: 'Credit', items: [{ name: 'Tap 1/2 inch Brass', qty: 2, price: 240, total: 480 }, { name: 'Ball Valve 1/2 inch', qty: 3, price: 90, total: 270 }, { name: 'Teflon Tape', qty: 5, price: 20, total: 100 }] }
    ],
    settledHistory: [
      { id: 'settle_h2', date: '2026-09-28', amount: 1200, paymentMode: 'Cash', notes: 'Direct Cash Settled' }
    ]
  },
  {
    id: 'cust-3',
    name: 'Selvam Contractor',
    phone: '94432 11223',
    address: 'VIP Nagar, Construction Site',
    balance: 0,
    balanceOwed: 0,
    purchaseHistory: [
      { id: 'bill_h3', date: '2026-09-30', amount: 3500, paymentType: 'Cash', items: [{ name: 'Motor 0.5 HP', qty: 1, price: 3500, total: 3500 }] }
    ],
    settledHistory: [
      { id: 'settle_h3', date: '2026-09-30', amount: 3500, paymentMode: 'Cash', notes: 'Full Settlement on delivery' }
    ]
  }
];
