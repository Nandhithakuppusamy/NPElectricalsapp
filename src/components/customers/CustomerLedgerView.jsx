import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import confetti from 'canvas-confetti';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
  Collapse,
  Tooltip,
  Divider,
  Stack
} from '@mui/material';
import {
  People as UsersIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckIcon,
  WarningAmber as WarningIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Payments as CashIcon,
  QrCode as UpiIcon,
  CreditCard as CreditIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

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

  // Dialog States
  const [isAddCustDialogOpen, setIsAddCustDialogOpen] = useState(false);
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
    const balance = c.balanceOwed !== undefined ? c.balanceOwed : (c.balance || 0);
    const matchesSearch = !q || 
      c.name.toLowerCase().includes(q) || 
      (c.phone && c.phone.includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterType === 'pending') return balance > 0;
    if (filterType === 'settled') return balance === 0;
    return true; // 'all'
  });

  // KPI Calculations
  const totalBalanceOwed = customers.reduce((sum, c) => sum + (c.balanceOwed !== undefined ? c.balanceOwed : (c.balance || 0)), 0);
  const totalPendingCustomers = customers.filter(c => (c.balanceOwed !== undefined ? c.balanceOwed : (c.balance || 0)) > 0).length;
  const totalSettledCount = customers.reduce((sum, c) => sum + (c.settledHistory ? c.settledHistory.length : 0), 0);

  // Open Settle Dialog
  const handleOpenSettle = (cust) => {
    const balance = cust.balanceOwed !== undefined ? cust.balanceOwed : (cust.balance || 0);
    setSettleModalCust(cust);
    setSettleAmount(balance.toString());
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

  // Submit Create Customer
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
    setIsAddCustDialogOpen(false);
  };

  // Submit Past Credit to Existing Customer
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

  // Submit Edit Customer
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
    <Box sx={{ py: { xs: 2.5, sm: 4 }, pb: { xs: 16, sm: 12 }, minHeight: '80vh' }}>
          <Container
  maxWidth={false}
  sx={{
    width: '100%',
    maxWidth: '2400px',
    mx: 'auto',
    px: { xs: 1.5, sm: 2.5, lg: 4 },
    boxSizing: 'border-box',
  }}
