import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  BarChart3, 
  Search, 
  Calendar, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Receipt, 
  Printer, 
  Share2, 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Filter
} from 'lucide-react';

export default function SalesHistoryView() {
  const { 
    bills, 
    customers, 
    setLastCompletedBill, 
    setShowReceiptModal 
  } = useShop();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'Cash' | 'UPI' | 'Credit'
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | 'TODAY'

  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter bills
  const filteredBills = bills.filter(b => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      b.id.toLowerCase().includes(q) || 
      (b.customerName && b.customerName.toLowerCase().includes(q)) ||
      (b.customerPhone && b.customerPhone.includes(q));

    const matchesMode = filterMode === 'ALL' || b.paymentMode === filterMode;
    const matchesDate = dateFilter === 'ALL' || (b.date && b.date.slice(0, 10) === todayStr);

    return matchesSearch && matchesMode && matchesDate;
  });

  // KPI Calculations
  const totalRevenue = bills.reduce((sum, b) => sum + (b.total || 0), 0);
  const settledRevenue = bills
    .filter(b => b.isSettled)
    .reduce((sum, b) => sum + (b.total || 0), 0);
  const totalCreditOwed = customers.reduce((sum, c) => sum + (c.balanceOwed || 0), 0);

  const todaysBills = bills.filter(b => b.date && b.date.slice(0, 10) === todayStr);
  const todaysRevenue = todaysBills.reduce((sum, b) => sum + (b.total || 0), 0);

  const cashRevenue = bills
    .filter(b => b.paymentMode === 'Cash')
    .reduce((sum, b) => sum + (b.total || 0), 0);
  const upiRevenue = bills
    .filter(b => b.paymentMode === 'UPI')
    .reduce((sum, b) => sum + (b.total || 0), 0);

  // View Receipt
  const handleViewReceipt = (bill) => {
    setLastCompletedBill(bill);
    setShowReceiptModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-28 sm:pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 m-0">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Kadai Virpanai & Sales History (Shop View)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Moththa virpanai, Cash/UPI vasool, kadan bill-gal matrum receipt vivaram
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        
        {/* Today's Sales */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-lg shadow-blue-600/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100 flex items-center justify-between">
            <span>Inraiya Virpanai</span>
            <TrendingUp className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-2">
            ₹{todaysRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-blue-200 mt-0.5">
            {todaysBills.length} Bills inru pottadhu
          </div>
        </div>

        {/* Total Settled Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Panam Settled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-2">
            ₹{settledRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Cash + UPI Collections
          </div>
        </div>

        {/* Total Credit Balance Pending */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Kadan Baaki</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-2">
            ₹{totalCreditOwed.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Customers tara vendiya baaki
          </div>
        </div>

        {/* Cash vs UPI split */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Vasool Mode Split</span>
            <Banknote className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 mt-2 flex flex-col gap-0.5">
            <span className="text-emerald-700">💵 Cash: ₹{cashRevenue.toLocaleString('en-IN')}</span>
            <span className="text-blue-700">📱 UPI: ₹{upiRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bill No. or Customer name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {/* Date Filter */}
          <button
            onClick={() => setDateFilter(dateFilter === 'TODAY' ? 'ALL' : 'TODAY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              dateFilter === 'TODAY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Inru Mattum (Today)</span>
          </button>

          {/* Payment Mode Filters */}
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ellam
          </button>
          <button
            onClick={() => setFilterMode('Cash')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'Cash'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setFilterMode('UPI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'UPI'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            UPI
          </button>
          <button
            onClick={() => setFilterMode('Credit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'Credit'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Credit (Kadan)
          </button>
        </div>
      </div>

      {/* Bill History List / Table */}
      {filteredBills.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
          <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">Bills Yedhum Illai</h3>
          <p className="text-xs text-slate-500 mt-1">
            Vera filter choose panni try pannunga.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-3 sm:px-4">Bill No. & Date</th>
                  <th className="py-3 px-3 sm:px-4">Customer Details</th>
                  <th className="py-3 px-3 sm:px-4">Items Summary</th>
                  <th className="py-3 px-3 sm:px-4">Payment Mode</th>
                  <th className="py-3 px-3 sm:px-4">Status</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Total Amount</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.map(bill => {
                  const isCredit = bill.paymentMode === 'Credit';
                  const dateStr = new Date(bill.date).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={bill.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Bill No. & Date */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="font-bold text-slate-900">{bill.id}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{dateStr}</div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="font-bold text-slate-800">{bill.customerName}</div>
                        <div className="text-[10px] text-slate-400">{bill.customerPhone}</div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 sm:px-4 max-w-xs">
                        <div className="text-xs text-slate-700 font-medium truncate">
                          {bill.items.map(i => `${i.name} (${i.size}) x${i.qty}`).join(', ')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {bill.items.reduce((s, i) => s + i.qty, 0)} items
                        </div>
                      </td>

                      {/* Payment Mode */}
                      <td className="py-3 px-3 sm:px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                          bill.paymentMode === 'Cash'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : bill.paymentMode === 'UPI'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {bill.paymentMode === 'Cash' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                          {bill.paymentMode === 'UPI' && <QrCode className="w-3.5 h-3.5 text-blue-600" />}
                          {bill.paymentMode === 'Credit' && <CreditCard className="w-3.5 h-3.5 text-rose-600" />}
                          <span>{bill.paymentMode}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 sm:px-4">
                        {isCredit ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            <span>Credit (Kadan)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Settled</span>
                          </span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-3 sm:px-4 text-right font-black text-slate-900 text-sm sm:text-base">
                        ₹{bill.total.toLocaleString('en-IN')}
                      </td>

                      {/* View Receipt Action */}
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <button
                          onClick={() => handleViewReceipt(bill)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                          title="View Bill Receipt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Receipt</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
