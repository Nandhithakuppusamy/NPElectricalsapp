import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import {
  QueryStats as SalesIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  Payments as CashIcon,
  QrCode as UpiIcon,
  CreditCard as CreditIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon,
  WarningAmber as WarningIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

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
  const totalRevenue = bills.reduce((sum, b) => sum + (b.total || b.amount || 0), 0);
  const settledRevenue = bills
    .filter(b => b.isSettled || b.paymentMode !== 'Credit')
    .reduce((sum, b) => sum + (b.total || b.amount || 0), 0);
  const totalCreditOwed = customers.reduce((sum, c) => sum + (c.balanceOwed !== undefined ? c.balanceOwed : (c.balance || 0)), 0);

  const todaysBills = bills.filter(b => b.date && b.date.slice(0, 10) === todayStr);
  const todaysRevenue = todaysBills.reduce((sum, b) => sum + (b.total || b.amount || 0), 0);

  const cashRevenue = bills
    .filter(b => b.paymentMode === 'Cash')
    .reduce((sum, b) => sum + (b.total || b.amount || 0), 0);
  const upiRevenue = bills
    .filter(b => b.paymentMode === 'UPI')
    .reduce((sum, b) => sum + (b.total || b.amount || 0), 0);

  // View Receipt
  const handleViewReceipt = (bill) => {
    setLastCompletedBill(bill);
    setShowReceiptModal(true);
  };

  return (
    <Box sx={{ py: { xs: 2.5, sm: 4 }, pb: { xs: 16, sm: 12 }, minHeight: '80vh' }}>
<Container
  maxWidth={false}
  sx={{
    width: '100%',
    maxWidth: '2400px',
    mx: 'auto',
    px: { xs: 1, sm: 2, md: 3 },
    boxSizing: 'border-box',
  }}
>        
        {/* Top Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SalesIcon color="primary" sx={{ fontSize: 28 }} />
             <Typography
  sx={{
    color: '#0f172a',
    m: 0,
    fontSize: { xs: '1.25rem', md: '1.8rem', lg: '2rem' },
    fontWeight: 800,
    lineHeight: 1.3,
  }}
>
  Kadai Virpanai & Sales History (Shop View)
</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Moththa virpanai, Cash/UPI vasool, kadan bill-gal matrum receipt vivaram
            </Typography>
          </Box>
        </Box>

        {/* KPI Stats Grid */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          
          {/* Today's Sales */}
          <Grid item xs={12} sm={6} md={3} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', borderRadius: 4, boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)' }}>
<CardContent sx={{ p: { xs: 2, md: 2.5, lg: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.9 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Inraiya Virpanai
                  </Typography>
                  <TrendingUpIcon sx={{ fontSize: 20, color: '#fcd34d' }} />
                </Box>
<Typography
  sx={{
    fontWeight: 900,
    mt: 1,
    color: '#059669',
    fontSize: { xs: '1.25rem', md: '1.6rem', lg: '1.8rem' },
  }}
>
                  ₹{todaysRevenue.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#bfdbfe', display: 'block', mt: 0.5 }}>
                  {todaysBills.length} Bills inru pottadhu
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Settled Revenue */}
          <Grid item xs={12} sm={6} md={3} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
<CardContent sx={{ p: { xs: 2, md: 2.5, lg: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Panam Settled
                  </Typography>
                  <CheckIcon sx={{ fontSize: 20, color: '#10b981' }} />
                </Box>
<Typography
  sx={{
    fontWeight: 900,
    mt: 1,
    color: '#059669',
    fontSize: { xs: '1.25rem', md: '1.6rem', lg: '1.8rem' },
  }}
>
                  ₹{settledRevenue.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Cash + UPI Collections
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Outstanding Credit */}
          <Grid item xs={12} sm={6} md={3} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5, lg: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kadan Baaki
                  </Typography>
                  <WarningIcon sx={{ fontSize: 20, color: '#ef4444' }} />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    mt: 1,
                    color: '#dc2626',
                    fontSize: { xs: '1.25rem', md: '1.6rem', lg: '1.8rem' },
                  }}
                >
                  ₹{totalCreditOwed.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Customers tara vendiya baaki
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Cash vs UPI split */}
          <Grid item xs={12} sm={6} md={3} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5, lg: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Vasool Mode Split
                  </Typography>
                  <CashIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: '#047857' }}>
                    💵 Cash: ₹{cashRevenue.toLocaleString('en-IN')}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: '#1d4ed8' }}>
                    📱 UPI: ₹{upiRevenue.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Filter and Search Bar */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <TextField
            placeholder="Bill No. or Customer name search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: { xs: '100%', sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, overflowX: 'auto' }}>
            <Button
              variant={dateFilter === 'TODAY' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<CalendarIcon />}
              onClick={() => setDateFilter(dateFilter === 'TODAY' ? 'ALL' : 'TODAY')}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              Inru Mattum (Today)
            </Button>
            <Button
              variant={filterMode === 'ALL' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilterMode('ALL')}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', bgcolor: filterMode === 'ALL' ? '#0f172a' : 'transparent', color: filterMode === 'ALL' ? '#fff' : '#475569', borderColor: '#cbd5e1' }}
            >
              Ellam
            </Button>
            <Button
              variant={filterMode === 'Cash' ? 'contained' : 'outlined'}
              color="success"
              size="small"
              onClick={() => setFilterMode('Cash')}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              Cash
            </Button>
            <Button
              variant={filterMode === 'UPI' ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              onClick={() => setFilterMode('UPI')}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              UPI
            </Button>
            <Button
              variant={filterMode === 'Credit' ? 'contained' : 'outlined'}
              color="error"
              size="small"
              onClick={() => setFilterMode('Credit')}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              Credit (Kadan)
            </Button>
          </Box>
        </Paper>

        {/* Bill History Table */}
        {filteredBills.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#ffffff' }}>
            <ReceiptIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
              Bills Yedhum Illai
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Vera filter choose panni try pannunga.
            </Typography>
          </Paper>
        ) : (
          <Box>
            {/* MOBILE VIEW: Sales Bill Cards using Stack for clean alignment on mobile */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2 }}>
              {filteredBills.map((bill) => {
                const isCredit = bill.paymentMode === 'Credit';
                const dateStr = new Date(bill.date).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <Card key={bill.id} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2 }}>
                    <Stack spacing={1.5}>
                      {/* Top: Bill ID + Payment Mode Chip + Status */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                           <Typography
  sx={{
    fontWeight: 800,
    fontSize: { xs: '0.85rem', md: '0.95rem', lg: '1rem' },
    color: '#0f172a',
  }}
>
                            {bill.id}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {dateStr}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <Chip
                            icon={
                              bill.paymentMode === 'Cash' ? <CashIcon sx={{ fontSize: '13px !important' }} /> :
                              bill.paymentMode === 'UPI' ? <UpiIcon sx={{ fontSize: '13px !important' }} /> :
                              <CreditIcon sx={{ fontSize: '13px !important' }} />
                            }
                            label={bill.paymentMode}
                            color={bill.paymentMode === 'Cash' ? 'success' : bill.paymentMode === 'UPI' ? 'primary' : 'error'}
                            size="small"
                            sx={{ fontWeight: 800, height: 22, fontSize: '0.65rem' }}
                          />
                          {isCredit ? (
                            <Chip label="Credit" color="error" variant="outlined" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22 }} />
                          ) : (
                            <Chip label="Settled" color="success" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22 }} />
                          )}
                        </Stack>
                      </Stack>

                      {/* Middle: Customer Details & Items Summary */}
                      <Box sx={{ bgcolor: '#f8fafc', p: 1.2, borderRadius: 2 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>
                          Customer: {bill.customerName} {bill.customerPhone && `(${bill.customerPhone})`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.3 }}>
                          Items: {bill.items.map(i => `${i.name} (${i.size}) x${i.qty}`).join(', ')}
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Bottom: Total Amount & View Receipt Button */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Moththa Bill</Typography>
                          <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.15rem' }}>
                            ₹{(bill.total || bill.amount || 0).toLocaleString('en-IN')}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewReceipt(bill)}
                          sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', py: 0.5 }}
                        >
                          Receipt Paaru
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
                );
              })}
            </Box>

            {/* DESKTOP/TABLET: Bill History Table */}
            <TableContainer
  component={Paper}
  variant="outlined"
  sx={{
    display: { xs: 'none', sm: 'block' },
    width: '100%',
    borderRadius: 4,
    bgcolor: '#ffffff',
    overflowX: 'auto',
  }}
