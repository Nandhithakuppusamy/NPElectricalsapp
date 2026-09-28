import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  RotateCcw, 
  PhoneCall, 
  Store,
  Wallet
} from 'lucide-react';

export default function Header() {
  const { 
    products, 
    customers, 
    bills, 
    lowStockProducts, 
    resetToDefaultData, 
    exportDataJson,
    setCurrentTab,
    setSelectedCategory
  } = useShop();

  // Calculate today's sales
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysBills = bills.filter(b => b.date && b.date.slice(0, 10) === todayStr);
  const todaysTotal = todaysBills.reduce((sum, b) => sum + (b.total || 0), 0);

  // Total credit balance owed by customers
  const totalKadanBalance = customers.reduce((sum, c) => sum + (c.balanceOwed || 0), 0);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl border-b border-blue-900/50 sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" 
            onClick={() => {
              setCurrentTab('billing');
              setSelectedCategory(null);
            }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white m-0 p-0 leading-tight">
                  NP Electricals
                </h1>
                <span className="hidden xs:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Kadai App
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-200/80 font-medium leading-none mt-0.5">
                மின்துறை & குழாய் பொருட்கள் • Billing & Stock
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Low stock pill warning */}
            {lowStockProducts.length > 0 && (
              <button
                onClick={() => setCurrentTab('stock')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition text-xs font-semibold animate-pulse"
                title={`${lowStockProducts.length} items low stock`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Stock Alert:</span>
                <span className="bg-rose-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {lowStockProducts.length}
                </span>
              </button>
            )}

            {/* Total Kadan pill */}
            <button
              onClick={() => setCurrentTab('customers')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition text-xs font-semibold"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>Kadan Baaki:</span>
              <span className="font-bold text-white">₹{totalKadanBalance.toLocaleString('en-IN')}</span>
            </button>

            {/* Today's Sales pill */}
            <button
              onClick={() => setCurrentTab('sales')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition text-xs font-semibold"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inraiya Sales:</span>
              <span className="font-bold text-white">₹{todaysTotal.toLocaleString('en-IN')}</span>
            </button>

            {/* Backup JSON */}
            <button
              onClick={exportDataJson}
              title="Download Data Backup (JSON)"
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Reset Data */}
            <button
              onClick={resetToDefaultData}
              title="Reset to Demo Data"
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
