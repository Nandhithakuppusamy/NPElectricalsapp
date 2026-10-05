// Initial categories and pre-populated catalog for NP Electricals

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

export const CATEGORIES = [
  { 
    id: 'bulb', 
    name: 'Bulb', 
    tamilName: 'பல்பு', 
    icon: 'Lightbulb', 
    sizesPreview: '9W, 12W, 20W, 25W, 0.5W',
    color: 'from-amber-500 to-yellow-500',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    textAccent: 'text-amber-700',
    imageUrl: DEFAULT_CATEGORY_IMAGES.bulb
  },
  { 
    id: 'holder', 
    name: 'Holder', 
    tamilName: 'ஹோல்டர்', 
    icon: 'Zap', 
    sizesPreview: 'Straight, Angle, Hanging, Adaptor',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    textAccent: 'text-blue-700',
    imageUrl: DEFAULT_CATEGORY_IMAGES.holder
  },
  { 
    id: 'screw', 
    name: 'Screw', 
    tamilName: 'ஸ்க்ரூ', 
    icon: 'Wrench', 
    sizesPreview: '0.5 inch, 1 inch, 1.5 inch, 2 inch, 3 inch',
    color: 'from-slate-600 to-zinc-800',
    bgLight: 'bg-slate-50',
    borderLight: 'border-slate-300',
    textAccent: 'text-slate-800',
    imageUrl: DEFAULT_CATEGORY_IMAGES.screw
  },
  { 
    id: 'bend_elbow', 
    name: 'Bend / Elbow', 
    tamilName: 'பெண்ட் / எல்போ', 
    icon: 'CornerUpRight', 
    sizesPreview: '1/2", 3/4", 1" (Conduit & Plumbing)',
    color: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-50',
    borderLight: 'border-cyan-200',
    textAccent: 'text-cyan-800',
    imageUrl: DEFAULT_CATEGORY_IMAGES.bend_elbow
  },
  { 
    id: 'motor', 
    name: 'Motor', 
    tamilName: 'மோட்டார்', 
    icon: 'Cpu', 
    sizesPreview: '0.5 HP, 1.0 HP, 1.5 HP, Starter Box',
    color: 'from-emerald-500 to-teal-700',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    textAccent: 'text-emerald-800',
    imageUrl: DEFAULT_CATEGORY_IMAGES.motor
  },
  { 
    id: 'switch', 
    name: 'Switch', 
    tamilName: 'ஸ்விட்ச்', 
    icon: 'ToggleRight', 
    sizesPreview: '6A Piano, 16A Power, Modular, Bell Push',
    color: 'from-violet-500 to-purple-700',
    bgLight: 'bg-violet-50',
    borderLight: 'border-violet-200',
    textAccent: 'text-violet-800',
    imageUrl: DEFAULT_CATEGORY_IMAGES.switch
  },
  { 
    id: 'tap', 
    name: 'Tap', 
    tamilName: 'டேப்', 
    icon: 'Droplets', 
    sizesPreview: '1/2" Long Body, Brass, Swan Neck, 2-in-1',
    color: 'from-sky-500 to-blue-600',
    bgLight: 'bg-sky-50',
    borderLight: 'border-sky-200',
    textAccent: 'text-sky-800',
    imageUrl: DEFAULT_CATEGORY_IMAGES.tap
  },
  { 
    id: 'ball_valve', 
    name: 'Ball Valve', 
    tamilName: 'பால் வால்வு', 
    icon: 'Disc', 
    sizesPreview: '1/2", 3/4", 1", 1.5", 2" UPVC & Brass',
    color: 'from-orange-500 to-red-600',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    textAccent: 'text-orange-800',
    imageUrl: DEFAULT_CATEGORY_IMAGES.ball_valve
  },
  { 
    id: 'bearing', 
    name: 'Bearing', 
    tamilName: 'பேரிங்', 
    icon: 'CircleDot', 
    sizesPreview: '6201 ZZ, 6202 ZZ, 6203, 6204, 608 ZZ',
    color: 'from-amber-600 to-orange-700',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-300',
    textAccent: 'text-amber-800',
    imageUrl: DEFAULT_CATEGORY_IMAGES.bearing
  },
  { 
    id: 'other', 
    name: 'Other items', 
    tamilName: 'மத்த சாமான்கள்', 
    icon: 'Package', 
    sizesPreview: 'Wire 1.0/2.5 sq mm, Tape, Tester, M-Seal',
    color: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-200',
    textAccent: 'text-rose-800',
    imageUrl: DEFAULT_CATEGORY_IMAGES.other
  }
];

