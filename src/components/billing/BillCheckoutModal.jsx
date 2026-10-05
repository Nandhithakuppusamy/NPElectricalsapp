import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Alert,
  Box,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Payments as CashIcon,
  QrCode as UpiIcon,
  CreditCard as CreditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';

export default function BillCheckoutModal({ isOpen, onClose }) {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    cartSubtotal, 
    customers, 
    checkoutBill 
  } = useShop();

  // Form State
  const [paymentMode, setPaymentMode] = useState('Cash'); // 'Cash' | 'UPI' | 'Credit'
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handle selecting an existing customer from dropdown
  const handleSelectCustomer = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (!custId) {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      return;
    }
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone !== '-' ? found.phone : '');
      setCustomerAddress(found.address !== '-' ? found.address : '');
    }
  };

  // Submit and Confirm Bill
  const handleConfirmBill = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Bill-la porutkal yedhum illai! (Cart is empty)');
      return;
    }

    // Validation for Credit option
    if (paymentMode === 'Credit') {
      if (!customerName.trim()) {
        setErrorMsg('Credit (Kadan) bill-ku Customer Name kandippa thevai! (Customer name required for credit)');
        return;
      }
      if (!customerPhone.trim()) {
        setErrorMsg('Credit (Kadan) bill-ku Phone Number thevai! (Phone number required for credit)');
        return;
      }
    }

    try {
      // Fire confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      checkoutBill({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        paymentMode,
        notes: notes.trim()
      });

      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Bill save panna mudiyavillai. Try again.');
    }
  };

  const isCredit = paymentMode === 'Credit';

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, overflow: 'hidden' }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: 2.5, bgcolor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReceiptIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Bill Potu Panam Vangu (Confirm & Pay)
            </Typography>
            <Typography variant="caption" sx={{ color: '#93c5fd' }}>
              NP Electricals Counter Billing • Total Amount: ₹{cartSubtotal.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleConfirmBill}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5, maxHeight: '72vh', overflowY: 'auto' }}>
          
          {/* 1. Dynamic Bill Table (Material UI Table) */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
              Bill Items ({cart.length})
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, maxHeight: 220 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Product Name & Size</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800 }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Vilai</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Total</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map(({ product, qty }) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                          {product.name}
                        </Typography>
                        <Chip 
                          label={`Size: ${product.size}`} 
                          size="small" 
                          sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#fef3c7', color: '#92400e', mt: 0.3 }} 
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 2, bgcolor: '#f8fafc', p: 0.2 }}>
                          <IconButton size="small" onClick={() => updateCartQty(product.id, qty - 1)} sx={{ p: 0.3 }}>
                            <RemoveIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                          <Typography sx={{ width: 24, textAlign: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                            {qty}
                          </Typography>
                          <IconButton size="small" onClick={() => updateCartQty(product.id, qty + 1)} disabled={product.stock <= qty} sx={{ p: 0.3 }}>
                            <AddIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        ₹{product.price}
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: 900, color: 'primary.main' }}>
                        ₹{(product.price * qty).toLocaleString('en-IN')}
                      </TableCell>

                      <TableCell align="center">
                        <IconButton size="small" onClick={() => removeFromCart(product.id)} sx={{ color: '#ef4444' }}>
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* 2. Payment Options (Material UI RadioGroup) */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#f8fafc' }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem', mb: 1.5 }}>
                Panam Chelluthum Murai (Payment Option) *
              </FormLabel>
              
              <RadioGroup
                row
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}
              >
                {/* Cash Radio */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    border: paymentMode === 'Cash' ? '2px solid #10b981' : '1px solid #cbd5e1',
                    bgcolor: paymentMode === 'Cash' ? '#ecfdf5' : '#ffffff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPaymentMode('Cash')}
                >
                  <FormControlLabel
                    value="Cash"
                    control={<Radio color="success" size="small" />}
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <CashIcon sx={{ color: '#059669', fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>Cash</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          ரொக்கம் • Settled
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Paper>

                {/* UPI Radio */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    border: paymentMode === 'UPI' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    bgcolor: paymentMode === 'UPI' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPaymentMode('UPI')}
                >
                  <FormControlLabel
                    value="UPI"
                    control={<Radio color="primary" size="small" />}
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <UpiIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>UPI</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          GPay / PhonePe • Settled
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Paper>

                {/* Credit Radio */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    border: paymentMode === 'Credit' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                    bgcolor: paymentMode === 'Credit' ? '#fef2f2' : '#ffffff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPaymentMode('Credit')}
                >
                  <FormControlLabel
                    value="Credit"
                    control={<Radio color="error" size="small" />}
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <CreditIcon sx={{ color: '#dc2626', fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>Credit</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          கடன் • Balance Owed
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Paper>
              </RadioGroup>
            </FormControl>

            {/* Dynamic Status Alert based on Payment Option */}
            <Box sx={{ mt: 2 }}>
              {isCredit ? (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  Credit (Kadan) select panniyirukkeenga. Idhu customer database-il <strong>Balance Owed</strong>-aga save aagum. Customer Name & Phone kandippa thevai.
                </Alert>
              ) : (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  {paymentMode} select panniyirukkeenga. Idhu <strong>Amount Settled</strong> endru purchase date-udan record aagum.
                </Alert>
              )}
            </Box>
          </Paper>

          {/* 3. Customer Details Section */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                Customer Details {isCredit ? <Typography component="span" sx={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem' }}>(Kandippa Thevai *)</Typography> : <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>(Optional)</Typography>}
              </Typography>

              {/* Quick Select Existing Customer Dropdown */}
              {customers.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Pazhaiya Customer...</InputLabel>
                  <Select
                    value={selectedCustomerId}
                    label="Pazhaiya Customer..."
                    onChange={handleSelectCustomer}
                  >
                    <MenuItem value="">-- Puthiya Customer --</MenuItem>
                    {customers.map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name} ({c.phone}) - Kadan: ₹{c.balanceOwed || c.balance || 0}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label={isCredit ? "Customer Name *" : "Customer Name"}
                placeholder="e.g. Karthik Electrician"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <TextField
                fullWidth
                size="small"
                label={isCredit ? "Phone Number *" : "Phone Number"}
                placeholder="e.g. 98401 23456"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Customer Address / Landmark"
              placeholder="e.g. Bazaar Street, Opp to Bus Stand"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </Paper>

          {/* Validation Error Message */}
          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

        </DialogContent>

        {/* Dialog Actions / Total Amount Display at Bottom */}
        <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>
              Moththa Bill Amount (Total):
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.3 }}>
              ₹{cartSubtotal.toLocaleString('en-IN')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2.5, color: '#64748b' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 2.5,
                fontWeight: 900,
                px: 3.5,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              Bill Pottachu (Confirm Bill)
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