>        
        {/* Top Header & Actions */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <UsersIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h1" sx={{ color: '#0f172a', m: 0 }}>
                Customer Database & Kadan Book
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Credit baaki kanakku, purchase dates, matrum pazhaiya customer records serkkum vasathi
            </Typography>
          </Box>

          {/* Option to Add Previous Customer Data Manually */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => setIsAddCustDialogOpen(true)}
            sx={{
              borderRadius: 3,
              fontWeight: 800,
              fontSize: '0.85rem',
              px: 2.5,
              py: 1,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}
          >
            + Pazhaiya Customer Record Serka
          </Button>
        </Box>

        {/* Summary KPI Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          
          {/* Outstanding Credit Balance */}
          <Grid item xs={12} sm={4} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ bgcolor: '#dc2626', color: '#ffffff', borderRadius: 4, boxShadow: '0 8px 20px rgba(220, 38, 38, 0.25)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.9 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kadaiku Vara Vendiya Kadan
                  </Typography>
                  <WarningIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, color: '#ffffff' }}>
                  ₹{totalBalanceOwed.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#fee2e2', display: 'block', mt: 0.5 }}>
                  {totalPendingCustomers} Customers baaki vaithullargal
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Customers */}
          <Grid item xs={12} sm={4} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Moththa Customers
                  </Typography>
                  <UsersIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, color: '#0f172a' }}>
                  {customers.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Active registered accounts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Settled Transactions */}
          <Grid item xs={12} sm={4} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Settled Aana Payments
                  </Typography>
                  <CheckIcon sx={{ fontSize: 20, color: '#10b981' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, color: '#059669' }}>
                  {totalSettledCount}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Cash & UPI settlements recorded
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Search & Filter Bar */}
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
            placeholder="Customer name or phone search..."
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
              variant={filterType === 'pending' ? 'contained' : 'outlined'}
              color="error"
              size="small"
              onClick={() => setFilterType('pending')}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              Kadan Baaki ({totalPendingCustomers})
            </Button>
            <Button
              variant={filterType === 'all' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilterType('all')}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', bgcolor: filterType === 'all' ? '#0f172a' : 'transparent', color: filterType === 'all' ? '#fff' : '#475569', borderColor: '#cbd5e1' }}
            >
              Ellarum ({customers.length})
            </Button>
            <Button
              variant={filterType === 'settled' ? 'contained' : 'outlined'}
              color="success"
              size="small"
              onClick={() => setFilterType('settled')}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              Full Settled ({customers.filter(c => (c.balanceOwed !== undefined ? c.balanceOwed : (c.balance || 0)) === 0).length})
            </Button>
          </Box>
        </Paper>

        {/* Customer Table (Material UI Table) */}
        {filteredCustomers.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#ffffff' }}>
            <UsersIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
              Customer Records Yedhum Illai
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Mela ulla "+ Pazhaiya Customer Record Serka" button click panni pudhu customer serunga.
            </Typography>
          </Paper>
        ) : (
          <Box>
            {/* MOBILE VIEW: Customer Cards using Stack for clean alignment on mobile */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2 }}>
          {filteredCustomers.map((customer) => {
            const balance = customer.balanceOwed !== undefined ? customer.balanceOwed : (customer.balance || 0);
            const hasKadan = balance > 0;
            const isExpanded = expandedCustId === customer.id;
            const creditBills = customer.creditBills || customer.purchaseHistory?.filter(p => p.paymentType === 'Credit') || [];
            const settledHistory = customer.settledHistory || customer.purchaseHistory?.filter(p => p.paymentType !== 'Credit') || [];

            return (
              <Card key={customer.id} sx={{ borderRadius: 3, border: hasKadan ? '1.5px solid #fecaca' : '1px solid #e2e8f0', p: 2 }}>
                <Stack spacing={1.5}>
                  {/* Customer Header: Avatar + Name + Contact + Edit */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2.5,
                          bgcolor: hasKadan ? '#fee2e2' : '#d1fae5',
                          color: hasKadan ? '#b91c1c' : '#047857',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1rem'
                        }}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                          {customer.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 13 }} />
                          {customer.phone || 'No phone'}
                        </Typography>
                      </Box>
                    </Stack>

                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingCust(customer);
                        setEditCustName(customer.name);
                        setEditCustPhone(customer.phone !== '-' ? customer.phone : '');
                        setEditCustAddress(customer.address !== '-' ? customer.address : '');
                      }}
                      sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>

                  {/* Address */}
                  {customer.address && customer.address !== '-' && (
                    <Typography variant="caption" sx={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                      {customer.address}
                    </Typography>
                  )}

                  <Divider />

                  {/* Balance & Status */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Balance Owed (பாக்கி)
                      </Typography>
                      <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: hasKadan ? '#dc2626' : '#059669' }}>
                        ₹{balance.toLocaleString('en-IN')}
                      </Typography>
                    </Box>

                    {hasKadan ? (
                      <Chip label="Kadan Irukku" color="error" size="small" sx={{ fontWeight: 800, fontSize: '0.7rem' }} />
                    ) : (
                      <Chip label="Zero Balance" color="success" variant="outlined" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                    )}
                  </Stack>

                  {/* Action Buttons: Settle + Add Past Credit + Expand History */}
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ pt: 0.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {hasKadan && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleOpenSettle(customer)}
                          sx={{ borderRadius: 2, fontWeight: 800, fontSize: '0.75rem', px: 1.5, py: 0.5 }}
                        >
                          Panam Settle
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddCircleIcon sx={{ fontSize: 15 }} />}
                        onClick={() => {
                          setPastCreditModalCust(customer);
                          setPastCreditDate(new Date().toISOString().slice(0, 10));
                        }}
                        sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.72rem', color: '#b45309', borderColor: '#fde68a', bgcolor: '#fffbeb', py: 0.5 }}
                      >
                        + Kadan Serka
                      </Button>
                    </Stack>

                    <Button
                      size="small"
                      onClick={() => setExpandedCustId(isExpanded ? null : customer.id)}
                      endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      sx={{ fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      History
                    </Button>
                  </Stack>

                  {/* Mobile Expanded History Details */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ pt: 1.5, borderTop: '1px solid #e2e8f0', mt: 1 }}>
                      {/* Credit Purchases Section */}
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <CreditIcon sx={{ fontSize: 15 }} />
                        Credit Purchases & Dates:
                      </Typography>
                      {creditBills.length === 0 ? (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                          Kadan bill yedhum illai.
                        </Typography>
                      ) : (
                        <Stack spacing={0.8} sx={{ mb: 1.5 }}>
                          {creditBills.map((cb, idx) => (
                            <Paper key={idx} variant="outlined" sx={{ p: 1, borderRadius: 2, bgcolor: '#f8fafc' }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                  <Chip
                                    icon={<CalendarIcon sx={{ fontSize: '12px !important' }} />}
                                    label={new Date(cb.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                                  />
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', display: 'block', mt: 0.3 }}>
                                    {cb.items || cb.itemsDescription || 'Hardware items'}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography sx={{ fontWeight: 900, color: '#dc2626', fontSize: '0.85rem' }}>
                                    ₹{(cb.amount || 0).toLocaleString('en-IN')}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: cb.status === 'SETTLED' ? '#059669' : '#dc2626', fontWeight: 700, fontSize: '0.65rem' }}>
                                    {cb.status === 'SETTLED' ? 'Settled' : 'Pending'}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      )}

                      {/* Settled History Section */}
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <CheckIcon sx={{ fontSize: 15 }} />
                        Settled History:
                      </Typography>
                      {settledHistory.length === 0 ? (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Settled history yedhum illai.
                        </Typography>
                      ) : (
                        <Stack spacing={0.8}>
                          {settledHistory.map((sh, idx) => (
                            <Paper key={idx} variant="outlined" sx={{ p: 1, borderRadius: 2, bgcolor: '#f0fdf4' }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                  <Chip
                                    label={`${sh.paymentType || sh.paymentMode || 'Cash'} • ${new Date(sh.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                                  />
                                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.3 }}>
                                    {sh.notes || 'Payment received'}
                                  </Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 900, color: '#059669', fontSize: '0.85rem' }}>
                                  ₹{(sh.amount || 0).toLocaleString('en-IN')}
                                </Typography>
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Collapse>
                </Stack>
              </Card>
            );
          })}
        </Box>

        {/* DESKTOP/TABLET: Customer Table (Material UI Table) */}
        <TableContainer component={Paper} variant="outlined" sx={{ display: { xs: 'none', sm: 'block' }, borderRadius: 4, bgcolor: '#ffffff', overflow: 'hidden' }}>
          <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Customer Name & Contact</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Address / Ooru</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Balance Owed (பாக்கி)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const balance = customer.balanceOwed !== undefined ? customer.balanceOwed : (customer.balance || 0);
                  const hasKadan = balance > 0;
                  const isExpanded = expandedCustId === customer.id;
                  const creditBills = customer.creditBills || customer.purchaseHistory?.filter(p => p.paymentType === 'Credit') || [];
                  const settledHistory = customer.settledHistory || customer.purchaseHistory?.filter(p => p.paymentType !== 'Credit') || [];

                  return (
                    <React.Fragment key={customer.id}>
                      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                        
                        {/* Name & Phone */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2.5,
                                bgcolor: hasKadan ? '#fee2e2' : '#d1fae5',
                                color: hasKadan ? '#b91c1c' : '#047857',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900,
                                fontSize: '0.9rem'
                              }}
                            >
                              {customer.name.charAt(0).toUpperCase()}
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                                {customer.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 13 }} />
                                {customer.phone || 'No phone'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Address */}
                        <TableCell>
                          <Typography variant="caption" sx={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                            {customer.address && customer.address !== '-' ? customer.address : 'Not specified'}
                          </Typography>
                        </TableCell>

                        {/* Balance Owed */}
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: hasKadan ? '#dc2626' : '#059669' }}>
                            ₹{balance.toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>

                        {/* Status */}
                        <TableCell align="center">
                          {hasKadan ? (
                            <Chip 
                              label="Kadan Irukku" 
                              color="error" 
                              size="small" 
                              sx={{ fontWeight: 800, fontSize: '0.68rem', height: 22 }} 
                            />
                          ) : (
                            <Chip 
                              label="Zero Balance" 
                              color="success" 
                              variant="outlined" 
                              size="small" 
                              sx={{ fontWeight: 700, fontSize: '0.68rem', height: 22 }} 
                            />
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.8 }}>
                            
                            {/* Settle button if balance > 0 */}
                            {hasKadan && (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleOpenSettle(customer)}
                                sx={{ borderRadius: 2, fontWeight: 800, fontSize: '0.75rem', px: 1.5, py: 0.4 }}
                              >
                                Panam Settle
                              </Button>
                            )}

                            {/* Add past credit entry */}
                            <Tooltip title="+ Pazhaiya Kadan Entry Serka">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setPastCreditModalCust(customer);
                                  setPastCreditDate(new Date().toISOString().slice(0, 10));
                                }}
                                sx={{ color: '#d97706', bgcolor: '#fef3c7', '&:hover': { bgcolor: '#fde68a' } }}
                              >
                                <AddCircleIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>

                            {/* Edit Customer */}
                            <Tooltip title="Edit Customer">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingCust(customer);
                                  setEditCustName(customer.name);
                                  setEditCustPhone(customer.phone !== '-' ? customer.phone : '');
                                  setEditCustAddress(customer.address !== '-' ? customer.address : '');
                                }}
                                sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}
                              >
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>

                            {/* Expand History */}
                            <IconButton
                              size="small"
                              onClick={() => setExpandedCustId(isExpanded ? null : customer.id)}
                              sx={{ color: 'primary.main', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
                            >
                              {isExpanded ? <ExpandLessIcon sx={{ fontSize: 20 }} /> : <ExpandMoreIcon sx={{ fontSize: 20 }} />}
                            </IconButton>

                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Expanded History Details Row */}
                      <TableRow>
                        <TableCell sx={{ py: 0, px: 3, borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none' }} colSpan={5}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ py: 2.5, bgcolor: '#f8fafc', borderRadius: 3, p: 2.5, my: 1.5, border: '1px solid #e2e8f0' }}>
                              
                              {/* Credit Purchases Section */}
                              <Box sx={{ mb: 2.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                  <CreditIcon sx={{ fontSize: 18 }} />
                                  Credit Purchases (கடன் வாங்கிய விவரங்கள் & Purchase Dates)
                                </Typography>

                                {creditBills.length === 0 ? (
                                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', pl: 3 }}>
                                    Ivarukku kadan bill yedhum illai.
                                  </Typography>
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {creditBills.map((cb, idx) => (
                                      <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, bgcolor: '#ffffff' }}>
                                        <Box>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip label={cb.billId || `BILL-${idx+1}`} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                                            {/* Purchase Date Prominently Displayed */}
                                            <Chip
                                              icon={<CalendarIcon sx={{ fontSize: '13px !important' }} />}
                                              label={`Purchase Date: ${new Date(cb.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                                              size="small"
                                              color="primary"
                                              variant="outlined"
                                              sx={{ fontWeight: 800, fontSize: '0.7rem', height: 22 }}
                                            />
                                          </Box>
                                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mt: 0.5 }}>
                                            {cb.items || cb.itemsDescription || 'Hardware items'}
                                          </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: 'right' }}>
                                          <Typography sx={{ fontWeight: 900, color: '#dc2626', fontSize: '1rem' }}>
                                            ₹{(cb.amount || 0).toLocaleString('en-IN')}
                                          </Typography>
                                          <Typography variant="caption" sx={{ color: cb.status === 'SETTLED' ? '#059669' : '#dc2626', fontWeight: 700 }}>
                                            {cb.status === 'SETTLED' ? 'Settled Aaiduchu' : 'Kadan Baaki (Pending)'}
                                          </Typography>
                                        </Box>
                                      </Paper>
                                    ))}
                                  </Box>
                                )}
                              </Box>

                              <Divider sx={{ my: 2 }} />

                              {/* Settled History Section */}
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                  <CheckIcon sx={{ fontSize: 18 }} />
                                  Panam Settled Aana Varalaru (Settled Payments History)
                                </Typography>

                                {settledHistory.length === 0 ? (
                                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', pl: 3 }}>
                                    Munbu settled payment varalaru yedhum illai.
                                  </Typography>
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {settledHistory.map((sh, idx) => (
                                      <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#ffffff' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                          <Box sx={{ p: 0.8, borderRadius: 2, bgcolor: '#ecfdf5', color: '#059669' }}>
                                            {sh.paymentMode === 'UPI' || sh.paymentType === 'UPI' ? <UpiIcon sx={{ fontSize: 18 }} /> : <CashIcon sx={{ fontSize: 18 }} />}
                                          </Box>
                                          <Box>
                                            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                                              Settled via {sh.paymentMode || sh.paymentType || 'Cash'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                              {new Date(sh.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {sh.notes || 'Payment recorded'}
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <Typography sx={{ fontWeight: 900, color: '#059669', fontSize: '0.95rem' }}>
                                          + ₹{(sh.amount || 0).toLocaleString('en-IN')}
                                        </Typography>
                                      </Paper>
                                    ))}
                                  </Box>
                                )}
                              </Box>

                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        )}

        {/* DIALOG 1: Settle Customer Balance (Material UI Dialog) */}
        {settleModalCust && (
          <Dialog
            open={Boolean(settleModalCust)}
            onClose={() => setSettleModalCust(null)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
          >
            <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                  Kadan Panam Vasool (Settle Balance)
                </Typography>
                <Typography variant="caption" sx={{ color: '#d1fae5' }}>
                  {settleModalCust.name}
                </Typography>
              </Box>
              <IconButton onClick={() => setSettleModalCust(null)} sx={{ color: '#ffffff' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleConfirmSettle}>
              <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  Current Kadan Baaki: <strong>₹{(settleModalCust.balanceOwed !== undefined ? settleModalCust.balanceOwed : (settleModalCust.balance || 0)).toLocaleString('en-IN')}</strong>
                </Alert>

                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Vasool Aagum Amount (Settlement Amount) *"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  size="small"
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => setSettleAmount((settleModalCust.balanceOwed !== undefined ? settleModalCust.balanceOwed : (settleModalCust.balance || 0)).toString())}
                    sx={{ borderRadius: 2, fontSize: '0.72rem', fontWeight: 800 }}
                  >
                    Full Balance
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSettleAmount('500')}
                    sx={{ borderRadius: 2, fontSize: '0.72rem', fontWeight: 700 }}
                  >
                    ₹500 Part
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSettleAmount('1000')}
                    sx={{ borderRadius: 2, fontSize: '0.72rem', fontWeight: 700 }}
                  >
                    ₹1,000 Part
                  </Button>
                </Box>

                <RadioGroup
                  row
                  value={settleMode}
                  onChange={(e) => setSettleMode(e.target.value)}
                  sx={{ mt: 1 }}
                >
                  <FormControlLabel value="Cash" control={<Radio color="success" size="small" />} label="Cash (ரொக்கம்)" />
                  <FormControlLabel value="UPI" control={<Radio color="primary" size="small" />} label="UPI (GPay / PhonePe)" />
                </RadioGroup>

                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  placeholder="e.g. Cash counter payment"
                  value={settleNotes}
                  onChange={(e) => setSettleNotes(e.target.value)}
                  size="small"
                />
              </DialogContent>

              <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Button onClick={() => setSettleModalCust(null)} sx={{ color: '#64748b' }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="success">
                  Panam Settled Aaiduchu (Confirm)
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )}

        {/* DIALOG 2: Add Previous Customer Data Manually WITH PURCHASE DATE */}
        <Dialog
          open={isAddCustDialogOpen}
          onClose={() => setIsAddCustDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
        >
          <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon sx={{ color: '#f59e0b' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', lineHeight: 1.2 }}>
                  Pazhaiya Customer Record Serka
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Manual customer entry with previous balance & purchase date
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsAddCustDialogOpen(false)} sx={{ color: '#94a3b8' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Box component="form" onSubmit={handleCreateCustomer}>
            <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                1. Customer Details (வாடிக்கையாளர் விவரம்)
              </Typography>

              <TextField
                required
                fullWidth
                label="Customer Name *"
                placeholder="e.g. Ramesh Electrician / Raja Contractor"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                size="small"
              />

              <Grid container spacing={2}>
                <Grid item xs={6} size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="e.g. 98401 23456"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Address / Landmark"
                    placeholder="e.g. South Bazaar"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 0.5 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#dc2626' }}>
                2. Pazhaiya Kadan & Purchase Date (Outstanding Balance)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} size={{ xs: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Kadan Baaki Amount (₹) *"
                    placeholder="e.g. 3500"
                    value={newCustBalance}
                    onChange={(e) => setNewCustBalance(e.target.value)}
                    size="small"
                  />
                </Grid>

                {/* PURCHASE DATE PICKER (Core Requirement) */}
                <Grid item xs={6} size={{ xs: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="date"
                    label="Purchase Date select pannunga *"
                    value={newCustPurchaseDate}
                    onChange={(e) => setNewCustPurchaseDate(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Vangiya Porutkal Vivaram (Items Note)"
                placeholder="e.g. 2 inch screws, Finolex wires, 1 HP motor"
                value={newCustItemsNote}
                onChange={(e) => setNewCustItemsNote(e.target.value)}
                size="small"
              />

              <TextField
                fullWidth
                label="Pazhaiya Bill No. / Book Page No. (Optional)"
                placeholder="e.g. KADAN-PAGE-45"
                value={newCustBillId}
                onChange={(e) => setNewCustBillId(e.target.value)}
                size="small"
              />

            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <Button onClick={() => setIsAddCustDialogOpen(false)} sx={{ color: '#64748b' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Customer Record Save Pannu
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* DIALOG 3: Add Past Credit to Existing Customer */}
        {pastCreditModalCust && (
          <Dialog
            open={Boolean(pastCreditModalCust)}
            onClose={() => setPastCreditModalCust(null)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
          >
            <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                  + Kadan Entry Serka
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {pastCreditModalCust.name}
                </Typography>
              </Box>
              <IconButton onClick={() => setPastCreditModalCust(null)} sx={{ color: '#94a3b8' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleAddPastCreditSubmit}>
              <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Pudhu Kadan Amount (₹) *"
                  value={pastCreditAmt}
                  onChange={(e) => setPastCreditAmt(e.target.value)}
                  size="small"
                />

                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Purchase Date select pannunga *"
                  value={pastCreditDate}
                  onChange={(e) => setPastCreditDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="Porutkal Vivaram (Items Note)"
                  placeholder="e.g. 5 Pcs bend, 10 Pcs holder"
                  value={pastCreditItems}
                  onChange={(e) => setPastCreditItems(e.target.value)}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Bill No. / Note"
                  placeholder="e.g. SLIP-12"
                  value={pastCreditBillId}
                  onChange={(e) => setPastCreditBillId(e.target.value)}
                  size="small"
                />
              </DialogContent>

              <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Button onClick={() => setPastCreditModalCust(null)} sx={{ color: '#64748b' }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="error">
                  Kadan Save Pannu
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )}

        {/* DIALOG 4: Edit Customer Profile */}
        {editingCust && (
          <Dialog
            open={Boolean(editingCust)}
            onClose={() => setEditingCust(null)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
          >
            <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                Customer Profile Matra (Edit)
              </Typography>
              <IconButton onClick={() => setEditingCust(null)} sx={{ color: '#94a3b8' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleEditCustomerSubmit}>
              <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Customer Name *"
                  value={editCustName}
                  onChange={(e) => setEditCustName(e.target.value)}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={editCustPhone}
                  onChange={(e) => setEditCustPhone(e.target.value)}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Address / Landmark"
                  value={editCustAddress}
                  onChange={(e) => setEditCustAddress(e.target.value)}
                  size="small"
                />
              </DialogContent>

              <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Button onClick={() => setEditingCust(null)} sx={{ color: '#64748b' }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )}

      </Container>
    </Box>
  );
}
