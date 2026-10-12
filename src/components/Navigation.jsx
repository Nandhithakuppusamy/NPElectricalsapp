import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Stack
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  People as UsersIcon,
  Inventory2 as StockIcon,
  QueryStats as SalesIcon
} from '@mui/icons-material';

export default function Navigation() {
  const {
    currentTab,
    setCurrentTab,
    setSelectedCategory,
    cartTotalItems,
    lowStockProducts,
    customers
  } = useShop();

  // Count customers who have pending balance
  const kadanCustomersCount = customers.filter(c => (c.balance || c.balanceOwed || 0) > 0).length;

  const tabsConfig = [
    {
      id: 'billing',
      label: 'Categories & Bill',
      shortLabel: 'Billing',
      tamilLabel: 'பிரிவுகள் & பில்',
      icon: <CartIcon />,
      badge: cartTotalItems > 0 ? cartTotalItems : null,
      badgeColor: 'warning'
    },
    {
      id: 'customers',
      label: 'Customer Kadan Book',
      shortLabel: 'Kadan Book',
      tamilLabel: 'வாடிக்கையாளர் கடன்',
      icon: <UsersIcon />,
      badge: kadanCustomersCount > 0 ? kadanCustomersCount : null,
      badgeColor: 'error'
    },
    {
      id: 'stock',
      label: 'Stock Nilavaram',
      shortLabel: 'Stock',
      tamilLabel: 'சரக்கு இருப்பு',
      icon: <StockIcon />,
      badge: lowStockProducts.length > 0 ? lowStockProducts.length : null,
      badgeColor: 'error'
    },
    {
      id: 'sales',
      label: 'Virpanai Kanakku',
      shortLabel: 'Virpanai',
      tamilLabel: 'விற்பனை கணக்கு',
      icon: <SalesIcon />,
      badge: null
    }
  ];

  const handleTabChange = (newVal) => {
    setCurrentTab(newVal);
    if (newVal === 'billing') {
      setSelectedCategory(null);
    }
  };

  return (
    <>
      {/* Desktop / Tablet Sub-AppBar Sticky Tabs */}
      <Paper
        elevation={1}
        square
        sx={{
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: { xs: 60, sm: 68 },
          zIndex: 30,
          display: { xs: 'none', sm: 'block' }
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: { sm: 3 } }}>
          <Tabs
            value={currentTab}
            onChange={(e, val) => handleTabChange(val)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              minHeight: 56,
              '& .MuiTab-root': {
                minHeight: 56,
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'none',
                px: 2.5
              }
            }}
          >
            {tabsConfig.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                iconPosition="start"
                icon={
                  tab.badge ? (
                    <Badge badgeContent={tab.badge} color={tab.badgeColor} sx={{ '& .MuiBadge-badge': { fontWeight: 900 } }}>
                      {tab.icon}
                    </Badge>
                  ) : (
                    tab.icon
                  )
                }
                label={
                  <Stack direction="column" spacing={0} alignItems="flex-start" sx={{ ml: 0.5 }}>
                    <Typography component="span" sx={{ fontWeight: 800, fontSize: '0.875rem', lineHeight: 1.2 }}>
                      {tab.label}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.1 }}>
                      {tab.tamilLabel}
                    </Typography>
                  </Stack>
                }
              />
            ))}
          </Tabs>
        </Box>
      </Paper>

      {/* Mobile Bottom Fixed Navigation with Responsive Typography and No Overflow */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '100vw',
          zIndex: 40,
          display: { xs: 'block', sm: 'none' },
          borderTop: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <BottomNavigation
          value={currentTab}
          onChange={(e, val) => handleTabChange(val)}
          showLabels
          sx={{
            height: 66,
            width: '100%',
            maxWidth: '100%',
            bgcolor: '#ffffff',
            boxSizing: 'border-box',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              maxWidth: 'none',
              flex: 1,
              px: { xs: 0.5, sm: 1 },
              py: 0.75,
              overflow: 'hidden',
              '& .MuiBottomNavigationAction-label': {
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                mt: 0.4,
                lineHeight: 1.2,
                '&.Mui-selected': {
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  fontWeight: 900
                }
              },
              '&.Mui-selected': {
                color: 'primary.main'
              }
            }
          }}
        >
          {tabsConfig.map((tab) => (
            <BottomNavigationAction
              key={tab.id}
              value={tab.id}
              label={tab.shortLabel}
              icon={
                tab.badge ? (
                  <Badge 
                    badgeContent={tab.badge} 
                    color={tab.badgeColor} 
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16, fontWeight: 900 } }}
                  >
                    {tab.icon}
                  </Badge>
                ) : (
                  tab.icon
                )
              }
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
}
