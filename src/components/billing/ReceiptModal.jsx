import React from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Calendar, 
  FileText, 
  Receipt,
  Download
} from 'lucide-react';

export default function ReceiptModal() {
  const { 
    lastCompletedBill, 
    showReceiptModal, 
    setShowReceiptModal 
  } = useShop();

  if (!showReceiptModal || !lastCompletedBill) return null;

  const bill = lastCompletedBill;
  const isCredit = bill.paymentMode === 'Credit';

  // Format date
  const billDate = new Date(bill.date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // WhatsApp share message
  const handleWhatsAppShare = () => {
    let itemsText = bill.items
      .map((item, idx) => `${idx + 1}. ${item.name} (${item.size}) - ${item.qty} pcs x ₹${item.price} = ₹${item.total}`)
      .join('\n');

    let statusText = isCredit 
      ? `⚠️ PAYMENT STATUS: CREDIT (KADAN) - Pending Balance: ₹${bill.total}`
      : `✅ PAYMENT STATUS: AMOUNT SETTLED via ${bill.paymentMode}`;

    const text = `*NP ELECTRICALS - BILL RECEIPT*\n------------------------------\nBill No: ${bill.id}\nDate: ${billDate}\nCustomer: ${bill.customerName}\nPhone: ${bill.customerPhone}\n\n*ITEMS:*\n${itemsText}\n------------------------------\n*TOTAL AMOUNT: ₹${bill.total}*\n${statusText}\n------------------------------\nNandri! Meendum Varuga! 🙏`;

    const cleanPhone = bill.customerPhone ? bill.customerPhone.replace(/[^0-9]/g, '') : '';
    let waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (cleanPhone.length >= 10) {
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    }

    window.open(waUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Actions */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold">Bill Receipt Generated</span>
          </div>
          <button
            onClick={() => setShowReceiptModal(false)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-bill" className="p-4 sm:p-6 bg-white font-mono text-slate-900 text-xs sm:text-sm">
          
          {/* Shop Header */}
          <div className="text-center border-b border-dashed border-slate-400 pb-3 mb-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mb-0 font-sans">
              NP ELECTRICALS
            </h1>
            <p className="text-[11px] text-slate-600 font-sans font-medium mt-0.5">
              Electrical & Plumbing Hardware Store
            </p>
            <p className="text-[10px] text-slate-500 font-sans">
              Main Road, Bus Stand Near • Ph: 98401 00000
            </p>
          </div>

          {/* Bill Meta */}
          <div className="flex justify-between items-start text-[11px] border-b border-slate-200 pb-2 mb-3">
            <div>
              <div><strong className="font-bold">Bill No:</strong> {bill.id}</div>
              <div><strong className="font-bold">Date:</strong> {billDate}</div>
            </div>
            <div className="text-right">
              <div><strong className="font-bold">Cust:</strong> {bill.customerName}</div>
              <div><strong className="font-bold">Phone:</strong> {bill.customerPhone}</div>
              {bill.customerAddress && (
                <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                  {bill.customerAddress}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-3">
            <div className="flex justify-between font-bold border-b border-slate-300 pb-1 text-[11px] uppercase">
              <span className="flex-1">Item (Size / Inches)</span>
              <span className="w-10 text-center">Qty</span>
              <span className="w-14 text-right">Rate</span>
              <span className="w-16 text-right">Total</span>
            </div>

            <div className="divide-y divide-slate-100 py-1 space-y-1">
              {bill.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] pt-1">
                  <div className="flex-1 pr-1 font-sans">
                    <div className="font-bold text-slate-900 leading-tight">{item.name}</div>
                    <div className="text-[10px] text-amber-800 font-medium">Size: {item.size}</div>
                  </div>
                  <div className="w-10 text-center font-bold">{item.qty}</div>
                  <div className="w-14 text-right">₹{item.price}</div>
                  <div className="w-16 text-right font-black">₹{item.total}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & Total */}
          <div className="border-t-2 border-dashed border-slate-400 pt-2 mb-3 space-y-1">
            <div className="flex justify-between items-center text-sm font-black font-sans">
              <span>Moththa Bill Amount:</span>
              <span className="text-base text-slate-900">₹{bill.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment Status Badge in Receipt */}
          <div className="my-3 p-2.5 rounded-xl border text-center font-sans">
            {isCredit ? (
              <div className="bg-rose-50 border-rose-300 text-rose-800 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1.5 font-black text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>CREDIT BILL (கடன் கணக்கு)</span>
                </div>
                <div className="text-[11px] font-bold mt-0.5">
                  Balance Owed: ₹{bill.total.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-rose-600">
                  Customer Database-il Kadan Save Aaiduchu
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border-emerald-300 text-emerald-800 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1.5 font-black text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AMOUNT SETTLED (பணம் பெறப்பட்டது)</span>
                </div>
                <div className="text-[11px] font-bold mt-0.5">
                  Payment Mode: {bill.paymentMode} • Settled on {billDate}
                </div>
              </div>
            )}
          </div>

          {/* Thank You Note */}
          <div className="text-center text-[10px] text-slate-500 font-sans border-t border-slate-200 pt-2">
            🙏 நன்றி! மீண்டும் வருக! (Thank you! Visit again!) 🙏
          </div>

        </div>

        {/* Modal Action Buttons (WhatsApp, Print, Done) */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp-la Anupu</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Bill</span>
          </button>

          <button
            onClick={() => setShowReceiptModal(false)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Mudindhadhu (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
