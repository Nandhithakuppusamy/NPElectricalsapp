import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Banknote, 
  QrCode, 
  FileText,
  Trash2,
  X,
  History,
  Edit2,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CustomerLedgerView() {
  const { 
    customers, 
    settleCustomerCredit, 
    addNewCustomer, 
    addPastCreditToCustomer,
    updateCustomer,
    deleteCustomer 
  } = useShop();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('pending'); // 'pending' | 'all' | 'settled'
  const [expandedCustId, setExpandedCustId] = useState(null);

  // Modals state
  const [isAddCustModalOpen, setIsAddCustModalOpen] = useState(false);
  const [settleModalCust, setSettleModalCust] = useState(null);
  const [pastCreditModalCust, setPastCreditModalCust] = useState(null);
  const [editingCust, setEditingCust] = useState(null);

  // Settle modal form
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMode, setSettleMode] = useState('Cash'); // 'Cash' | 'UPI'
  const [settleNotes, setSettleNotes] = useState('');

  // Add Previous Customer Form State (with Purchase Date selection!)
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustBalance, setNewCustBalance] = useState('');
  const [newCustPurchaseDate, setNewCustPurchaseDate] = useState(() => {
    // Default to today's date in YYYY-MM-DD
    return new Date().toISOString().slice(0, 10);
  });
  const [newCustItemsNote, setNewCustItemsNote] = useState('');
  const [newCustBillId, setNewCustBillId] = useState('');

  // Add Past Credit to Existing Customer Form State
  const [pastCreditAmt, setPastCreditAmt] = useState('');
  const [pastCreditDate, setPastCreditDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [pastCreditItems, setPastCreditItems] = useState('');
  const [pastCreditBillId, setPastCreditBillId] = useState('');

  // Edit Customer Form State
  const [editCustName, setEditCustName] = useState('');
  const [editCustPhone, setEditCustPhone] = useState('');
  const [editCustAddress, setEditCustAddress] = useState('');

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      c.name.toLowerCase().includes(q) || 
      (c.phone && c.phone.includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterType === 'pending') return c.balanceOwed > 0;
    if (filterType === 'settled') return c.balanceOwed === 0;
    return true; // 'all'
  });

  // Calculate totals
  const totalBalanceOwed = customers.reduce((sum, c) => sum + (c.balanceOwed || 0), 0);
  const totalPendingCustomers = customers.filter(c => c.balanceOwed > 0).length;
  const totalSettledCount = customers.reduce((sum, c) => sum + (c.settledHistory ? c.settledHistory.length : 0), 0);

  // Handle open settle modal
  const handleOpenSettle = (cust) => {
    setSettleModalCust(cust);
    setSettleAmount(cust.balanceOwed.toString());
    setSettleMode('Cash');
    setSettleNotes(`Kadan full settlement - ${cust.name}`);
  };

  // Submit Settlement
  const handleConfirmSettle = (e) => {
    e.preventDefault();
    if (!settleModalCust) return;

    const amt = parseFloat(settleAmount);
    if (!amt || amt <= 0) {
      alert('Settle panna sariyaana amount enter pannunga!');
      return;
    }

    settleCustomerCredit({
      customerId: settleModalCust.id,
      amountPaid: amt,
      paymentMode: settleMode,
      notes: settleNotes
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setSettleModalCust(null);
  };

  // Handle Add Previous Customer (with custom purchase date)
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      alert('Customer name kandippa podanum!');
      return;
    }

    addNewCustomer({
      name: newCustName,
      phone: newCustPhone,
      address: newCustAddress,
      initialBalance: newCustBalance,
      purchaseDate: newCustPurchaseDate,
      itemsDescription: newCustItemsNote,
      billId: newCustBillId
    });

    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustBalance('');
    setNewCustItemsNote('');
    setNewCustBillId('');
    setIsAddCustModalOpen(false);
  };

  // Handle Add Past Credit to Existing Customer
  const handleAddPastCreditSubmit = (e) => {
    e.preventDefault();
    if (!pastCreditModalCust) return;

    const amt = parseFloat(pastCreditAmt);
    if (!amt || amt <= 0) {
      alert('Sariyaana amount enter pannunga!');
      return;
    }

    addPastCreditToCustomer(pastCreditModalCust.id, {
      amount: amt,
      purchaseDate: pastCreditDate,
      itemsDescription: pastCreditItems,
      billId: pastCreditBillId
    });

    setPastCreditModalCust(null);
    setPastCreditAmt('');
    setPastCreditItems('');
    setPastCreditBillId('');
  };

  // Handle Edit Customer Profile
  const handleEditCustomerSubmit = (e) => {
    e.preventDefault();
    if (!editingCust || !editCustName.trim()) return;

    updateCustomer(editingCust.id, {
      name: editCustName.trim(),
      phone: editCustPhone.trim(),
      address: editCustAddress.trim()
    });

    setEditingCust(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-28 sm:pb-24">
      
      {/* Header & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 m-0">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Customer Database & Kadan Book</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Credit baaki kanakku, purchase dates, matrum pazhaiya customer records serkkum vasathi
          </p>
        </div>

        {/* Feature: Add Previous Customer Data with Purchase Date */}
        <button
          onClick={() => setIsAddCustModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <History className="w-4 h-4" />
          <span>+ Pazhaiya Customer Record Serka</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        
        {/* Total Kadan Pending */}
        <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-4 shadow-lg shadow-rose-500/20">
          <div className="flex items-center justify-between opacity-80 text-xs font-semibold uppercase tracking-wider">
            <span>Kadaiku Vara Vendiya Kadan</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">
            ₹{totalBalanceOwed.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-rose-100 mt-1">
            {totalPendingCustomers} Customers baaki vaithullargal
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Moththa Customers</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {customers.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Active customer accounts
          </div>
        </div>

        {/* Settled Transactions Count */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Settled Aana Payments</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {totalSettledCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Cash & UPI settlements recorded
          </div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Customer name or phone search..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterType('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'pending'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Kadan Baaki ({totalPendingCustomers})
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ellarum ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('settled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'settled'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Full Settled ({customers.filter(c => c.balanceOwed === 0).length})
          </button>
        </div>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">Customer Records Yedhum Illai</h3>
          <p className="text-xs text-slate-500 mt-1">
            Mela ulla "+ Pazhaiya Customer Record Serka" button click panni pudhu customer serunga.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map(customer => {
            const hasKadan = customer.balanceOwed > 0;
            const isExpanded = expandedCustId === customer.id;
            const creditBills = customer.creditBills || [];
            const settledHistory = customer.settledHistory || [];

            return (
              <div
                key={customer.id}
                className={`bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  hasKadan ? 'border-rose-200 shadow-2xs' : 'border-slate-200 shadow-2xs'
                }`}
              >
                {/* Main Customer Row */}
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Customer Info */}
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                      hasKadan ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 m-0">
                          {customer.name}
                        </h3>
                        {hasKadan ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            Kadan Irukku
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Zero Balance
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {customer.phone || 'No phone'}
                        </span>
                        {customer.address && customer.address !== '-' && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5" />
                            {customer.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Balance Owed & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 text-right">
                        Balance Owed (பாக்கி)
                      </div>
                      <div className={`text-base sm:text-xl font-black text-right ${
                        hasKadan ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        ₹{customer.balanceOwed.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      
                      {/* Settle button if balance > 0 */}
                      {hasKadan && (
                        <button
                          onClick={() => handleOpenSettle(customer)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Panam Settle</span>
                        </button>
                      )}

                      {/* Add another past credit bill to this customer */}
                      <button
                        onClick={() => {
                          setPastCreditModalCust(customer);
                          setPastCreditDate(new Date().toISOString().slice(0, 10));
                        }}
                        className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer text-xs font-semibold flex items-center gap-1"
                        title="+ Pazhaiya Kadan Entry Serka (Add Past Purchase)"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span className="hidden md:inline">+ Kadan Entry</span>
                      </button>

                      {/* Edit Customer Profile */}
                      <button
                        onClick={() => {
                          setEditingCust(customer);
                          setEditCustName(customer.name);
                          setEditCustPhone(customer.phone !== '-' ? customer.phone : '');
                          setEditCustAddress(customer.address !== '-' ? customer.address : '');
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Expand History Toggle */}
                      <button
                        onClick={() => setExpandedCustId(isExpanded ? null : customer.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-xs font-semibold flex items-center gap-1"
                      >
                        <History className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline">Varalaru</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>

                </div>

                {/* Expanded Ledger: Credit purchases & Settled history */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-3.5 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
                    
                    {/* SECTION 1: Credit Purchases (Balance Owed details & Purchase Dates) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 m-0">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Credit Purchases (கடன் வாங்கிய விவரங்கள் & தேதிகள்)</span>
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {creditBills.length} credit entries
                        </span>
                      </div>

                      {creditBills.length === 0 ? (
                        <p className="text-xs text-slate-500 italic pl-5">
                          Ivarukku kadan bill yedhum illai.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {creditBills.map((cb, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-3 rounded-xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 shadow-2xs"
                            >
                              <div className="flex-1">
                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                                    {cb.billId}
                                  </span>
                                  {/* CRITICAL FEATURE: Purchase Date prominently displayed */}
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                    <Calendar className="w-3 h-3 text-blue-600" />
                                    <span>Purchase Date: {new Date(cb.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                  </span>
                                </div>
                                <div className="text-slate-700 mt-1 text-xs font-medium">
                                  {cb.items}
                                </div>
                              </div>
                              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                                <div className="font-black text-rose-600 text-base">
                                  ₹{cb.amount.toLocaleString('en-IN')}
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                  cb.status === 'SETTLED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {cb.status === 'SETTLED' ? 'Settled Aaiduchu' : 'Kadan Baaki (Pending)'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SECTION 2: Settled Payments History */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 m-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Panam Settled Aana Varalaru (Settled Payments History)</span>
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {settledHistory.length} payments settled
                        </span>
                      </div>

                      {settledHistory.length === 0 ? (
                        <p className="text-xs text-slate-500 italic pl-5">
                          Munbu settled payment varalaru yedhum illai.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {settledHistory.map((sh, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs gap-2 shadow-2xs"
                            >
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold">
                                  {sh.paymentMode === 'UPI' ? <QrCode className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800">
                                    Settled via {sh.paymentMode}
                                  </div>
                                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                    <span className="font-semibold text-emerald-800">
                                      {new Date(sh.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span>•</span>
                                    <span>{sh.notes || 'Full/Part payment'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="font-black text-emerald-700 text-sm">
                                + ₹{sh.amount.toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Settle Customer Credit Modal */}
      {settleModalCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold m-0">Kadan Panam Vasool (Settle Balance)</h3>
                <p className="text-xs text-emerald-100 mt-0.5">{settleModalCust.name}</p>
              </div>
              <button
                onClick={() => setSettleModalCust(null)}
                className="p-1 rounded-lg bg-emerald-800/50 hover:bg-emerald-800 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSettle} className="p-5 space-y-4">
              
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800">Current Kadan Baaki:</span>
                <span className="text-lg font-black text-rose-700">₹{settleModalCust.balanceOwed.toLocaleString('en-IN')}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vasool Aagum Amount (Settlement Amount) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={settleModalCust.balanceOwed}
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setSettleAmount(settleModalCust.balanceOwed.toString())}
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200"
                  >
                    Full Balance (₹{settleModalCust.balanceOwed})
                  </button>
                  {settleModalCust.balanceOwed > 500 && (
                    <button
                      type="button"
                      onClick={() => setSettleAmount('500')}
                      className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
                    >
                      ₹500 Part
                    </button>
                  )}
                  {settleModalCust.balanceOwed > 1000 && (
                    <button
                      type="button"
                      onClick={() => setSettleAmount('1000')}
                      className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
                    >
                      ₹1,000 Part
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettleMode('Cash')}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      settleMode === 'Cash'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash (ரொக்கம்)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettleMode('UPI')}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      settleMode === 'UPI'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>UPI (GPay / PhonePe)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={settleNotes}
                  onChange={(e) => setSettleNotes(e.target.value)}
                  placeholder="e.g. GPay or Cash counter"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSettleModalCust(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer"
                >
                  Panam Settled Aaiduchu (Confirm)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: Add Previous Customer Record (MANUAL ENTRY WITH PURCHASE DATE) */}
      {isAddCustModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black m-0 flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <span>Pazhaiya Customer Record Serka</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mundhaiya kadan baaki & purchase date-udan enter pannunga
                </p>
              </div>
              <button
                onClick={() => setIsAddCustModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
              
              {/* 1. Customer Details */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Customer Details (வாடிக்கையாளர் விவரம்)
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Ramesh Electrician / Raja Contractor"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      placeholder="e.g. 98401 23456"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Address / Landmark
                    </label>
                    <input
                      type="text"
                      value={newCustAddress}
                      onChange={(e) => setNewCustAddress(e.target.value)}
                      placeholder="e.g. South Bazaar, Near Temple"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Previous Credit & Purchase Date (CORE REQUIREMENT) */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>2. Pazhaiya Kadan & Purchase Date (Outstanding Balance)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Balance Owed */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kadan Baaki Amount (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newCustBalance}
                      onChange={(e) => setNewCustBalance(e.target.value)}
                      placeholder="e.g. 3500 (Baaki Amount)"
                      className="w-full px-3.5 py-2.5 bg-rose-50 border border-rose-300 rounded-xl text-sm font-black text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  {/* PURCHASE DATE PICKER */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Kadan Thedi (Purchase Date) *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newCustPurchaseDate}
                      onChange={(e) => setNewCustPurchaseDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Items Description & Bill Reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Items Note (வாங்கிய சாமான்கள்)
                    </label>
                    <input
                      type="text"
                      value={newCustItemsNote}
                      onChange={(e) => setNewCustItemsNote(e.target.value)}
                      placeholder="e.g. 1.0 Sq mm Wire + 16A Switch"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Old Bill / Slip No. (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCustBillId}
                      onChange={(e) => setNewCustBillId(e.target.value)}
                      placeholder="e.g. SLIP-102"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

              </div>

              {/* Submit buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  Record Save Pannu
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: Add Past Credit to Existing Customer */}
      {pastCreditModalCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold m-0 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Pazhaiya Kadan Entry ({pastCreditModalCust.name})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select purchase date and amount to add to this customer
                </p>
              </div>
              <button
                onClick={() => setPastCreditModalCust(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPastCreditSubmit} className="p-5 space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kadan Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={pastCreditAmt}
                  onChange={(e) => setPastCreditAmt(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-rose-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Purchase Date (கடன் வாங்கிய தேதி) *</span>
                </label>
                <input
                  type="date"
                  required
                  value={pastCreditDate}
                  onChange={(e) => setPastCreditDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Items Purchased (சாமான்கள் குறிப்பு)
                </label>
                <input
                  type="text"
                  value={pastCreditItems}
                  onChange={(e) => setPastCreditItems(e.target.value)}
                  placeholder="e.g. 0.5 HP Motor + UPVC Valve"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bill No. / Slip No. (Optional)
                </label>
                <input
                  type="text"
                  value={pastCreditBillId}
                  onChange={(e) => setPastCreditBillId(e.target.value)}
                  placeholder="e.g. OLD-542"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPastCreditModalCust(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  Kadan Entry Serka
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 4: Edit Customer Profile */}
      {editingCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-base font-bold m-0 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Customer Profile Matra</span>
              </h3>
              <button
                onClick={() => setEditingCust(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCustomerSubmit} className="p-5 space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={editCustName}
                  onChange={(e) => setEditCustName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editCustPhone}
                  onChange={(e) => setEditCustPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={editCustAddress}
                  onChange={(e) => setEditCustAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`"${editingCust.name}" customer-ai delete panna venduma?`)) {
                      deleteCustomer(editingCust.id);
                      setEditingCust(null);
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Customer</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCust(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
