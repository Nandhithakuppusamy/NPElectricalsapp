import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import ResponsiveContainer from '../components/ResponsiveContainer';
import Header from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

export default function CustomersScreen({ navigation }) {
  const { customers, addNewCustomer, settleCustomerPayment, addCustomerCredit } = useShop();
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 2 : 1;

  const [search, setSearch] = useState('');

  // Modals
  const [isAddCustModalOpen, setIsAddCustModalOpen] = useState(false);
  const [settleModalCustomer, setSettleModalCustomer] = useState(null);
  const [creditModalCustomer, setCreditModalCustomer] = useState(null);
  const [historyModalCustomer, setHistoryModalCustomer] = useState(null);

  // Add Customer Form (with previous data / date field support)
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custBalance, setCustBalance] = useState('');
  const [custDate, setCustDate] = useState(new Date().toISOString().split('T')[0]);

  // Settle Payment Form
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMode, setSettleMode] = useState('Cash');
  const [settleNotes, setSettleNotes] = useState('');

  // Add Credit Form
  const [creditAmount, setCreditAmount] = useState('');
  const [creditNotes, setCreditNotes] = useState('');

  // Filter Customers
  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  // Calculate Total Kadan Owed
  const totalPendingKadan = customers.reduce(
    (sum, c) => sum + (c.balance ?? c.balanceOwed ?? 0),
    0
  );

  // Handle Add Customer Submit
  const handleAddCustomerSubmit = async () => {
    if (!custName.trim()) {
      Alert.alert('Customer Name Thevai', 'Customer Peyar kandippa podanum!');
      return;
    }
    const initialBal = parseFloat(custBalance) || 0;
    const newCust = await addNewCustomer({
      name: custName.trim(),
      phone: custPhone.trim() || '-',
      address: custAddress.trim() || '-',
      balance: initialBal
    });

    if (initialBal > 0 && newCust?.id) {
      await addCustomerCredit(
        newCust.id,
        initialBal,
        [],
        `Previous Balance (முந்தைய பாக்கி - ${custDate})`
      );
    }

    setCustName('');
    setCustPhone('');
    setCustAddress('');
    setCustBalance('');
    setCustDate(new Date().toISOString().split('T')[0]);
    setIsAddCustModalOpen(false);
  };

  // Handle Settle Submit
  const handleSettleSubmit = async () => {
    if (!settleModalCustomer) return;
    const amt = parseFloat(settleAmount);
    if (!amt || amt <= 0) {
      Alert.alert('Amount Thevai', 'Settle seiyum thogai enter seiyavum!');
      return;
    }
    await settleCustomerPayment(
      settleModalCustomer.id,
      amt,
      settleMode,
      settleNotes || `${settleMode} Settlement`
    );
    setSettleModalCustomer(null);
    setSettleAmount('');
    setSettleNotes('');
  };

  // Handle Add Credit Submit
  const handleAddCreditSubmit = async () => {
    if (!creditModalCustomer) return;
    const amt = parseFloat(creditAmount);
    if (!amt || amt <= 0) {
      Alert.alert('Amount Thevai', 'Kadan thogai enter seiyavum!');
      return;
    }
    await addCustomerCredit(
      creditModalCustomer.id,
      amt,
      [],
      creditNotes || 'Manual Credit Added'
    );
    setCreditModalCustomer(null);
    setCreditAmount('');
    setCreditNotes('');
  };

  const renderCustomerItem = ({ item }) => {
    const curBalance = item.balance ?? item.balanceOwed ?? 0;
    const isPending = curBalance > 0;

    return (
      <View style={[styles.cardWrapper, numColumns === 2 && styles.cardWrapperTwoCol]}>
        <View style={styles.card}>
          {/* Card Top: Name & Balance Badge */}
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.custName}>{item.name}</Text>
              <Text style={styles.custPhone}>📞 {item.phone || '-'}</Text>
              {item.address && item.address !== '-' ? (
                <Text style={styles.custAddress} numberOfLines={1}>
                  📍 {item.address}
                </Text>
              ) : null}
            </View>

            {/* Status & Balance Pill */}
            <View
              style={[
                styles.balanceBadge,
                isPending ? styles.balanceBadgePending : styles.balanceBadgeSettled
              ]}
            >
              <Text
                style={[
                  styles.balanceBadgeLabel,
                  isPending ? styles.textPending : styles.textSettled
                ]}
              >
                {isPending ? 'Kadan Pending' : 'Settled (Zero)'}
              </Text>
              <Text
                style={[
                  styles.balanceBadgeAmount,
                  isPending ? styles.textPending : styles.textSettled
                ]}
              >
                ₹{curBalance.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Action Buttons: ALWAYS VISIBLE AND PROMINENT */}
          <View style={styles.cardActionRow}>
            {/* Settle Payment Button */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.settleBtn]}
              onPress={() => {
                setSettleModalCustomer(item);
                setSettleAmount(curBalance > 0 ? curBalance.toString() : '');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="cash-outline" size={16} color="#065f46" />
              <Text style={styles.settleBtnText}>Settle Pannu</Text>
            </TouchableOpacity>

            {/* Add Credit Button */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.creditBtn]}
              onPress={() => {
                setCreditModalCustomer(item);
                setCreditAmount('');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={16} color="#991b1b" />
              <Text style={styles.creditBtnText}>+ Kadan Ser</Text>
            </TouchableOpacity>

            {/* View History Button */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.historyBtn]}
              onPress={() => setHistoryModalCustomer(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={styles.historyBtnText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ResponsiveContainer>
      <Header navigation={navigation} />

      {/* Top Total Summary Banner */}
      <View style={styles.summaryBanner}>
        <View>
          <Text style={styles.summaryTitle}>Customer Kadan Book (கடன் கணக்கு)</Text>
          <Text style={styles.summarySub}>
            {customers.length} வாடிக்கையாளர்கள் பதிவு செய்யப்பட்டுள்ளனர்
          </Text>
        </View>
        <View style={styles.totalKadanBox}>
          <Text style={styles.totalKadanLabel}>Moththa Kadan:</Text>
          <Text style={styles.totalKadanValue}>₹{totalPendingKadan.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Actions & Search Row */}
      <View style={styles.actionTopRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Customer name / phone thedu (Search)..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <TouchableOpacity
          style={styles.addCustomerBtn}
          onPress={() => setIsAddCustModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="person-add" size={16} color="#ffffff" />
          <Text style={styles.addCustomerText}>+ Pudhu Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={renderCustomerItem}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Customer Yedhum Illai</Text>
            <Text style={styles.emptySub}>"+ Pudhu Customer" click panni serunga.</Text>
          </View>
        }
      />

      {/* MODAL 1: ADD CUSTOMER WITH PREVIOUS DATA / DATE */}
      <Modal visible={isAddCustModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pudhu Customer Serka</Text>
              <TouchableOpacity onPress={() => setIsAddCustModalOpen(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Customer Name (பெயர்) *"
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

            <View style={styles.manualEntryBox}>
              <Text style={styles.manualEntryTitle}>
                Munbu Vaangiya Kadan (Previous Balance - Optional)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Munbu Baaki Thogai (₹) - e.g. 1500"
                keyboardType="numeric"
                value={custBalance}
                onChangeText={setCustBalance}
              />
              <TextInput
                style={styles.input}
                placeholder="Purchase Date (YYYY-MM-DD)"
                value={custDate}
                onChangeText={setCustDate}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsAddCustModalOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddCustomerSubmit}>
                <Text style={styles.saveText}>Customer Save Pannu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: SETTLE PAYMENT MODAL */}
      <Modal visible={Boolean(settleModalCustomer)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kadan Settle Seiya (Payment)</Text>
              <TouchableOpacity onPress={() => setSettleModalCustomer(null)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.settleInfoCard}>
              <Text style={styles.settleCustName}>{settleModalCustomer?.name}</Text>
              <Text style={styles.settleCustBalance}>
                Ippodhaiya Kadan Baaki: ₹{(settleModalCustomer?.balance ?? settleModalCustomer?.balanceOwed ?? 0).toLocaleString('en-IN')}
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Settle Seiyum Thogai (₹) *"
              keyboardType="numeric"
              value={settleAmount}
              onChangeText={setSettleAmount}
            />

            {/* Cash vs UPI options */}
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  settleMode === 'Cash' && styles.modeBtnActive
                ]}
                onPress={() => setSettleMode('Cash')}
              >
                <Ionicons
                  name="cash-outline"
                  size={16}
                  color={settleMode === 'Cash' ? '#ffffff' : COLORS.text}
                />
                <Text style={[styles.modeText, settleMode === 'Cash' && styles.modeTextActive]}>
                  Cash (ரொக்கம்)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  settleMode === 'UPI' && styles.modeBtnActive
                ]}
                onPress={() => setSettleMode('UPI')}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={16}
                  color={settleMode === 'UPI' ? '#ffffff' : COLORS.text}
                />
                <Text style={[styles.modeText, settleMode === 'UPI' && styles.modeTextActive]}>
                  UPI (GPay / PhonePe)
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Kurinppu / Notes (e.g. GPay settled, direct cash)"
              value={settleNotes}
              onChangeText={setSettleNotes}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setSettleModalCustomer(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settleConfirmBtn} onPress={handleSettleSubmit}>
                <Text style={styles.saveText}>Payment Confirm Seiyavum</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: ADD CREDIT MODAL */}
      <Modal visible={Boolean(creditModalCustomer)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kadan Serka (Add Credit)</Text>
              <TouchableOpacity onPress={() => setCreditModalCustomer(null)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: SIZES.fontSm, color: COLORS.textSecondary, marginBottom: 12 }}>
              Customer: <Text style={{ fontWeight: '800', color: COLORS.text }}>{creditModalCustomer?.name}</Text>
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Pudhu Kadan Thogai (₹) *"
              keyboardType="numeric"
              value={creditAmount}
              onChangeText={setCreditAmount}
            />

            <TextInput
              style={styles.input}
              placeholder="Porutkal / Kurinppu (Notes)"
              value={creditNotes}
              onChangeText={setCreditNotes}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCreditModalCustomer(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dangerBtn} onPress={handleAddCreditSubmit}>
                <Text style={styles.saveText}>Kadan Serka (Save)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: HISTORY MODAL */}
      <Modal visible={Boolean(historyModalCustomer)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{historyModalCustomer?.name}</Text>
                <Text style={styles.historySubText}>
                  Kadan & Settle Seidha Varalaaru (History)
                </Text>
              </View>
              <TouchableOpacity onPress={() => setHistoryModalCustomer(null)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Current Balance card */}
              <View style={styles.historyBalanceCard}>
                <Text style={styles.historyBalanceLabel}>Current Balance Owed:</Text>
                <Text style={styles.historyBalanceValue}>
                  ₹{(historyModalCustomer?.balance ?? historyModalCustomer?.balanceOwed ?? 0).toLocaleString('en-IN')}
                </Text>
              </View>

              {/* Settled History */}
              <Text style={styles.historySectionHeader}>
                ✅ Panam Settled Seidha Varalaaru ({historyModalCustomer?.settledHistory?.length || 0})
              </Text>
              {historyModalCustomer?.settledHistory && historyModalCustomer.settledHistory.length > 0 ? (
                historyModalCustomer.settledHistory.map((s, idx) => (
                  <View key={idx} style={styles.historyRowSuccess}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyItemDate}>
                        {new Date(s.date).toLocaleDateString('en-IN')} • {s.paymentMode || 'Cash'}
                      </Text>
                      {s.notes ? <Text style={styles.historyItemNotes}>{s.notes}</Text> : null}
                    </View>
                    <Text style={styles.historyItemAmountSuccess}>
                      -₹{s.amount?.toLocaleString('en-IN')}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noHistoryText}>Settled history yedhum illai</Text>
              )}

              {/* Credit Purchase History */}
              <Text style={[styles.historySectionHeader, { marginTop: 16 }]}>
                📝 Kadan Vaangiya Varalaaru ({historyModalCustomer?.purchaseHistory?.length || 0})
              </Text>
              {historyModalCustomer?.purchaseHistory && historyModalCustomer.purchaseHistory.length > 0 ? (
                historyModalCustomer.purchaseHistory.map((p, idx) => (
                  <View key={idx} style={styles.historyRowDanger}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyItemDate}>
                        {new Date(p.date).toLocaleDateString('en-IN')} • {p.paymentType}
                      </Text>
                      {p.notes ? <Text style={styles.historyItemNotes}>{p.notes}</Text> : null}
                      {p.items?.map((it, iIdx) => (
                        <Text key={iIdx} style={styles.historyItemSub}>
                          • {it.name} ({it.qty} {it.unit || 'pcs'} @ ₹{it.price})
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.historyItemAmountDanger}>
                      +₹{p.amount?.toLocaleString('en-IN')}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noHistoryText}>Credit purchases yedhum illai</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.cancelBtn, { marginTop: 16 }]}
              onPress={() => setHistoryModalCustomer(null)}
            >
              <Text style={styles.cancelText}>Moodu (Close)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  summaryBanner: {
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.md,
    padding: SIZES.lg,
    borderRadius: SIZES.radiusLg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: SIZES.fontLg,
    fontWeight: '900',
  },
  summarySub: {
    color: '#94a3b8',
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  totalKadanBox: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  totalKadanLabel: {
    color: '#fca5a5',
    fontSize: 10,
    fontWeight: '800',
  },
  totalKadanValue: {
    color: '#f87171',
    fontSize: SIZES.fontXl,
    fontWeight: '900',
  },
  actionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: SIZES.lg,
    marginTop: SIZES.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.fontSm,
    color: COLORS.text,
  },
  addCustomerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
  },
  addCustomerText: {
    color: '#ffffff',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  listContent: {
    padding: SIZES.md,
    paddingBottom: 110,
  },
  cardWrapper: {
    flex: 1,
    padding: SIZES.xs,
  },
  cardWrapperTwoCol: {
    maxWidth: '50%',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    padding: SIZES.md,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.md,
  },
  custName: {
    fontSize: SIZES.fontMd,
    fontWeight: '900',
    color: COLORS.text,
  },
  custPhone: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  custAddress: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  balanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusMd,
    alignItems: 'flex-end',
    borderWidth: 1,
  },
  balanceBadgePending: {
    backgroundColor: COLORS.dangerLight,
    borderColor: '#fca5a5',
  },
  balanceBadgeSettled: {
    backgroundColor: COLORS.successLight,
    borderColor: '#6ee7b7',
  },
  balanceBadgeLabel: {
    fontSize: 9,
    fontWeight: '800',
  },
  balanceBadgeAmount: {
    fontSize: SIZES.fontMd,
    fontWeight: '900',
  },
  textPending: {
    color: COLORS.danger,
  },
  textSettled: {
    color: COLORS.success,
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: SIZES.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
  },
  settleBtn: {
    backgroundColor: COLORS.successLight,
    borderColor: '#a7f3d0',
  },
  settleBtnText: {
    color: '#065f46',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  creditBtn: {
    backgroundColor: COLORS.dangerLight,
    borderColor: '#fecaca',
  },
  creditBtnText: {
    color: '#991b1b',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  historyBtn: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  historyBtnText: {
    color: COLORS.primary,
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  emptyBox: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 10,
  },
  emptySub: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xl,
    width: '100%',
    maxWidth: 480,
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  modalTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '900',
    color: COLORS.text,
  },
  historySubText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
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
  manualEntryBox: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: SIZES.radiusMd,
    padding: 10,
    marginBottom: 10,
  },
  manualEntryTitle: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SIZES.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
    backgroundColor: '#f1f5f9',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primary,
  },
  settleConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.success,
  },
  dangerBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.danger,
  },
  saveText: {
    color: '#ffffff',
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
  settleInfoCard: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: SIZES.radiusMd,
    marginBottom: 12,
  },
  settleCustName: {
    fontSize: SIZES.fontMd,
    fontWeight: '900',
    color: COLORS.text,
  },
  settleCustBalance: {
    fontSize: SIZES.fontSm,
    fontWeight: '800',
    color: COLORS.danger,
    marginTop: 2,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: '#f8fafc',
  },
  modeBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeText: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: COLORS.text,
  },
  modeTextActive: {
    color: '#ffffff',
  },
  historyBalanceCard: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    padding: 12,
    borderRadius: SIZES.radiusMd,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyBalanceLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: '800',
    color: '#9f1239',
  },
  historyBalanceValue: {
    fontSize: SIZES.fontLg,
    fontWeight: '900',
    color: '#e11d48',
  },
  historySectionHeader: {
    fontSize: SIZES.fontSm,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 6,
  },
  historyRowSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 10,
    borderRadius: SIZES.radiusSm,
    marginBottom: 6,
  },
  historyRowDanger: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: SIZES.radiusSm,
    marginBottom: 6,
  },
  historyItemDate: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: COLORS.text,
  },
  historyItemNotes: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  historyItemSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  historyItemAmountSuccess: {
    fontSize: SIZES.fontSm,
    fontWeight: '900',
    color: '#059669',
  },
  historyItemAmountDanger: {
    fontSize: SIZES.fontSm,
    fontWeight: '900',
    color: '#dc2626',
  },
  noHistoryText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
});
