import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  FlashOn as ZapIcon,
  ShoppingCart as CartIcon,
  People as UsersIcon,
  Inventory2 as StockIcon,
  QueryStats as SalesIcon,
  WarningAmber as AlertIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  AdminPanelSettings as ShieldIcon,
  Lock as LockIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
  FileDownload as DownloadIcon,
  RestartAlt as ResetIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export default function Header() {
  const {
    customers,
    bills,
    lowStockProducts,
    cartTotalItems,
    resetToDefaultData,
    exportDataJson,
    currentTab,
    setCurrentTab,
    setSelectedCategory,
    currentUser,
    setIsAuthModalOpen,
    backendConnected
  } = useShop();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Calculate today's sales
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysBills = bills.filter(b => b.date && (b.date.slice ? b.date.slice(0, 10) === todayStr : new Date(b.date).toISOString().slice(0, 10) === todayStr));
  const todaysTotal = todaysBills.reduce((sum, b) => sum + (b.amount || b.total || 0), 0);

  // Total credit balance owed by customers
  const totalKadanBalance = customers.reduce((sum, c) => sum + (c.balance || c.balanceOwed || 0), 0);
  const kadanCount = customers.filter(c => (c.balance || c.balanceOwed || 0) > 0).length;

  const navItems = [
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
      badge: kadanCount > 0 ? kadanCount : null,
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

  const handleNavClick = (id) => {
    setCurrentTab(id);
    if (id === 'billing') setSelectedCategory(null);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Top Main AppBar */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
<Toolbar
  sx={{
    px: { xs: 1, sm: 2, md: 3 },
    py: { xs: 1, sm: 0.8 },
    display: 'flex',
    flexWrap: { xs: 'wrap', lg: 'nowrap' },
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: { xs: 1, sm: 1.5 },
    minHeight: { xs: 60, sm: 68 },
  }}
>          
          {/* Left: Drawer Toggle Button & Shop Brand */}
          <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 0.5, sm: 2 },
    minWidth: 0,
    flex: '1 1 auto',
  }}
