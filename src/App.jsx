import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import BillingView from './components/billing/BillingView';
import CustomerLedgerView from './components/customers/CustomerLedgerView';
import StockManagementView from './components/stock/StockManagementView';
import SalesHistoryView from './components/sales/SalesHistoryView';
import ReceiptModal from './components/billing/ReceiptModal';

function MainAppContent() {
  const { currentTab } = useShop();

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Shop Header */}
      <Header />

      {/* Navigation Bar (Desktop Tabs & Mobile App Tabs) */}
      <Navigation />

      {/* Dynamic Content Views */}
      <main className="flex-1">
        {currentTab === 'billing' && <BillingView />}
        {currentTab === 'customers' && <CustomerLedgerView />}
        {currentTab === 'stock' && <StockManagementView />}
        {currentTab === 'sales' && <SalesHistoryView />}
      </main>

      {/* Global Thermal Receipt Modal */}
      <ReceiptModal />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
