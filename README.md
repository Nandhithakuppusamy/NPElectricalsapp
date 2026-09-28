# NP Electricals (என்.பி. எலக்ட்ரிக்கல்ஸ்)

**Mobile-Friendly Tanglish Billing, Stock Management & Customer Kadan Ledger App**

---

## 📱 Page Flow & Features

### 1. Categories Page (First Page)
- The opening page **ONLY shows Categories** clearly listed (No products here):
  1. 💡 **Bulb (பல்பு)**
  2. ⚡ **Holder (ஹோல்டர்)**
  3. 🔩 **Screw (ஸ்க்ரூ)**
  4. 🔄 **Bend / Elbow (பெண்ட் / எல்போ)**
  5. ⚙️ **Motor (மோட்டார்)**
  6. 🔘 **Switch (ஸ்விட்ச்)**
  7. 🚰 **Tap (டேப்)**
  8. 🛑 **Ball Valve (பால் வால்வு)**
  9. 🔘 **Bearing (பேரிங்)**
  10. 📦 **Other items (மத்த சாமான்கள்)**
- **Shop Owner Controls**:
  - ➕ **ADD New Category (`+ Pudhu Category Serka`)**
  - ✏️ **UPDATE Existing Category Name (`Category Peyarai Matra`)**
  - 🗑️ **DELETE Existing Category (`Category-ai Neekka`)**

---

### 2. Category Navigation & Products Page
- Clicking any category opens its dedicated page showing **all products under that category**.
- Example: Clicking **“Screw”** opens **Screw 0.5 inch**, **Screw 1 inch**, **Screw 1.5 inch**, **Screw 2 inch**, etc.
- Every product displays its **Size / Inches** badge, price (`₹...`), current stock, and **"⚠️ Low Stock Warning"** if stock is low.
- Includes a **"⬅️ Categories List-ku Po (Back)"** button.
- **Shop Owner Controls**:
  - ➕ **ADD New Product (`+ Pudhu Product Serka`)** directly under the category
  - ✏️ **UPDATE Product Details (`Product Vivaram Matra`)**
  - 🗑️ **DELETE Existing Product (`Product-ai Neekka`)**

---

### 3. Billing & Sticky Bottom Total Bar
- Selecting products adds them to the bill.
- **Total amount is displayed at the bottom** in a sticky bar (`Moththa Bill: ₹...`).
- Clicking **"Bill Podu"** opens the checkout modal with 3 payment options:
  - 💵 **Cash (ரொக்கம்)**: Recorded as **Amount Settled** with purchase date.
  - 📱 **UPI (GPay / PhonePe / QR)**: Recorded as **Amount Settled** with purchase date.
  - 📋 **Credit (கடன் / Udhar)**: Prompts for Customer Name, Phone, and Address. Stored directly in the **Customer Database** under **Balance Owed** with purchase date and item details.
- Receipt preview with **WhatsApp Share** (`WhatsApp-la Anupu`) and **Print Bill**.
- Stock automatically deducted upon billing.

---

### 4. Customer Database & Manual Previous Data Entry (Customer View)
- Accessible via the **Customer Kadan Book** tab.
- Saves Customer Name, Phone Number, and Address.
- **Manual Previous Customer Entry (`+ Pazhaiya Customer Record Serka`)**:
  - Owner can enter **Customer Name, Phone, and Address**.
  - Owner can enter **Outstanding Balance (Kadan Baaki Amount ₹)**.
  - Owner can **select/enter the exact Purchase Date (கடன் வாங்கிய தேதி)** using the interactive calendar picker.
  - Owner can enter items description and slip/bill number.
- **Add Past Credit to Existing Customer (`+ Kadan Entry`)**:
  - Add another past credit purchase with its specific purchase date to an existing customer.
- **Balance Owed**: Shows pending balance in red (`₹... Kadan Baaki`), purchase dates, and item breakdown.
- **Settled Payment History**: Complete log of settled payments with dates, modes (Cash/UPI), and notes.
- **"Panam Settle Pannu"**: Settle balance partially or in full.

---

### 5. Stock Management & Sales History (Shop View)
- Real-time stock counts with **"⚠️ Low Stock Warning"** alerts.
- Dedicated Low Stock Alert banner and quick restock buttons (`+5`, `+10`, `+25`).
- Shop View with today's sales, Cash vs. UPI collections, and credit receivables.

---

## 🚀 Running the App
Double-click `start-np-electricals.bat` or run:
```bash
npm run dev
```
Open in browser: **http://127.0.0.1:5175/**
