import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  QrCode, 
  UserCheck, 
  Phone, 
  MapPin, 
  User, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Receipt
} from 'lucide-react';

export default function BillCheckoutModal({ isOpen, onClose }) {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    cartSubtotal, 
    cartTotalItems,
    customers, 
    checkoutBill 
  } = useShop();

  // Form State
  const [paymentMode, setPaymentMode] = useState('Cash'); // 'Cash' | 'UPI' | 'Credit'
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handle selecting an existing customer from dropdown
  const handleSelectCustomer = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (!custId) {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      return;
    }
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address);
    }
  };

  // Submit and Confirm Bill
  const handleConfirmBill = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Bill-la porutkal yedhum illai! (Cart is empty)');
      return;
    }

    // Validation for Credit option
    if (paymentMode === 'Credit') {
      if (!customerName.trim()) {
        setErrorMsg('Credit (Kadan) bill-ku Customer Name kandippa thevai! (Customer name required for credit)');
        return;
      }
      if (!customerPhone.trim()) {
        setErrorMsg('Credit (Kadan) bill-ku Phone Number thevai! (Phone number required for credit)');
        return;
      }
    }

    try {
      // Fire confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      checkoutBill({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        paymentMode,
        notes: notes.trim()
      });

      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Bill save panna mudiyavillai. Try again.');
    }
  };

  const isCredit = paymentMode === 'Credit';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold m-0 leading-tight">
                Bill Potu Panam Vangu (Confirm & Pay)
              </h2>
              <p className="text-xs text-blue-200/80 mt-0.5">
                NP Electricals Counter Billing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {/* 1. Itemized Bill Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
              <span>Bill Items ({cart.length})</span>
              <span className="text-slate-400 font-normal">Size & Price</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cart.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 truncate">{product.name}</div>
                    <div className="text-[11px] text-amber-700 font-semibold">
                      Size: {product.size} • ₹{product.price} / {product.unit || 'pc'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Qty changer */}
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5">
                      <button
                        onClick={() => updateCartQty(product.id, qty - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-bold text-slate-800 text-xs">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateCartQty(product.id, qty + 1)}
                        disabled={product.stock <= qty}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total for item */}
                    <div className="w-16 text-right font-black text-slate-900">
                      ₹{(product.price * qty).toLocaleString('en-IN')}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Panam Chelluthum Murai (Payment Option) *
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              
              {/* Cash */}
              <button
                type="button"
                onClick={() => setPaymentMode('Cash')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMode === 'Cash'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-black shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold'
                }`}
              >
                <Banknote className={`w-6 h-6 mb-1 ${paymentMode === 'Cash' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-sm">Cash</span>
                <span className="text-[10px] text-slate-400">ரொக்கம்</span>
                <span className="text-[9px] mt-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">
                  Settled
                </span>
              </button>

              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMode === 'UPI'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-black shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold'
                }`}
              >
                <QrCode className={`w-6 h-6 mb-1 ${paymentMode === 'UPI' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-sm">UPI</span>
                <span className="text-[10px] text-slate-400">GPay / PhonePe</span>
                <span className="text-[9px] mt-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-bold">
                  Settled
                </span>
              </button>

              {/* Credit (Kadan) */}
              <button
                type="button"
                onClick={() => setPaymentMode('Credit')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMode === 'Credit'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-black shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold'
                }`}
              >
                <CreditCard className={`w-6 h-6 mb-1 ${paymentMode === 'Credit' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span className="text-sm">Credit</span>
                <span className="text-[10px] text-slate-400">கடன் / Udhar</span>
                <span className="text-[9px] mt-1 px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded font-bold">
                  Balance Owed
                </span>
              </button>

            </div>

            {/* Note about status */}
            <div className="mt-2 text-xs">
              {paymentMode === 'Credit' ? (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>
                    Credit select panniyirukkeenga. Idhu customer database-il <strong>Balance Owed</strong>-aga save aagum.
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    {paymentMode} select panniyirukkeenga. Idhu <strong>Amount Settled</strong> endru purchase date-udan record aagum.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Customer Information Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Customer Details {isCredit ? <span className="text-rose-600 font-bold">(Kandippa Thevai *)</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
              </span>
              
              {/* Existing Customer Quick Selector */}
              {customers.length > 0 && (
                <select
                  value={selectedCustomerId}
                  onChange={handleSelectCustomer}
                  className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Pazhaiya Customer Select Pannu...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - Kadan: ₹{c.balanceOwed}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Customer Name {isCredit && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isCredit ? "e.g. Karthik Electrician" : "Direct Customer (or type name)"}
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Phone Number {isCredit && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 98401 23456"
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Customer Address / Ooru Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. Bazaar Street, Opp to Bus Stand"
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Modal Footer / Total Amount & Confirm */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">Moththa Bill Amount (Total):</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mt-0.5">
              ₹{cartSubtotal.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmBill}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Bill Pottachu (Confirm Bill)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