>
            <IconButton 
              color="inherit" 
              edge="start" 
              onClick={() => setDrawerOpen(true)}
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' }, borderRadius: 2.5 }}
              title="Open Navigation Menu"
            >
              <MenuIcon />
            </IconButton>

            <Box 
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
              onClick={() => {
                setCurrentTab('billing');
                setSelectedCategory(null);
              }}
            >
              <Box 
                sx={{ 
                  width: { xs: 38, sm: 44 }, 
                  height: { xs: 38, sm: 44 }, 
                  borderRadius: 3, 
                  bgcolor: '#f59e0b', 
                  color: '#0f172a',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
                  fontWeight: 900
                }}
              >
                <ZapIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.1, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                    NP Electricals
                  </Typography>
                  <Chip 
                    label="Kadai App" 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      bgcolor: 'rgba(245, 158, 11, 0.2)', 
                      color: '#fcd34d',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      display: { xs: 'none', sm: 'inline-flex' }
                    }} 
                  />
                  {/* MongoDB Live Status Pill */}
                  <Tooltip title={backendConnected ? "MongoDB Server (127.0.0.1:5000) Live Connection" : "Local Cache Mode"}>
                    <Chip 
                      icon={backendConnected ? <CloudDoneIcon sx={{ fontSize: '13px !important' }} /> : <CloudOffIcon sx={{ fontSize: '13px !important' }} />}
                      label={backendConnected ? 'MongoDB Live' : 'Offline'}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.65rem', 
                        fontWeight: 700, 
                        bgcolor: backendConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: backendConnected ? '#6ee7b7' : '#fca5a5',
                        border: `1px solid ${backendConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                        display: { xs: 'none', md: 'inline-flex' }
                      }} 
                    />
                  </Tooltip>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(191, 219, 254, 0.8)', fontWeight: 500, display: 'block', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  மின்துறை & குழாய் பொருட்கள் • Billing & Stock
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right: Summary Badges & Owner Actions */}
<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: { xs: 'flex-end', lg: 'flex-start' },
    flexWrap: 'wrap',
    gap: { xs: 0.5, sm: 1 },
    minWidth: 0,
    flexShrink: 0,
  }}
>            
            {/* Low stock warning chip */}
            {lowStockProducts.length > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setCurrentTab('stock')}
                startIcon={<AlertIcon />}
                sx={{
                  color: '#fda4af',
                  borderColor: 'rgba(244, 63, 94, 0.5)',
                  bgcolor: 'rgba(244, 63, 94, 0.15)',
                  py: 0.5,
                  px: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  borderRadius: 2.5,
                  '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.25)', borderColor: '#f43f5e' }
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, mr: 0.5 }}>Stock Alert:</Box>
                <Typography component="span" sx={{ fontWeight: 900, bgcolor: '#e11d48', px: 0.8, py: 0.1, borderRadius: 1.5, fontSize: '0.7rem', color: '#fff' }}>
                  {lowStockProducts.length}
                </Typography>
              </Button>
            )}

            {/* Total Kadan balance button */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentTab('customers')}
              startIcon={<WalletIcon sx={{ color: '#fbbf24' }} />}
              sx={{
                color: '#fef08a',
                borderColor: 'rgba(245, 158, 11, 0.4)',
                bgcolor: 'rgba(245, 158, 11, 0.12)',
                py: 0.5,
                px: 1.5,
                fontSize: '0.75rem',
                borderRadius: 2.5,
                display: { xs: 'none', lg: 'inline-flex' },
                '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.2)' }
              }}
            >
              Kadan Baaki: <Typography component="span" sx={{ fontWeight: 900, ml: 0.5, color: '#fff' }}>₹{totalKadanBalance.toLocaleString('en-IN')}</Typography>
            </Button>

            {/* Today's Sales button */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentTab('sales')}
              startIcon={<TrendingUpIcon sx={{ color: '#34d399' }} />}
              sx={{
                color: '#a7f3d0',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                py: 0.5,
                px: 1.5,
                fontSize: '0.75rem',
                borderRadius: 2.5,
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.2)' }
              }}
            >
              Inraiya Sales: <Typography component="span" sx={{ fontWeight: 900, ml: 0.5, color: '#fff' }}>₹{todaysTotal.toLocaleString('en-IN')}</Typography>
            </Button>

            {/* Owner Login Trigger */}
            <Button
              variant={currentUser ? "contained" : "outlined"}
              size="small"
              onClick={() => setIsAuthModalOpen(true)}
              startIcon={currentUser ? <ShieldIcon sx={{ color: '#a7f3d0' }} /> : <LockIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: currentUser ? '#ffffff' : '#e2e8f0',
                borderColor: currentUser ? 'transparent' : 'rgba(255,255,255,0.2)',
                bgcolor: currentUser ? '#2563eb' : 'rgba(255,255,255,0.06)',
                borderRadius: 2.5,
                fontSize: '0.75rem',
                px: { xs: 1, sm: 1.8 },
                py: 0.6,
                '&:hover': { bgcolor: currentUser ? '#1d4ed8' : 'rgba(255,255,255,0.12)' }
              }}
            >
              {currentUser ? currentUser.name.split(' ')[0] : 'Owner'}
            </Button>

            {/* Backup & Reset Icons */}
            <Tooltip title="Download JSON Backup">
              <IconButton 
                size="small" 
                onClick={exportDataJson}
                sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Reset Demo Data">
              <IconButton 
                size="small" 
                onClick={resetToDefaultData}
                sx={{ color: '#94a3b8', '&:hover': { color: '#f87171', bgcolor: 'rgba(239,68,68,0.1)' } }}
              >
                <ResetIcon fontSize="small" />
              </IconButton>
            </Tooltip>

          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Drawer for Quick Access (Material UI Drawer) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: 280, sm: 320 },
            bgcolor: '#ffffff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }
        }}
      >
        <Box>
          {/* Drawer Header */}
          <Box sx={{ p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: '#f59e0b', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ZapIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  NP Electricals
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Quick Navigation Menu
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Quick Metrics in Drawer */}
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Inraiya Virpanai:</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#10b981' }}>₹{todaysTotal.toLocaleString('en-IN')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Kadan Baaki (Total):</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#ef4444' }}>₹{totalKadanBalance.toLocaleString('en-IN')}</Typography>
            </Box>
          </Box>

          {/* Navigation Items List */}
          <List sx={{ p: 1.5 }}>
            {navItems.map((item) => {
              const isSelected = currentTab === item.id;
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleNavClick(item.id)}
                    selected={isSelected}
                    sx={{
                      borderRadius: 3,
                      py: 1.2,
                      px: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: '#ffffff',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '& .MuiListItemIcon-root': { color: '#ffffff' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: isSelected ? '#ffffff' : 'primary.main' }}>
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color={item.badgeColor}>
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          {item.label}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ fontSize: '0.72rem', color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b' }}>
                          {item.tamilLabel}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Drawer Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
            NP Electricals Kadai App • v2.0
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => {
              setDrawerOpen(false);
              setIsAuthModalOpen(true);
            }}
            startIcon={currentUser ? <ShieldIcon /> : <LockIcon />}
            sx={{ borderRadius: 2.5 }}
          >
            {currentUser ? `Admin: ${currentUser.name}` : 'Shop Owner Login'}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
