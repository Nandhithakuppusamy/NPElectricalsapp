import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { muiTheme } from './theme/muiTheme';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import BillingView from './components/billing/BillingView';
import CustomerLedgerView from './components/customers/CustomerLedgerView';
import StockManagementView from './components/stock/StockManagementView';
import SalesHistoryView from './components/sales/SalesHistoryView';
import ReceiptModal from './components/billing/ReceiptModal';
import AuthModal from './components/auth/AuthModal';

function MainAppContent() {
  const { currentTab, isAuthModalOpen, setIsAuthModalOpen } = useShop();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex', flexDirection: 'column' }}>
      {/* Top AppBar with Menu Items and Drawer */}
      <Header />

      {/* Navigation Bar (Desktop Tabs & Mobile App Tabs) */}
      <Navigation />

      {/* Dynamic Content Views */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {currentTab === 'billing' && <BillingView />}
        {currentTab === 'customers' && <CustomerLedgerView />}
        {currentTab === 'stock' && <StockManagementView />}
        {currentTab === 'sales' && <SalesHistoryView />}
      </Box>

      {/* Global Thermal Receipt Modal */}
      <ReceiptModal />

      {/* Shop Owner Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ShopProvider>
        <MainAppContent />
      </ShopProvider>
    </ThemeProvider>
  );
}
