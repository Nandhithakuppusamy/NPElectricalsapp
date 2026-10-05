# NP Electricals (என்.பி. எலக்ட்ரிக்கல்ஸ்)

**Full-Stack React Native (Expo) Billing, Stock Management & Customer Kadan Ledger Application**  
- **Frontend**: React Native (Expo SDK 52) with React Navigation (Bottom Tabs + Native Stack)
- **Platforms**: Android (APK), iOS (IPA), Web (Laptop / Desktop responsive browser)
- **Backend**: Node.js + Express REST API (Modular Controllers & Routes)
- **Database**: MongoDB (Mongoose Collections & Seed Data)
- **Authentication**: JWT Token + bcrypt password hashing
- **Language**: Tanglish (Tamil + English Mix tailored for Tamil Nadu electrical & plumbing shops)

---

## 📱 What Problems Does This React Native App Solve?

1. **On Mobile Screens**:
   - **Always-Visible Action Buttons**: In the Customer Kadan Book, settlement status buttons (`[ Settle Pannu (Pay) ]`, `[ + Kadan Ser ]`, and `[ History ]`) are always visible on each customer card with generous touch targets (>= 48px), preventing clipping or bottom navigation overlap (`contentContainerStyle={{ paddingBottom: 110 }}`).
   - **Floating Bottom Bill Bar**: In Billing & Products, sticky totals and "Bill Podu" buttons stay accessible above the navigation bar.

2. **On Laptop / Large Screens**:
   - **Consistent Scaling & Readability**: Centered responsive container (`maxWidth: 1024`, `ResponsiveContainer.js`) with responsive card grid layouts (2 columns on tablet/desktop, 1 column on phone).
   - **Legible Typography**: Base font sizes never shrink too small on high-resolution displays.

---

## ⚡ Architecture & Project Structure

```
NP-ELECTRICALS/
├── mobile/                           # 📱 React Native (Expo) Frontend Project
│   ├── assets/                       # App icons, splash screen
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js             # Brand banner, DB sync indicator, cart counter
│   │   │   ├── ReceiptModal.js       # Printable / confirmable bill receipt modal
│   │   │   └── ResponsiveContainer.js # Auto-scaling wrapper for mobile & laptop
│   │   ├── config/
│   │   │   └── api.js                # Axios instance, platform URLs, Render/Heroku support
│   │   ├── context/
│   │   │   └── ShopContext.js        # Global state, cart, CRUD, API sync & offline fallback
│   │   ├── data/
│   │   │   └── initialData.js        # 10 categories, pre-populated catalog, image URLs
│   │   ├── navigation/
│   │   │   └── AppNavigator.js       # React Navigation (Bottom Tabs + Stack)
│   │   ├── screens/
│   │   │   ├── CategoriesScreen.js   # FlatList of category cards with real photos & Edit/View
│   │   │   ├── ProductsScreen.js     # Products under category, sizes/inches, low stock alert
│   │   │   ├── BillingScreen.js      # Dynamic bill table, Cash/UPI/Credit, total amount
│   │   │   ├── CustomersScreen.js    # Customer Kadan Book, always-visible buttons, manual past entry
│   │   │   └── StockScreen.js        # Stock inventory, filters (All / Low Stock), quick restock
│   │   └── styles/
│   │       └── theme.js              # Colors, typography, responsive sizing helpers
│   ├── app.json                      # Expo configuration & app metadata
│   ├── eas.json                      # EAS Build config (APK & IPA generation)
│   ├── App.js                        # Root NavigationContainer & Providers
│   └── package.json                  # Expo, React Native, React Navigation dependencies
├── server/                           # 🚀 Node.js + Express + MongoDB Backend (Intact)
│   ├── config/db.js                  # MongoDB connection
│   ├── middleware/upload.js          # Multer image upload (jpg, png, webp)
│   ├── models/                       # Category, Product, Customer, Billing, User
│   ├── controllers/                  # Category, Product, Customer, Billing, Auth
│   ├── routes/                       # /api/categories, /api/products, /api/customers, /api/billing, /api/upload
│   ├── utils/seedData.js             # Auto-seeds 10 categories, initial catalog & customers
│   └── server.js                     # Express app on port 5000 with static /uploads
├── package.json                      # Root scripts for running server & mobile
└── start-np-electricals.bat          # 1-Click launcher
```

---

## 🚀 How to Run

### 1. Start Both Backend & Mobile (Recommended)
From the root directory:
```bash
npm run dev
```
* Starts the **Node.js Express Backend** on `http://localhost:5000`
* Starts the **React Native Expo Web App** on `http://localhost:8081` (opens in browser)

Or double-click `start-np-electricals.bat` on Windows.

### 2. Run Backend Only
```bash
npm run server
```

### 3. Run Mobile App in Terminal
```bash
# Start Expo development server (scan QR with Expo Go on Android / iOS)
npm run mobile

# Start in Web browser (for laptop / desktop testing)
npm run mobile:web

# Run on Android Emulator
npm run mobile:android

# Run on iOS Simulator (macOS only)
npm run mobile:ios
```

---

## 📦 Building Standalone APK (Android) & IPA (iOS)

The project includes pre-configured `mobile/eas.json` for Expo Application Services (EAS):

```bash
cd mobile

# 1. Install EAS CLI globally if not already installed
npm install -g eas-cli

# 2. Log in to your Expo account
eas login

# 3. Build standalone Android APK file (direct installation):
eas build -p android --profile preview

# 4. Build iOS app (simulator or App Store IPA):
eas build -p ios --profile preview
```

---

## 🗄️ Database Collections (MongoDB)

1. **Categories**: `{ id, name, tamilName, sizesPreview, imageUrl }`
2. **Products**: `{ id, categoryId, name, size, price, stockCount, lowStockAlert, unit, imageUrl }`
3. **Customers**: `{ id, name, phone, address, balance, purchaseHistory, settledHistory }`
4. **Billing**: `{ id, customerId, customerName, paymentType, amount, items, date }`