export const INITIAL_PRODUCTS = [
  // 1. Bulb
  {
    id: 'prod-bulb-1',
    name: 'Bulb 9 Watt',
    category: 'bulb',
    size: '9 Watt (B22 White)',
    price: 95,
    stock: 24,
    lowStockAlert: 5,
    unit: 'piece'
  },
  {
    id: 'prod-bulb-2',
    name: 'Bulb 12 Watt',
    category: 'bulb',
    size: '12 Watt (B22 Bright)',
    price: 130,
    stock: 4, // Low stock demo!
    lowStockAlert: 5,
    unit: 'piece'
  },
  {
    id: 'prod-bulb-3',
    name: 'Bulb 20 Watt Batten Tubelight',
    category: 'bulb',
    size: '4 Feet / 20W',
    price: 210,
    stock: 12,
    lowStockAlert: 4,
    unit: 'piece'
  },
  {
    id: 'prod-bulb-4',
    name: 'Bulb 0.5 Watt Night Deco',
    category: 'bulb',
    size: '0.5 Watt (Red/Blue/Green)',
    price: 35,
    stock: 30,
    lowStockAlert: 8,
    unit: 'piece'
  },
  {
    id: 'prod-bulb-5',
    name: 'Bulb 25 Watt High Beam',
    category: 'bulb',
    size: '25 Watt (B22 Heavy)',
    price: 280,
    stock: 2, // Low stock demo!
    lowStockAlert: 3,
    unit: 'piece'
  },

  // 2. Holder
  {
    id: 'prod-holder-1',
    name: 'Holder Batten Straight',
    category: 'holder',
    size: 'Standard Straight',
    price: 35,
    stock: 40,
    lowStockAlert: 10,
    unit: 'piece'
  },
  {
    id: 'prod-holder-2',
    name: 'Holder Angle Slant',
    category: 'holder',
    size: 'Standard Angle',
    price: 40,
    stock: 18,
    lowStockAlert: 6,
    unit: 'piece'
  },
  {
    id: 'prod-holder-3',
    name: 'Holder Hanging Brass Cord',
    category: 'holder',
    size: 'Hanging Cord Type',
    price: 45,
    stock: 3, // Low stock demo!
    lowStockAlert: 5,
    unit: 'piece'
  },
  {
    id: 'prod-holder-4',
    name: 'Holder Multi-Adaptor 2-in-1',
    category: 'holder',
    size: '2-Pin + B22 Adaptor',
    price: 55,
    stock: 15,
    lowStockAlert: 5,
    unit: 'piece'
  },

  // 3. Screw (Explicit user example: Screw 1 inch, Screw 2 inch, etc.)
  {
    id: 'prod-screw-1',
    name: 'Screw 0.5 inch',
    category: 'screw',
    size: '0.5 inch (Switch Board Screws)',
    price: 45,
    stock: 20,
    lowStockAlert: 4,
    unit: 'pkt'
  },
  {
    id: 'prod-screw-2',
    name: 'Screw 1 inch',
    category: 'screw',
    size: '1 inch (Star Head Wood Screw)',
    price: 70,
    stock: 25,
    lowStockAlert: 5,
    unit: 'box'
  },
  {
    id: 'prod-screw-3',
    name: 'Screw 1.5 inch',
    category: 'screw',
    size: '1.5 inch (Black Gypsum Screw)',
    price: 95,
    stock: 14,
    lowStockAlert: 5,
    unit: 'box'
  },
  {
    id: 'prod-screw-4',
    name: 'Screw 2 inch',
    category: 'screw',
    size: '2 inch (Heavy Wood Screw)',
    price: 130,
    stock: 3, // Low stock demo!
    lowStockAlert: 5,
    unit: 'box'
  },
  {
    id: 'prod-screw-5',
    name: 'Screw 3 inch Wall Grip with Gitti',
    category: 'screw',
    size: '3 inch (Wall Grip with Rawl Plug)',
    price: 160,
    stock: 18,
    lowStockAlert: 4,
    unit: 'box'
  },

  // 4. Bend / Elbow
  {
    id: 'prod-bend-1',
    name: 'Bend 1/2 inch',
    category: 'bend_elbow',
    size: '1/2 inch (20mm PVC Conduit)',
    price: 12,
    stock: 80,
    lowStockAlert: 15,
    unit: 'piece'
  },
  {
    id: 'prod-bend-2',
    name: 'Bend 3/4 inch',
    category: 'bend_elbow',
    size: '3/4 inch (25mm PVC Conduit)',
    price: 16,
    stock: 65,
    lowStockAlert: 15,
    unit: 'piece'
  },
  {
    id: 'prod-bend-3',
    name: 'Bend 1 inch',
    category: 'bend_elbow',
    size: '1 inch (32mm Heavy Conduit)',
    price: 24,
    stock: 5, // Low stock demo!
    lowStockAlert: 10,
    unit: 'piece'
  },
  {
    id: 'prod-bend-4',
    name: 'Elbow 1/2 inch CPVC',
    category: 'bend_elbow',
    size: '1/2 inch (CPVC 90° Plumbing)',
    price: 22,
    stock: 45,
    lowStockAlert: 10,
    unit: 'piece'
  },
  {
    id: 'prod-bend-5',
    name: 'Elbow 3/4 inch CPVC',
    category: 'bend_elbow',
    size: '3/4 inch (CPVC 90° Plumbing)',
    price: 32,
    stock: 35,
    lowStockAlert: 10,
    unit: 'piece'
  },
  {
    id: 'prod-bend-6',
    name: 'Elbow 1 inch UPVC',
    category: 'bend_elbow',
    size: '1 inch (UPVC Water Pipe)',
    price: 38,
    stock: 28,
    lowStockAlert: 8,
    unit: 'piece'
  },

  // 5. Motor
  {
    id: 'prod-motor-1',
    name: 'Motor 0.5 HP Monoblock',
    category: 'motor',
    size: '0.5 HP (Single Phase)',
    price: 3650,
    stock: 4,
    lowStockAlert: 2,
    unit: 'piece'
  },
  {
    id: 'prod-motor-2',
    name: 'Motor 1.0 HP Self-Priming',
    category: 'motor',
    size: '1.0 HP (High Pressure)',
    price: 5400,
    stock: 1, // Low stock demo!
    lowStockAlert: 2,
    unit: 'piece'
  },
  {
    id: 'prod-motor-3',
    name: 'Motor 1.5 HP Openwell Submersible',
    category: 'motor',
    size: '1.5 HP (Openwell Pump)',
    price: 9800,
    stock: 2,
    lowStockAlert: 1,
    unit: 'piece'
  },
  {
    id: 'prod-motor-4',
    name: 'Motor Starter Box 1.0 HP',
    category: 'motor',
    size: '1.0 HP with 36MFD Capacitor',
    price: 850,
    stock: 6,
    lowStockAlert: 2,
    unit: 'piece'
  },

  // 6. Switch
  {
    id: 'prod-switch-1',
    name: 'Switch 6A Piano 1-Way',
    category: 'switch',
    size: '6 Ampere (Standard)',
    price: 25,
    stock: 75,
    lowStockAlert: 15,
    unit: 'piece'
  },
  {
    id: 'prod-switch-2',
    name: 'Switch 16A Power Heavy',
    category: 'switch',
    size: '16 Ampere (Geyser/AC)',
    price: 55,
    stock: 40,
    lowStockAlert: 10,
    unit: 'piece'
  },
  {
    id: 'prod-switch-3',
    name: 'Switch Bell Push with Light',
    category: 'switch',
    size: '6 Ampere (Calling Bell)',
    price: 45,
    stock: 18,
    lowStockAlert: 5,
    unit: 'piece'
  },
  {
    id: 'prod-switch-4',
    name: 'Switch 6A Modular White',
    category: 'switch',
    size: '6A Modular (1 Module)',
    price: 75,
    stock: 2, // Low stock demo!
    lowStockAlert: 6,
    unit: 'piece'
  },
  {
    id: 'prod-switch-5',
    name: 'Switch Socket 16A 3-Pin',
    category: 'switch',
    size: '16 Ampere Socket',
    price: 65,
    stock: 30,
    lowStockAlert: 8,
    unit: 'piece'
  },

  // 7. Tap
  {
    id: 'prod-tap-1',
    name: 'Tap 1/2 inch PVC Long Body',
    category: 'tap',
    size: '1/2 inch (Long Body Bib Cock)',
    price: 95,
    stock: 32,
    lowStockAlert: 8,
    unit: 'piece'
  },
  {
    id: 'prod-tap-2',
    name: 'Tap 1/2 inch PVC Short Body',
    category: 'tap',
    size: '1/2 inch (Bathroom Short Body)',
    price: 80,
    stock: 28,
    lowStockAlert: 6,
    unit: 'piece'
  },
  {
    id: 'prod-tap-3',
    name: 'Tap 1/2 inch Solid Brass Chrome',
    category: 'tap',
    size: '1/2 inch (Heavy Brass)',
    price: 240,
    stock: 8,
    lowStockAlert: 3,
    unit: 'piece'
  },
  {
    id: 'prod-tap-4',
    name: 'Tap 1/2 inch Swan Neck Flexible Sink',
    category: 'tap',
    size: '1/2 inch (Flexible Pillar)',
    price: 480,
    stock: 3, // Low stock demo!
    lowStockAlert: 2,
    unit: 'piece'
  },
  {
    id: 'prod-tap-5',
    name: 'Tap 1/2 inch 2-in-1 Angle Cock',
    category: 'tap',
    size: '1/2 inch (Dual Handle Health Faucet)',
    price: 320,
    stock: 11,
    lowStockAlert: 4,
    unit: 'piece'
  },

  // 8. Ball Valve
  {
    id: 'prod-valve-1',
    name: 'Ball Valve 1/2 inch UPVC',
    category: 'ball_valve',
    size: '1/2 inch (Handle Type)',
    price: 90,
    stock: 22,
    lowStockAlert: 6,
    unit: 'piece'
  },
  {
    id: 'prod-valve-2',
    name: 'Ball Valve 3/4 inch UPVC',
    category: 'ball_valve',
    size: '3/4 inch (Handle Type)',
    price: 125,
    stock: 19,
    lowStockAlert: 5,
    unit: 'piece'
  },
  {
    id: 'prod-valve-3',
    name: 'Ball Valve 1 inch UPVC Tank',
    category: 'ball_valve',
    size: '1 inch (Full Flow Tank Line)',
    price: 175,
    stock: 4, // Low stock demo!
    lowStockAlert: 5,
    unit: 'piece'
  },
  {
    id: 'prod-valve-4',
    name: 'Ball Valve 1.5 inch UPVC Heavy',
    category: 'ball_valve',
    size: '1.5 inch (Heavy Duty Tank)',
    price: 290,
    stock: 8,
    lowStockAlert: 3,
    unit: 'piece'
  },
  {
    id: 'prod-valve-5',
    name: 'Ball Valve 2 inch Main Pipeline',
    category: 'ball_valve',
    size: '2 inch (Industrial Heavy)',
    price: 440,
    stock: 5,
    lowStockAlert: 2,
    unit: 'piece'
  },

  // 9. Bearing
  {
    id: 'prod-bearing-1',
    name: 'Bearing 6201 ZZ',
    category: 'bearing',
    size: '6201 ZZ (Ceiling Fan Top)',
    price: 85,
    stock: 35,
    lowStockAlert: 8,
    unit: 'piece'
  },
  {
    id: 'prod-bearing-2',
    name: 'Bearing 6202 ZZ',
    category: 'bearing',
    size: '6202 ZZ (Ceiling Fan Bottom)',
    price: 95,
    stock: 30,
    lowStockAlert: 8,
    unit: 'piece'
  },
  {
    id: 'prod-bearing-3',
    name: 'Bearing 6203 2RS',
    category: 'bearing',
    size: '6203 2RS (Heavy Motor Pump)',
    price: 140,
    stock: 12,
    lowStockAlert: 4,
    unit: 'piece'
  },
  {
    id: 'prod-bearing-4',
    name: 'Bearing 6204 2RS',
    category: 'bearing',
    size: '6204 2RS (Monoblock Pump)',
    price: 175,
    stock: 2, // Low stock demo!
    lowStockAlert: 4,
    unit: 'piece'
  },
  {
    id: 'prod-bearing-5',
    name: 'Bearing 608 ZZ',
    category: 'bearing',
    size: '608 ZZ (Table Fan & Grinder)',
    price: 50,
    stock: 25,
    lowStockAlert: 6,
    unit: 'piece'
  },

  // 10. Other items
  {
    id: 'prod-other-1',
    name: 'Tape Steelgrip PVC Insulation',
    category: 'other',
    size: '10 Metres Roll (Black/Red/Yellow)',
    price: 15,
    stock: 95,
    lowStockAlert: 20,
    unit: 'roll'
  },
  {
    id: 'prod-other-2',
    name: 'Wire Coil 1.0 Sq mm Pure Copper',
    category: 'other',
    size: '1.0 Sq mm (90 Metres Coil)',
    price: 1450,
    stock: 6,
    lowStockAlert: 3,
    unit: 'coil'
  },
  {
    id: 'prod-other-3',
    name: 'Wire Coil 2.5 Sq mm Pure Copper',
    category: 'other',
    size: '2.5 Sq mm (90 Metres Coil)',
    price: 2950,
    stock: 3, // Low stock demo!
    lowStockAlert: 2,
    unit: 'coil'
  },
  {
    id: 'prod-other-4',
    name: 'Tester Taparia Heavy Neon',
    category: 'other',
    size: '500V Heavy Duty Tester',
    price: 65,
    stock: 24,
    lowStockAlert: 5,
    unit: 'piece'
  },
  {
    id: 'prod-other-5',
    name: 'Plug Top 16A 3-Pin Heavy',
    category: 'other',
    size: '16 Ampere (Power Top)',
    price: 60,
    stock: 30,
    lowStockAlert: 8,
    unit: 'piece'
  },
  {
    id: 'prod-other-6',
    name: 'Teflon Tape 12mm Plumbing',
    category: 'other',
    size: '12mm x 10 Metres Roll',
    price: 18,
    stock: 50,
    lowStockAlert: 15,
    unit: 'roll'
  },
  {
    id: 'prod-other-7',
    name: 'M-Seal Epoxy Putty Compound',
    category: 'other',
    size: '100 Grams Pack',
    price: 25,
    stock: 40,
    lowStockAlert: 10,
    unit: 'pkt'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Karthik Electrician',
    phone: '98401 23456',
    address: 'Bazaar Street, Shop Backside',
    balanceOwed: 2150,
    creditBills: [
      {
        billId: 'BILL-1002',
        date: '2026-09-24T11:30:00.000Z',
        items: 'Wire Coil 1.0 Sq mm (1), Tape Steelgrip (4), Switch 16A (2)',
        amount: 2150,
        status: 'PENDING'
      }
    ],
    settledHistory: [
      {
        id: 'settle-1',
        amount: 1500,
        date: '2026-09-20T17:15:00.000Z',
        paymentMode: 'UPI',
        notes: 'GPay - Old bill settle panniyachu'
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'Murugan Contractor',
    phone: '94432 78901',
    address: 'Gandhi Nagar, 2nd Cross, Near Water Tank',
    balanceOwed: 5800,
    creditBills: [
      {
        billId: 'BILL-1001',
        date: '2026-09-22T14:45:00.000Z',
        items: 'Motor 1.0 HP Self-Priming (1), Ball Valve 1" (2)',
        amount: 5750,
        status: 'PENDING'
      },
      {
        billId: 'BILL-1003',
        date: '2026-09-26T09:15:00.000Z',
        items: 'Elbow 3/4" CPVC (4), Teflon Tape (2)',
        amount: 164,
        status: 'PENDING'
      }
    ],
    settledHistory: [
      {
        id: 'settle-2',
        amount: 3000,
        date: '2026-09-23T18:00:00.000Z',
        paymentMode: 'Cash',
        notes: 'Cash payment - Part settlement'
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'Senthil Kumar (House Owner)',
    phone: '97890 55443',
    address: 'Anna Nagar West, Flat 4B',
    balanceOwed: 0,
    creditBills: [],
    settledHistory: [
      {
        id: 'settle-3',
        amount: 1850,
        date: '2026-09-27T12:00:00.000Z',
        paymentMode: 'UPI',
        notes: 'LED Bulbs + Fan Bearings full settle'
      }
    ]
  }
];

export const INITIAL_BILLS = [
  {
    id: 'BILL-1001',
    customerName: 'Murugan Contractor',
    customerPhone: '94432 78901',
    customerAddress: 'Gandhi Nagar, 2nd Cross',
    date: '2026-09-22T14:45:00.000Z',
    items: [
      { id: 'prod-motor-2', name: 'Motor 1.0 HP Self-Priming', size: '1.0 HP (High Pressure)', price: 5400, qty: 1, total: 5400 },
      { id: 'prod-valve-3', name: 'Ball Valve 1 inch UPVC Tank', size: '1 inch (Full Flow Tank Line)', price: 175, qty: 2, total: 350 }
    ],
    subtotal: 5750,
    total: 5750,
    paymentMode: 'Credit',
    isSettled: false,
    notes: 'Kadan Bill - Contractor Murugan'
  },
  {
    id: 'BILL-1002',
    customerName: 'Karthik Electrician',
    customerPhone: '98401 23456',
    customerAddress: 'Bazaar Street',
    date: '2026-09-24T11:30:00.000Z',
    items: [
      { id: 'prod-other-2', name: 'Wire Coil 1.0 Sq mm Pure Copper', size: '1.0 Sq mm (90 Metres Coil)', price: 1450, qty: 1, total: 1450 },
      { id: 'prod-other-1', name: 'Tape Steelgrip PVC Insulation', size: '10 Metres Roll', price: 15, qty: 4, total: 60 },
      { id: 'prod-switch-2', name: 'Switch 16A Power Heavy', size: '16 Ampere (Geyser/AC)', price: 55, qty: 2, total: 110 }
    ],
    subtotal: 1620,
    total: 1620,
    paymentMode: 'Credit',
    isSettled: false,
    notes: 'Site work kadan'
  },
  {
    id: 'BILL-1003',
    customerName: 'Senthil Kumar (House Owner)',
    customerPhone: '97890 55443',
    customerAddress: 'Anna Nagar West',
    date: '2026-09-27T12:00:00.000Z',
    items: [
      { id: 'prod-bulb-1', name: 'Bulb 9 Watt', size: '9 Watt (B22 White)', price: 95, qty: 4, total: 380 },
      { id: 'prod-bearing-1', name: 'Bearing 6201 ZZ', size: '6201 ZZ (Ceiling Fan Top)', price: 85, qty: 2, total: 170 }
    ],
    subtotal: 550,
    total: 550,
    paymentMode: 'UPI',
    isSettled: true,
    settledDate: '2026-09-27T12:00:00.000Z',
    notes: 'GPay Settled'
  },
  {
    id: 'BILL-1004',
    customerName: 'Walk-in Customer',
    customerPhone: 'Direct Cash',
    customerAddress: '',
    date: '2026-09-28T10:15:00.000Z',
    items: [
      { id: 'prod-tap-1', name: 'Tap 1/2 inch PVC Long Body', size: '1/2 inch (Long Body Bib Cock)', price: 95, qty: 2, total: 190 },
      { id: 'prod-other-6', name: 'Teflon Tape 12mm Plumbing', size: '12mm x 10 Metres Roll', price: 18, qty: 2, total: 36 }
    ],
    subtotal: 226,
    total: 226,
    paymentMode: 'Cash',
    isSettled: true,
    settledDate: '2026-09-28T10:15:00.000Z',
    notes: 'Cash Counter'
  }
];
