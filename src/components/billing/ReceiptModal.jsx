import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Paper,
  Divider,
  Alert,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  CheckCircle as CheckIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';

export default function ReceiptModal() {
  const { 
    lastCompletedBill, 
    showReceiptModal, 
    setShowReceiptModal 
  } = useShop();

  if (!showReceiptModal || !lastCompletedBill) return null;

  const bill = lastCompletedBill;
  const isCredit = bill.paymentMode === 'Credit';

  // Format date
  const billDate = new Date(bill.date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // WhatsApp share
  const handleWhatsAppShare = () => {
    let itemsText = bill.items
      .map((item, idx) => `${idx + 1}. ${item.name} (${item.size}) - ${item.qty} pcs x ₹${item.price} = ₹${item.total}`)
      .join('\n');

    let statusText = isCredit 
      ? `⚠️ PAYMENT STATUS: CREDIT (KADAN) - Pending Balance: ₹${bill.total}`
      : `✅ PAYMENT STATUS: AMOUNT SETTLED via ${bill.paymentMode}`;

    const text = `*NP ELECTRICALS - BILL RECEIPT*\n------------------------------\nBill No: ${bill.id}\nDate: ${billDate}\nCustomer: ${bill.customerName}\nPhone: ${bill.customerPhone}\n\n*ITEMS:*\n${itemsText}\n------------------------------\n*TOTAL AMOUNT: ₹${bill.total}*\n${statusText}\n------------------------------\nNandri! Meendum Varuga! 🙏`;

    const cleanPhone = bill.customerPhone ? bill.customerPhone.replace(/[^0-9]/g, '') : '';
    let waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (cleanPhone.length >= 10) {
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    }

    window.open(waUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={showReceiptModal}
      onClose={() => setShowReceiptModal(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon sx={{ color: '#f59e0b' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
            Bill Receipt Generated
          </Typography>
        </Box>
        <IconButton onClick={() => setShowReceiptModal(false)} sx={{ color: '#94a3b8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#ffffff' }}>
        {/* Printable Thermal Receipt Paper */}
        <Paper
          id="printable-bill"
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: '#ffffff',
            borderColor: '#e2e8f0',
            fontFamily: 'Roboto, monospace'
          }}
        >
          {/* Shop Header */}
          <Box sx={{ textAlign: 'center', pb: 2, mb: 2, borderBottom: '1px dashed #94a3b8' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', m: 0 }}>
              NP ELECTRICALS
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'block', mt: 0.5 }}>
              Electrical & Plumbing Hardware Store
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
              Main Road, Bus Stand Near • Ph: 98401 00000
            </Typography>
          </Box>

          {/* Meta Details */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1.5, mb: 1.5, borderBottom: '1px solid #f1f5f9', fontSize: '0.78rem' }}>
            <Box>
              <Typography variant="caption" sx={{ display: 'block' }}><strong>Bill No:</strong> {bill.id}</Typography>
              <Typography variant="caption" sx={{ display: 'block' }}><strong>Date:</strong> {billDate}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ display: 'block' }}><strong>Customer:</strong> {bill.customerName}</Typography>
              <Typography variant="caption" sx={{ display: 'block' }}><strong>Phone:</strong> {bill.customerPhone}</Typography>
            </Box>
          </Box>

          {/* Items Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', pb: 0.5, borderBottom: '1px solid #cbd5e1' }}>
            <Box sx={{ flex: 1 }}>Item (Size / Inches)</Box>
            <Box sx={{ width: 36, textAlign: 'center' }}>Qty</Box>
            <Box sx={{ width: 50, textAlign: 'right' }}>Rate</Box>
            <Box sx={{ width: 60, textAlign: 'right' }}>Total</Box>
          </Box>

          {/* Items List */}
          <Box sx={{ py: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            {bill.items.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#1e293b' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 600 }}>
                    Size: {item.size}
                  </Typography>
                </Box>
                <Box sx={{ width: 36, textAlign: 'center', fontWeight: 700 }}>{item.qty}</Box>
                <Box sx={{ width: 50, textAlign: 'right', color: '#64748b' }}>₹{item.price}</Box>
                <Box sx={{ width: 60, textAlign: 'right', fontWeight: 900 }}>₹{item.total}</Box>
              </Box>
            ))}
          </Box>

          {/* Subtotal & Total */}
          <Box sx={{ pt: 1.5, mt: 1, borderTop: '2px dashed #94a3b8' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                Moththa Bill Amount:
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>
                ₹{bill.total.toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Box>

          {/* Payment Status Alert Box */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            {isCredit ? (
              <Alert severity="warning" sx={{ borderRadius: 2, justifyContent: 'center' }}>
                <strong>CREDIT BILL (கடன் கணக்கு)</strong>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.3 }}>
                  Balance Owed: ₹{bill.total.toLocaleString('en-IN')} • Customer Database-il Save Aaiduchu
                </Typography>
              </Alert>
            ) : (
              <Alert severity="success" sx={{ borderRadius: 2, justifyContent: 'center' }}>
                <strong>AMOUNT SETTLED (பணம் பெறப்பட்டது)</strong>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.3 }}>
                  Payment Mode: {bill.paymentMode} • Settled on {billDate}
                </Typography>
              </Alert>
            )}
          </Box>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary' }}>
            🙏 நன்றி! மீண்டும் வருக! (Thank you! Visit again!) 🙏
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<ShareIcon />}
          onClick={handleWhatsAppShare}
          sx={{ flex: 1, borderRadius: 2.5, fontWeight: 800, fontSize: '0.8rem' }}
        >
          WhatsApp Share
        </Button>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ flex: 1, borderRadius: 2.5, fontWeight: 800, fontSize: '0.8rem', bgcolor: '#1e293b', color: '#fff', '&:hover': { bgcolor: '#0f172a' } }}
        >
          Print Bill
        </Button>
        <Button
          onClick={() => setShowReceiptModal(false)}
          sx={{ color: '#64748b', borderRadius: 2.5, fontWeight: 700 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
