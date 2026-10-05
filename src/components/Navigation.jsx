import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Badge,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Count customers who have pending balance
  const kadanCustomersCount = customers.filter(c => (c.balance || c.balanceOwed || 0) > 0).length;

  const tabsConfig = [
    {
      id: 'billing',
      label: 'Categories & Bill',
      tamilLabel: 'பிரிவுகள் & பில்',
      icon: <CartIcon />,
      badge: cartTotalItems > 0 ? cartTotalItems : null,
      badgeColor: 'warning'
    },
    {
      id: 'customers',
      label: 'Customer Kadan Book',
      tamilLabel: 'வாடிக்கையாளர் கடன்',
      icon: <UsersIcon />,
      badge: kadanCustomersCount > 0 ? kadanCustomersCount : null,
      badgeColor: 'error'
    },
    {
      id: 'stock',
      label: 'Stock Nilavaram',
      tamilLabel: 'சரக்கு இருப்பு',
      icon: <StockIcon />,
      badge: lowStockProducts.length > 0 ? lowStockProducts.length : null,
      badgeColor: 'error'
    },
    {
      id: 'sales',
      label: 'Virpanai Kanakku',
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
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { sm: 3 } }}>
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
                  <Box sx={{ textAlign: 'left', ml: 0.5 }}>
                    <Typography component="span" sx={{ display: 'block', fontWeight: 800, fontSize: '0.875rem', lineHeight: 1.2 }}>
                      {tab.label}
                    </Typography>
                    <Typography component="span" sx={{ display: 'block', fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.1 }}>
                      {tab.tamilLabel}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
      </Paper>

      {/* Mobile Bottom Fixed Navigation (App Experience) */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          display: { xs: 'block', sm: 'none' },
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <BottomNavigation
          value={currentTab}
          onChange={(e, val) => handleTabChange(val)}
          showLabels
          sx={{
            height: 62,
            bgcolor: '#ffffff',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              px: 1,
              py: 0.5,
              '&.Mui-selected': {
                color: 'primary.main',
                '& .MuiTypography-root': { fontWeight: 800 }
              }
            }
          }}
        >
          {tabsConfig.map((tab) => (
            <BottomNavigationAction
              key={tab.id}
              value={tab.id}
              label={
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, mt: 0.3 }}>
                  {tab.label.split(' ')[0]}
                </Typography>
              }
              icon={
                tab.badge ? (
                  <Badge badgeContent={tab.badge} color={tab.badgeColor} sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
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
