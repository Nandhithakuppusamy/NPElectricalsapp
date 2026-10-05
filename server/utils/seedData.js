import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Billing from '../models/Billing.js';
import User from '../models/User.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        name: 'NP Electricals Owner',
        role: 'admin'
      });
      console.log('🌱 Admin user created: admin / admin123');
    }

    const defaultCategoryImages = {
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

    const initialCategories = [
      { id: 'bulb', name: 'Bulb', tamilName: 'பல்பு', icon: 'Lightbulb', sizesPreview: '9W, 12W, 20W, 25W, 0.5W', color: 'from-amber-500 to-yellow-500', imageUrl: defaultCategoryImages.bulb },
      { id: 'holder', name: 'Holder', tamilName: 'ஹோல்டர்', icon: 'Zap', sizesPreview: 'Straight, Angle, Hanging, Adaptor', color: 'from-blue-500 to-indigo-600', imageUrl: defaultCategoryImages.holder },
      { id: 'screw', name: 'Screw', tamilName: 'ஸ்க்ரூ', icon: 'Wrench', sizesPreview: '0.5 inch, 1 inch, 1.5 inch, 2 inch, 3 inch', color: 'from-slate-600 to-zinc-800', imageUrl: defaultCategoryImages.screw },
      { id: 'bend_elbow', name: 'Bend / Elbow', tamilName: 'பெண்ட் / எல்போ', icon: 'CornerUpRight', sizesPreview: '1/2", 3/4", 1" (Conduit & Plumbing)', color: 'from-cyan-500 to-blue-600', imageUrl: defaultCategoryImages.bend_elbow },
      { id: 'motor', name: 'Motor', tamilName: 'மோட்டார்', icon: 'Cpu', sizesPreview: '0.5 HP, 1.0 HP, 1.5 HP, Starter Box', color: 'from-emerald-500 to-teal-700', imageUrl: defaultCategoryImages.motor },
      { id: 'switch', name: 'Switch', tamilName: 'ஸ்விட்ச்', icon: 'ToggleRight', sizesPreview: '6A Piano, 16A Power, Modular, Bell Push', color: 'from-violet-500 to-purple-700', imageUrl: defaultCategoryImages.switch },
      { id: 'tap', name: 'Tap', tamilName: 'டேப்', icon: 'Droplets', sizesPreview: '1/2" Long Body, Brass, Swan Neck, 2-in-1', color: 'from-sky-500 to-blue-600', imageUrl: defaultCategoryImages.tap },
      { id: 'ball_valve', name: 'Ball Valve', tamilName: 'பால் வால்வு', icon: 'Disc', sizesPreview: '1/2", 3/4", 1", 1.5", 2" UPVC & Brass', color: 'from-orange-500 to-red-600', imageUrl: defaultCategoryImages.ball_valve },
      { id: 'bearing', name: 'Bearing', tamilName: 'பேரிங்', icon: 'CircleDot', sizesPreview: '6201 ZZ, 6202 ZZ, 6203, 6204, 608 ZZ', color: 'from-amber-600 to-orange-700', imageUrl: defaultCategoryImages.bearing },
      { id: 'other', name: 'Other items', tamilName: 'மத்த சாமான்கள்', icon: 'Package', sizesPreview: 'Wire 1.0/2.5 sq mm, Tape, Tester, M-Seal', color: 'from-rose-500 to-pink-600', imageUrl: defaultCategoryImages.other }
    ];

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(initialCategories);
      console.log('🌱 10 Categories seeded successfully with images');
    } else {
      // Ensure existing categories have imageUrl
      for (const cat of initialCategories) {
        await Category.updateOne(
          { id: cat.id, $or: [{ imageUrl: { $exists: false } }, { imageUrl: '' }, { imageUrl: null }] },
          { $set: { imageUrl: cat.imageUrl } }
        );
      }
    }

    // 3. Seed Products
    const productCount = await Product.countDocuments();
    const initialProducts = [
      // 1. Bulb
      { id: 'prod-bulb-1', categoryId: 'bulb', name: 'Bulb 9 Watt', size: '9 Watt (B22 White)', price: 95, stockCount: 24, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bulb-2', categoryId: 'bulb', name: 'Bulb 12 Watt', size: '12 Watt (B22 Bright)', price: 130, stockCount: 4, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1532007271951-c487760934ae?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bulb-3', categoryId: 'bulb', name: 'Bulb 20 Watt Batten Tubelight', size: '4 Feet / 20W', price: 210, stockCount: 12, lowStockAlert: 4, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bulb-4', categoryId: 'bulb', name: 'Bulb 0.5 Watt Night Deco', size: '0.5 Watt (Red/Blue/Green)', price: 35, stockCount: 30, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bulb-5', categoryId: 'bulb', name: 'Bulb 25 Watt High Beam', size: '25 Watt (B22 Heavy)', price: 280, stockCount: 2, lowStockAlert: 3, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80' },

      // 2. Holder
      { id: 'prod-holder-1', categoryId: 'holder', name: 'Holder Batten Straight', size: 'Standard Straight', price: 35, stockCount: 40, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-holder-2', categoryId: 'holder', name: 'Holder Angle Slant', size: 'Standard Angle', price: 40, stockCount: 18, lowStockAlert: 6, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-holder-3', categoryId: 'holder', name: 'Holder Hanging Brass Cord', size: 'Hanging Cord Type', price: 45, stockCount: 3, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-holder-4', categoryId: 'holder', name: 'Holder Multi-Adaptor 2-in-1', size: '2-Pin + B22 Adaptor', price: 55, stockCount: 15, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80' },

      // 3. Screw
      { id: 'prod-screw-1', categoryId: 'screw', name: 'Screw 0.5 inch', size: '0.5 inch (Switch Board Screws)', price: 45, stockCount: 20, lowStockAlert: 4, unit: 'pkt', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-screw-2', categoryId: 'screw', name: 'Screw 1 inch', size: '1 inch (Star Head Wood Screw)', price: 70, stockCount: 25, lowStockAlert: 5, unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-screw-3', categoryId: 'screw', name: 'Screw 1.5 inch', size: '1.5 inch (Black Gypsum Screw)', price: 95, stockCount: 14, lowStockAlert: 5, unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-screw-4', categoryId: 'screw', name: 'Screw 2 inch', size: '2 inch (Heavy Wood Screw)', price: 130, stockCount: 3, lowStockAlert: 5, unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-screw-5', categoryId: 'screw', name: 'Screw 3 inch Wall Grip with Gitti', size: '3 inch (Wall Grip with Rawl Plug)', price: 160, stockCount: 18, lowStockAlert: 4, unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' },

      // 4. Bend / Elbow
      { id: 'prod-bend-1', categoryId: 'bend_elbow', name: 'Bend 1/2 inch', size: '1/2 inch (20mm PVC Conduit)', price: 12, stockCount: 80, lowStockAlert: 15, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bend-2', categoryId: 'bend_elbow', name: 'Bend 3/4 inch', size: '3/4 inch (25mm PVC Conduit)', price: 16, stockCount: 65, lowStockAlert: 15, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bend-3', categoryId: 'bend_elbow', name: 'Bend 1 inch', size: '1 inch (32mm Heavy Conduit)', price: 24, stockCount: 5, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bend-4', categoryId: 'bend_elbow', name: 'Elbow 1/2 inch CPVC', size: '1/2 inch (CPVC 90° Plumbing)', price: 22, stockCount: 45, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bend-5', categoryId: 'bend_elbow', name: 'Elbow 3/4 inch CPVC', size: '3/4 inch (CPVC 90° Plumbing)', price: 32, stockCount: 35, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bend-6', categoryId: 'bend_elbow', name: 'Elbow 1 inch UPVC', size: '1 inch (UPVC Water Pipe)', price: 38, stockCount: 28, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },

      // 5. Motor
      { id: 'prod-motor-1', categoryId: 'motor', name: 'Motor 0.5 HP Monoblock', size: '0.5 HP (Single Phase)', price: 3650, stockCount: 4, lowStockAlert: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-motor-2', categoryId: 'motor', name: 'Motor 1.0 HP Self-Priming', size: '1.0 HP (High Pressure)', price: 5400, stockCount: 1, lowStockAlert: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-motor-3', categoryId: 'motor', name: 'Motor 1.5 HP Openwell Submersible', size: '1.5 HP (Openwell Pump)', price: 9800, stockCount: 2, lowStockAlert: 1, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-motor-4', categoryId: 'motor', name: 'Motor Starter Box 1.0 HP', size: '1.0 HP with 36MFD Capacitor', price: 850, stockCount: 6, lowStockAlert: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },

      // 6. Switch
      { id: 'prod-switch-1', categoryId: 'switch', name: 'Switch 6A Piano 1-Way', size: '6 Ampere (Standard)', price: 25, stockCount: 75, lowStockAlert: 15, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-switch-2', categoryId: 'switch', name: 'Switch 16A Power Heavy', size: '16 Ampere (Geyser/AC)', price: 55, stockCount: 40, lowStockAlert: 10, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-switch-3', categoryId: 'switch', name: 'Switch Bell Push with Light', size: '6 Ampere (Calling Bell)', price: 45, stockCount: 18, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-switch-4', categoryId: 'switch', name: 'Switch 6A Modular White', size: '6A Modular (1 Module)', price: 75, stockCount: 2, lowStockAlert: 6, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-switch-5', categoryId: 'switch', name: 'Switch Socket 16A 3-Pin', size: '16 Ampere Socket', price: 65, stockCount: 30, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },

      // 7. Tap
      { id: 'prod-tap-1', categoryId: 'tap', name: 'Tap 1/2 inch PVC Long Body', size: '1/2 inch (Long Body Bib Cock)', price: 95, stockCount: 32, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-tap-2', categoryId: 'tap', name: 'Tap 1/2 inch PVC Short Body', size: '1/2 inch (Bathroom Short Body)', price: 80, stockCount: 28, lowStockAlert: 6, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-tap-3', categoryId: 'tap', name: 'Tap 1/2 inch Solid Brass Chrome', size: '1/2 inch (Heavy Brass)', price: 240, stockCount: 8, lowStockAlert: 3, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-tap-4', categoryId: 'tap', name: 'Tap 1/2 inch Swan Neck Flexible Sink', size: '1/2 inch (Flexible Pillar)', price: 480, stockCount: 3, lowStockAlert: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-tap-5', categoryId: 'tap', name: 'Tap 1/2 inch 2-in-1 Angle Cock', size: '1/2 inch (Dual Handle Health Faucet)', price: 320, stockCount: 11, lowStockAlert: 4, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },

      // 8. Ball Valve
      { id: 'prod-valve-1', categoryId: 'ball_valve', name: 'Ball Valve 1/2 inch UPVC', size: '1/2 inch (Handle Type)', price: 90, stockCount: 22, lowStockAlert: 6, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-valve-2', categoryId: 'ball_valve', name: 'Ball Valve 3/4 inch UPVC', size: '3/4 inch (Handle Type)', price: 125, stockCount: 19, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-valve-3', categoryId: 'ball_valve', name: 'Ball Valve 1 inch UPVC Tank', size: '1 inch (Full Flow Tank Line)', price: 175, stockCount: 4, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-valve-4', categoryId: 'ball_valve', name: 'Ball Valve 1.5 inch UPVC Heavy', size: '1.5 inch (Heavy Duty Tank)', price: 290, stockCount: 8, lowStockAlert: 3, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-valve-5', categoryId: 'ball_valve', name: 'Ball Valve 2 inch Main Pipeline', size: '2 inch (Industrial Heavy)', price: 440, stockCount: 5, lowStockAlert: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80' },

      // 9. Bearing
      { id: 'prod-bearing-1', categoryId: 'bearing', name: 'Bearing 6201 ZZ', size: '6201 ZZ (Ceiling Fan Top)', price: 85, stockCount: 35, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bearing-2', categoryId: 'bearing', name: 'Bearing 6202 ZZ', size: '6202 ZZ (Ceiling Fan Bottom)', price: 95, stockCount: 30, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bearing-3', categoryId: 'bearing', name: 'Bearing 6203 2RS', size: '6203 2RS (Heavy Motor Pump)', price: 140, stockCount: 12, lowStockAlert: 4, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bearing-4', categoryId: 'bearing', name: 'Bearing 6204 2RS', size: '6204 2RS (Monoblock Pump)', price: 175, stockCount: 2, lowStockAlert: 4, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-bearing-5', categoryId: 'bearing', name: 'Bearing 608 ZZ', size: '608 ZZ (Table Fan & Grinder)', price: 50, stockCount: 25, lowStockAlert: 6, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },

      // 10. Other items
      { id: 'prod-other-1', categoryId: 'other', name: 'Tape Steelgrip PVC Insulation', size: '10 Metres Roll (Black/Red/Yellow)', price: 15, stockCount: 95, lowStockAlert: 20, unit: 'roll', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-other-2', categoryId: 'other', name: 'Wire Coil 1.0 Sq mm Pure Copper', size: '1.0 Sq mm (90 Metres Coil)', price: 1450, stockCount: 6, lowStockAlert: 3, unit: 'coil', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-other-3', categoryId: 'other', name: 'Wire Coil 2.5 Sq mm Pure Copper', size: '2.5 Sq mm (90 Metres Coil)', price: 2950, stockCount: 3, lowStockAlert: 2, unit: 'coil', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-other-4', categoryId: 'other', name: 'Tester Taparia Heavy Neon', size: '500V Heavy Duty Tester', price: 65, stockCount: 24, lowStockAlert: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-other-5', categoryId: 'other', name: 'Plug Top 16A 3-Pin Heavy', size: '16 Ampere (Power Top)', price: 60, stockCount: 30, lowStockAlert: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-other-6', categoryId: 'other', name: 'Teflon Tape 12mm Plumbing', size: '12mm x 10 Metres Roll', price: 18, stockCount: 50, lowStockAlert: 15, unit: 'roll', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
      { id: 'prod-other-7', categoryId: 'other', name: 'M-Seal Epoxy Putty Compound', size: '100 Grams Pack', price: 25, stockCount: 40, lowStockAlert: 10, unit: 'pkt', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80' }
    ];

    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log('🌱 Products catalog seeded successfully with images');
    } else {
      // Ensure existing products have imageUrl
      for (const prod of initialProducts) {
        await Product.updateOne(
          { id: prod.id, $or: [{ imageUrl: { $exists: false } }, { imageUrl: '' }, { imageUrl: null }] },
          { $set: { imageUrl: prod.imageUrl } }
        );
      }
    }

    // 4. Seed Customers
    const customerCount = await Customer.countDocuments();
    if (customerCount === 0) {
      const initialCustomers = [
        {
          id: 'cust-1',
          name: 'Karthik Electrician',
          phone: '98401 23456',
          address: 'Bazaar Street, Shop Backside',
          balance: 2150,
          purchaseHistory: [
            {
              billId: 'BILL-1002',
              date: new Date('2026-09-24T11:30:00.000Z'),
              items: 'Wire Coil 1.0 Sq mm (1), Tape Steelgrip (4), Switch 16A (2)',
              amount: 2150,
              paymentType: 'Credit',
              status: 'PENDING'
            }
          ],
          settledHistory: [
            {
              id: 'settle-1',
              amount: 1500,
              date: new Date('2026-09-20T17:15:00.000Z'),
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
          balance: 5800,
          purchaseHistory: [
            {
              billId: 'BILL-1001',
              date: new Date('2026-09-22T14:45:00.000Z'),
              items: 'Motor 1.0 HP Self-Priming (1), Ball Valve 1" (2)',
              amount: 5750,
              paymentType: 'Credit',
              status: 'PENDING'
            },
            {
              billId: 'BILL-1003',
              date: new Date('2026-09-26T09:15:00.000Z'),
              items: 'Elbow 3/4" CPVC (4), Teflon Tape (2)',
              amount: 164,
              paymentType: 'Credit',
              status: 'PENDING'
            }
          ],
          settledHistory: [
            {
              id: 'settle-2',
              amount: 3000,
              date: new Date('2026-09-23T18:00:00.000Z'),
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
          balance: 0,
          purchaseHistory: [],
          settledHistory: [
            {
              id: 'settle-3',
              amount: 1850,
              date: new Date('2026-09-27T12:00:00.000Z'),
              paymentMode: 'UPI',
              notes: 'LED Bulbs + Fan Bearings full settle'
            }
          ]
        }
      ];
      await Customer.insertMany(initialCustomers);
      console.log('🌱 Customers seeded successfully');
    }

    // 5. Seed Bills
    const billCount = await Billing.countDocuments();
    if (billCount === 0) {
      const initialBills = [
        {
          id: 'BILL-1001',
          customerId: 'cust-2',
          customerName: 'Murugan Contractor',
          customerPhone: '94432 78901',
          customerAddress: 'Gandhi Nagar, 2nd Cross',
          date: new Date('2026-09-22T14:45:00.000Z'),
          items: [
            { productId: 'prod-motor-2', name: 'Motor 1.0 HP Self-Priming', size: '1.0 HP (High Pressure)', price: 5400, qty: 1, total: 5400 },
            { productId: 'prod-valve-3', name: 'Ball Valve 1 inch UPVC Tank', size: '1 inch (Full Flow Tank Line)', price: 175, qty: 2, total: 350 }
          ],
          amount: 5750,
          paymentType: 'Credit',
          isSettled: false,
          notes: 'Kadan Bill - Contractor Murugan'
        },
        {
          id: 'BILL-1002',
          customerId: 'cust-1',
          customerName: 'Karthik Electrician',
          customerPhone: '98401 23456',
          customerAddress: 'Bazaar Street',
          date: new Date('2026-09-24T11:30:00.000Z'),
          items: [
            { productId: 'prod-other-2', name: 'Wire Coil 1.0 Sq mm Pure Copper', size: '1.0 Sq mm (90 Metres Coil)', price: 1450, qty: 1, total: 1450 },
            { productId: 'prod-other-1', name: 'Tape Steelgrip PVC Insulation', size: '10 Metres Roll', price: 15, qty: 4, total: 60 },
            { productId: 'prod-switch-2', name: 'Switch 16A Power Heavy', size: '16 Ampere (Geyser/AC)', price: 55, qty: 2, total: 110 }
          ],
          amount: 1620,
          paymentType: 'Credit',
          isSettled: false,
          notes: 'Site work kadan'
        },
        {
          id: 'BILL-1003',
          customerId: 'cust-3',
          customerName: 'Senthil Kumar (House Owner)',
          customerPhone: '97890 55443',
          customerAddress: 'Anna Nagar West',
          date: new Date('2026-09-27T12:00:00.000Z'),
          items: [
            { productId: 'prod-bulb-1', name: 'Bulb 9 Watt', size: '9 Watt (B22 White)', price: 95, qty: 4, total: 380 },
            { productId: 'prod-bearing-1', name: 'Bearing 6201 ZZ', size: '6201 ZZ (Ceiling Fan Top)', price: 85, qty: 2, total: 170 }
          ],
          amount: 550,
          paymentType: 'UPI',
          isSettled: true,
          settledDate: new Date('2026-09-27T12:00:00.000Z'),
          notes: 'GPay Settled'
        },
        {
          id: 'BILL-1004',
          customerId: '',
          customerName: 'Walk-in Customer',
          customerPhone: 'Direct Cash',
          customerAddress: '',
          date: new Date('2026-09-28T10:15:00.000Z'),
          items: [
            { productId: 'prod-tap-1', name: 'Tap 1/2 inch PVC Long Body', size: '1/2 inch (Long Body Bib Cock)', price: 95, qty: 2, total: 190 },
            { productId: 'prod-other-6', name: 'Teflon Tape 12mm Plumbing', size: '12mm x 10 Metres Roll', price: 18, qty: 2, total: 36 }
          ],
          amount: 226,
          paymentType: 'Cash',
          isSettled: true,
          settledDate: new Date('2026-09-28T10:15:00.000Z'),
          notes: 'Cash Counter'
        }
      ];
      await Billing.insertMany(initialBills);
      console.log('🌱 Billing records seeded successfully');
    }
  } catch (err) {
    console.error('Seed Data Error:', err.message);
  }
};
