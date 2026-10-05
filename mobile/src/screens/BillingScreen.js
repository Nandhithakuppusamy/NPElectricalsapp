import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import ResponsiveContainer from '../components/ResponsiveContainer';
import Header from '../components/Header';
import ReceiptModal from '../components/ReceiptModal';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

export default function BillingScreen({ navigation }) {
  const {
    cart,
    updateCartQty,
    clearCart,
    cartSubtotal,
    cartTotalItems,
    customers,
    createBill
  } = useShop();

  const [paymentType, setPaymentType] = useState('Cash'); // 'Cash' | 'UPI' | 'Credit'
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Receipt Modal State
  const [completedBill, setCompletedBill] = useState(null);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);

  // When customer selected from dropdown/picker
  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
    const found = customers.find((c) => c.id === customerId);
    if (found) {
      setCustName(found.name);
      setCustPhone(found.phone || '');
      setCustAddress(found.address || '');
    } else {
      setCustName('');
      setCustPhone('');
      setCustAddress('');
    }
  };

  const handleConfirmBill = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Bill', 'Bill-il endha porulum illai!');
      return;
    }

    if (paymentType === 'Credit' && !custName.trim()) {
      Alert.alert(
        'Customer Vivaram Thevai',
        'Credit (கடன்) bill-ukku Customer Name kandippa thevai!'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const bill = await createBill({
        customerName: custName.trim() || 'Walk-in Customer',
        customerPhone: custPhone.trim() || '-',
        customerAddress: custAddress.trim() || '-',
        paymentType,
        items: cart,
        total: cartSubtotal,
        customerId: selectedCustomerId || undefined
      });

      setCompletedBill(bill);
      setIsReceiptVisible(true);
      setSelectedCustomerId('');
      setCustName('');
      setCustPhone('');
      setCustAddress('');
    } catch (err) {
      Alert.alert('Error', 'Bill save seiyavillai. Meendum muyarchikkavum.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCartRow = ({ item }) => (
    <View style={styles.cartRow}>
      <View style={styles.itemCol}>
        <Text style={styles.rowItemName}>{item.product.name}</Text>
        <Text style={styles.rowItemSize}>
          {item.product.size} • ₹{item.product.price} / {item.product.unit || 'pcs'}
        </Text>
      </View>

      {/* Qty Selector */}
      <View style={styles.qtyControlBox}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateCartQty(item.product.id, item.qty - 1)}
        >
          <Ionicons name="remove" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.qtyNumber}>{item.qty}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateCartQty(item.product.id, item.qty + 1)}
        >
          <Ionicons name="add" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Row Total */}
      <View style={styles.rowTotalCol}>
        <Text style={styles.rowTotalText}>
          ₹{(item.product.price * item.qty).toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Delete Item */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => updateCartQty(item.product.id, 0)}
      >
        <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ResponsiveContainer>
      <Header navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Page Title */}
          <View style={styles.titleSection}>
            <View>
              <Text style={styles.pageTitle}>Billing & Bill Podum Idam</Text>
              <Text style={styles.pageSubtitle}>
                Product serka, payment method select panna, bill mudikka
              </Text>
            </View>

            {cart.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  Alert.alert('Bill Clear Seiyalaama?', 'Ellam items neekkappadum.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear', style: 'destructive', onPress: clearCart }
                  ]);
                }}
              >
                <Ionicons name="refresh" size={16} color={COLORS.danger} />
                <Text style={styles.clearBtnText}>Clear Bill</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* If Cart is empty */}
          {cart.length === 0 ? (
            <View style={styles.emptyCartBox}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="receipt-outline" size={54} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyCartTitle}>Bill-il Porutkal Yedhum Illai</Text>
              <Text style={styles.emptyCartSub}>
                Categories alladhu Sarakku pakkathil poi porutkalai bill-il serunga.
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate('Categories')}
                activeOpacity={0.8}
              >
                <Ionicons name="grid-outline" size={18} color="#ffffff" />
                <Text style={styles.browseBtnText}>Categories-ku Po (Browse Products)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Bill Items Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.thText, { flex: 2 }]}>Porutkal (Item)</Text>
                <Text style={[styles.thText, { width: 90, textAlign: 'center' }]}>Alavu (Qty)</Text>
                <Text style={[styles.thText, { width: 75, textAlign: 'right' }]}>Total (₹)</Text>
                <Text style={[styles.thText, { width: 30 }]}></Text>
              </View>

              {/* Items List */}
              <View style={styles.itemsWrapper}>
                {cart.map((item) => (
                  <View key={item.product.id}>
                    {renderCartRow({ item })}
                  </View>
                ))}
              </View>

              {/* Subtotal Box */}
              <View style={styles.subtotalCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Items Count:</Text>
                  <Text style={styles.summaryValue}>{cartTotalItems} Units ({cart.length} items)</Text>
                </View>
                <View style={[styles.summaryRow, { marginTop: 6 }]}>
                  <Text style={styles.totalBigLabel}>Moththa Bill (Total):</Text>
                  <Text style={styles.totalBigValue}>₹{cartSubtotal.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              {/* PAYMENT OPTIONS SELECTOR */}
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>1. Payment Method Select Pannunga *</Text>
                <View style={styles.paymentButtonsRow}>
                  {/* Cash */}
                  <TouchableOpacity
                    style={[
                      styles.payOptionBtn,
                      paymentType === 'Cash' && styles.payOptionBtnActiveCash
                    ]}
                    onPress={() => setPaymentType('Cash')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="cash-outline"
                      size={20}
                      color={paymentType === 'Cash' ? '#ffffff' : COLORS.text}
                    />
                    <Text
                      style={[
                        styles.payOptionText,
                        paymentType === 'Cash' && styles.payOptionTextActive
                      ]}
                    >
                      Cash (ரொக்கம்)
                    </Text>
                  </TouchableOpacity>

                  {/* UPI */}
                  <TouchableOpacity
                    style={[
                      styles.payOptionBtn,
                      paymentType === 'UPI' && styles.payOptionBtnActiveUPI
                    ]}
                    onPress={() => setPaymentType('UPI')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="qr-code-outline"
                      size={20}
                      color={paymentType === 'UPI' ? '#ffffff' : COLORS.text}
                    />
                    <Text
                      style={[
                        styles.payOptionText,
                        paymentType === 'UPI' && styles.payOptionTextActive
                      ]}
                    >
                      UPI (GPay/PhonePe)
                    </Text>
                  </TouchableOpacity>

                  {/* Credit (Kadan) */}
                  <TouchableOpacity
                    style={[
                      styles.payOptionBtn,
                      paymentType === 'Credit' && styles.payOptionBtnActiveCredit
                    ]}
                    onPress={() => setPaymentType('Credit')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="book-outline"
                      size={20}
                      color={paymentType === 'Credit' ? '#ffffff' : COLORS.text}
                    />
                    <Text
                      style={[
                        styles.payOptionText,
                        paymentType === 'Credit' && styles.payOptionTextActive
                      ]}
                    >
                      Credit (கடன் புக்)
                    </Text>
                  </TouchableOpacity>
                </View>

                {paymentType === 'Credit' ? (
                  <View style={styles.creditAlertNotice}>
                    <Ionicons name="information-circle" size={18} color="#991b1b" />
                    <Text style={styles.creditAlertText}>
                      Credit select seiyappattadhu. Indha amount customer kadan account-il serkkappadum!
                    </Text>
                  </View>
                ) : (
                  <View style={styles.settledNotice}>
                    <Ionicons name="checkmark-circle" size={18} color="#065f46" />
                    <Text style={styles.settledNoticeText}>
                      {paymentType} moolam panam petrathaal "Amount Settled" endru record aagum!
                    </Text>
                  </View>
                )}
              </View>

              {/* CUSTOMER DETAILS SECTION */}
              <View style={styles.customerSection}>
                <Text style={styles.sectionTitle}>
                  2. Customer Details {paymentType === 'Credit' ? '(Kandippa Thevai *)' : '(Optional)'}
                </Text>

                {/* Quick Pick Existing Customer */}
                <Text style={styles.inputSubLabel}>Munbu vangiaya Customer-ai select pannalaam:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.customerPillsRow}>
                  <TouchableOpacity
                    style={[
                      styles.custPill,
                      selectedCustomerId === '' && styles.custPillActive
                    ]}
                    onPress={() => handleSelectCustomer('')}
                  >
                    <Text style={[styles.custPillText, selectedCustomerId === '' && styles.custPillTextActive]}>
                      Pudhu Customer (New)
                    </Text>
                  </TouchableOpacity>
                  {customers.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.custPill,
                        selectedCustomerId === c.id && styles.custPillActive
                      ]}
                      onPress={() => handleSelectCustomer(c.id)}
                    >
                      <Text style={[styles.custPillText, selectedCustomerId === c.id && styles.custPillTextActive]}>
                        {c.name} {c.balance > 0 ? `(Kadan: ₹${c.balance})` : ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Inputs */}
                <TextInput
                  style={styles.input}
                  placeholder="Customer Name (வாடிக்கையாளர் பெயர்) *"
                  value={custName}
                  onChangeText={setCustName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number (போன் நம்பர்)"
                  keyboardType="phone-pad"
                  value={custPhone}
                  onChangeText={setCustPhone}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address / Oor (முகவரி)"
                  value={custAddress}
                  onChangeText={setCustAddress}
                />
              </View>

              {/* CONFIRM BILL ACTION BUTTON */}
              <TouchableOpacity
                style={[styles.confirmBillBtn, isSubmitting && { opacity: 0.6 }]}
                disabled={isSubmitting}
                onPress={handleConfirmBill}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-done-circle" size={24} color="#ffffff" />
                <Text style={styles.confirmBillText}>
                  {isSubmitting ? 'Bill Record Seikiradhu...' : `Bill Confirm Pannu • ₹${cartSubtotal.toLocaleString('en-IN')}`}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bill Receipt Modal */}
      <ReceiptModal
        visible={isReceiptVisible}
        bill={completedBill}
        onClose={() => setIsReceiptVisible(false)}
        onNewBill={() => {
          setIsReceiptVisible(false);
          navigation.navigate('Categories');
        }}
      />
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.lg,
    paddingBottom: 110,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  pageTitle: {
    fontSize: SIZES.fontXl,
    fontWeight: '900',
    color: COLORS.text,
  },
  pageSubtitle: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: SIZES.radiusMd,
  },
  clearBtnText: {
    color: COLORS.danger,
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  emptyCartBox: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 36,
    alignItems: 'center',
    marginTop: SIZES.md,
    ...SHADOWS.small,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyCartTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptyCartSub: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
    marginBottom: 20,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
  },
  browseBtnText: {
    color: '#ffffff',
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: SIZES.md,
    paddingVertical: 8,
    borderRadius: SIZES.radiusSm,
    marginBottom: 4,
  },
  thText: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  itemsWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemCol: {
    flex: 2,
  },
  rowItemName: {
    fontSize: SIZES.fontSm,
    fontWeight: '800',
    color: COLORS.text,
  },
  rowItemSize: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  qtyControlBox: {
    width: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: SIZES.radiusSm,
    padding: 2,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyNumber: {
    width: 24,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: SIZES.fontSm,
    color: COLORS.primary,
  },
  rowTotalCol: {
    width: 75,
    alignItems: 'flex-end',
  },
  rowTotalText: {
    fontSize: SIZES.fontSm,
    fontWeight: '900',
    color: COLORS.text,
  },
  deleteBtn: {
    width: 30,
    alignItems: 'flex-end',
  },
  subtotalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: '#93c5fd',
    padding: SIZES.md,
    marginTop: SIZES.md,
    ...SHADOWS.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: SIZES.fontSm,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalBigLabel: {
    fontSize: SIZES.fontLg,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  totalBigValue: {
    fontSize: SIZES.fontXxl,
    fontWeight: '900',
    color: COLORS.primary,
  },
  paymentSection: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SIZES.md,
    marginTop: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  paymentButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  payOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    backgroundColor: '#f8fafc',
  },
  payOptionBtnActiveCash: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  payOptionBtnActiveUPI: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  payOptionBtnActiveCredit: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  payOptionText: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: COLORS.text,
  },
  payOptionTextActive: {
    color: '#ffffff',
  },
  creditAlertNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 8,
    borderRadius: SIZES.radiusSm,
    marginTop: SIZES.sm,
  },
  creditAlertText: {
    color: '#991b1b',
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    flex: 1,
  },
  settledNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    padding: 8,
    borderRadius: SIZES.radiusSm,
    marginTop: SIZES.sm,
  },
  settledNoticeText: {
    color: '#065f46',
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    flex: 1,
  },
  customerSection: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SIZES.md,
    marginTop: SIZES.md,
  },
  inputSubLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  customerPillsRow: {
    marginBottom: 12,
  },
  custPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  custPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  custPillText: {
    fontSize: SIZES.fontXs,
    color: COLORS.text,
    fontWeight: '700',
  },
  custPillTextActive: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: SIZES.fontSm,
    marginBottom: 10,
    color: COLORS.text,
  },
  confirmBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: SIZES.radiusLg,
    marginTop: SIZES.lg,
    ...SHADOWS.medium,
  },
  confirmBillText: {
    color: '#ffffff',
    fontSize: SIZES.fontMd,
    fontWeight: '900',
  },
});