>
              <Table
  sx={{
    width: '100%',
    '& th, & td': {
      px: { xs: 1, md: 2 },
      py: { xs: 1.5, md: 2 },
    },
  }}
>
              <TableHead>
                <TableRow>
<TableCell
  sx={{
    fontWeight: 800,
    fontSize: { xs: '0.8rem', md: '0.9rem', lg: '1rem' },
    whiteSpace: 'nowrap',
  }}
>
  Bill No. & Date
</TableCell>
<TableCell
  sx={{
    fontWeight: 800,
    fontSize: { xs: '0.8rem', md: '0.9rem', lg: '1rem' },
    whiteSpace: 'nowrap',
  }}
>
  Customer Details
</TableCell>           
<TableCell
  sx={{
    fontWeight: 800,
    fontSize: { xs: '0.8rem', md: '0.9rem', lg: '1rem' },
    whiteSpace: 'nowrap',
  }}
>
 Items Summary
</TableCell>
<TableCell
  sx={{
    fontWeight: 800,
    fontSize: { xs: '0.8rem', md: '0.9rem', lg: '1rem' },
    whiteSpace: 'nowrap',
  }}
>
 Payment Mode
</TableCell>
<TableCell
  sx={{
    fontWeight: 800,
    fontSize: { xs: '0.8rem', md: '0.9rem', lg: '1rem' },
    whiteSpace: 'nowrap',
  }}
