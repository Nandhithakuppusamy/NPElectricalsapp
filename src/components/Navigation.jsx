import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingCart, 
  Users, 
  Boxes, 
  BarChart3, 
  AlertCircle 
} from 'lucide-react';

export default function Navigation() {
  const { currentTab, setCurrentTab, setSelectedCategory, cartTotalItems, lowStockProducts, customers } = useShop();

  // Count customers who have pending balance
  const kadanCustomersCount = customers.filter(c => c.balanceOwed > 0).length;

  const tabs = [
    {
      id: 'billing',
      label: 'Categories & Bill',
      tamilLabel: 'பிரிவுகள் & பில்',
      icon: ShoppingCart,
      badge: cartTotalItems > 0 ? cartTotalItems : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    {
      id: 'customers',
      label: 'Customer Kadan Book',
      tamilLabel: 'வாடிக்கையாளர் கடன்',
      icon: Users,
      badge: kadanCustomersCount > 0 ? kadanCustomersCount : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'stock',
      label: 'Stock Nilavaram',
      tamilLabel: 'சரக்கு இருப்பு',
      icon: Boxes,
      badge: lowStockProducts.length > 0 ? lowStockProducts.length : null,
      badgeColor: 'bg-rose-600 text-white animate-pulse'
    },
    {
      id: 'sales',
      label: 'Virpanai Kanakku',
      tamilLabel: 'விற்பனை கணக்கு',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <>
      {/* Desktop Top Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-[57px] sm:top-[65px] z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    if (tab.id === 'billing') setSelectedCategory(null);
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <div className="text-left leading-tight">
                    <span>{tab.label}</span>
                    <span className={`block text-[10px] sm:hidden ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {tab.tamilLabel}
                    </span>
                  </div>
                  {tab.badge !== null && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 text-[11px] rounded-full font-bold flex items-center justify-center min-w-[20px] ${tab.badgeColor}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Fixed Navigation Bar (App Experience) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 z-50 shadow-2xl flex justify-around items-center">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentTab(tab.id);
                if (tab.id === 'billing') setSelectedCategory(null);
              }}
              className={`flex flex-col items-center justify-center relative py-1 px-2 rounded-xl transition ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight text-center leading-tight">
                {tab.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