>
 Status
</TableCell>
<TableCell
  sx={{
    fontWeight: 800,
    fontSize: { xs: '0.8rem', md: '0.9rem', lg: '1rem' },
    whiteSpace: 'nowrap',
  }}
>
  Total Amount
</TableCell>
<TableCell
  sx={{
    fontWeight: 800,
    fontSize: { xs: '0.8rem', md: '0.9rem', lg: '1rem' },
    whiteSpace: 'nowrap',
  }}
>
Receipt
</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBills.map((bill) => {
                  const isCredit = bill.paymentMode === 'Credit';
                  const dateStr = new Date(bill.date).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <TableRow key={bill.id} hover>
                      
                      {/* Bill No. & Date */}
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>
                          {bill.id}
                        </Typography>
                        <Typography variant="caption" sx={{
  color: 'text.secondary',
  fontSize: { xs: '0.7rem', md: '0.8rem', lg: '0.85rem' },
}}>
                          {dateStr}
                        </Typography>
                      </TableCell>

                      {/* Customer Details */}
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                          {bill.customerName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {bill.customerPhone}
                        </Typography>
                      </TableCell>

                      {/* Items */}
                      <TableCell sx={{ maxWidth: 220 }}>
<Typography
  sx={{
    fontWeight: 500,
    fontSize: { xs: '0.85rem', md: '0.95rem', lg: '1rem' },
    color: '#334155',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
  }}
>
                          {bill.items.map(i => `${i.name} (${i.size}) x${i.qty}`).join(', ')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {bill.items.reduce((s, i) => s + i.qty, 0)} items
                        </Typography>
                      </TableCell>

                      {/* Payment Mode */}
                      <TableCell align="center">
                        <Chip
                          icon={
                            bill.paymentMode === 'Cash' ? <CashIcon sx={{ fontSize: '14px !important' }} /> :
                            bill.paymentMode === 'UPI' ? <UpiIcon sx={{ fontSize: '14px !important' }} /> :
                            <CreditIcon sx={{ fontSize: '14px !important' }} />
                          }
                          label={bill.paymentMode}
                          color={bill.paymentMode === 'Cash' ? 'success' : bill.paymentMode === 'UPI' ? 'primary' : 'error'}
                          size="small"
                          sx={{ fontWeight: 800, height: 22, fontSize: '0.68rem' }}
                        />
                      </TableCell>

                      {/* Status */}
                      <TableCell align="center">
                        {isCredit ? (
                          <Chip label="Credit (Kadan)" color="error" variant="outlined" size="small" sx={{ fontWeight: 800, fontSize: '0.68rem', height: 22 }} />
                        ) : (
                          <Chip label="Settled" color="success" size="small" sx={{ fontWeight: 800, fontSize: '0.68rem', height: 22 }} />
                        )}
                      </TableCell>

                      {/* Total Amount */}
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1rem' }}>
                          ₹{(bill.total || bill.amount || 0).toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>

                      {/* Receipt Action */}
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewReceipt(bill)}
                          sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.72rem', py: 0.4 }}
                        >
                          Receipt
                        </Button>
                      </TableCell>

                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        )}

      </Container>
    </Box>
  );
}
