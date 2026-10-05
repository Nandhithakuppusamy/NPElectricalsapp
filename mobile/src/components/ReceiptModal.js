import React from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

export default function ReceiptModal({ visible, bill, onClose, onNewBill }) {
  if (!bill) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.successIconBox}>
              <Ionicons name="checkmark-circle" size={36} color={COLORS.success} />
            </View>
            <Text style={styles.shopName}>NP ELECTRICALS</Text>
            <Text style={styles.shopSub}>மின்துறை & குழாய் பொருட்கள்</Text>
            <Text style={styles.billIdText}>Bill ID: #{bill.id}</Text>
            <Text style={styles.billDateText}>
              {new Date(bill.date || Date.now()).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Customer & Payment Mode */}
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>Customer:</Text>
              <Text style={styles.value}>{bill.customerName || 'Walk-in Customer'}</Text>
              {bill.customerPhone && bill.customerPhone !== '-' && (
                <Text style={styles.subValue}>📞 {bill.customerPhone}</Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>Payment Type:</Text>
              <View
                style={[
                  styles.paymentBadge,
                  bill.paymentType === 'Credit' ? styles.creditBadge : styles.settledBadge
                ]}
              >
                <Text
                  style={[
                    styles.paymentBadgeText,
                    bill.paymentType === 'Credit' ? styles.creditText : styles.settledText
                  ]}
                >
                  {bill.paymentType === 'Credit' ? 'கடன் (Credit)' : `${bill.paymentType} (Settled)`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Items List */}
          <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCol, { flex: 2 }]}>Item</Text>
              <Text style={[styles.tableCol, { textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.tableCol, { textAlign: 'right' }]}>Rate</Text>
              <Text style={[styles.tableCol, { textAlign: 'right' }]}>Total</Text>
            </View>

            {bill.items?.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.size && <Text style={styles.itemSize}>{item.size}</Text>}
                </View>
                <Text style={[styles.itemQty, { textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[styles.itemRate, { textAlign: 'right' }]}>₹{item.price}</Text>
                <Text style={[styles.itemTotal, { textAlign: 'right' }]}>
                  ₹{(item.total || item.price * item.qty).toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.divider} />

          {/* Total Bar */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Moththa Amount (Total):</Text>
            <Text style={styles.totalValue}>₹{(bill.amount || bill.total || 0).toLocaleString('en-IN')}</Text>
          </View>

          {bill.paymentType === 'Credit' && (
            <View style={styles.creditNotice}>
              <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
              <Text style={styles.creditNoticeText}>
                Indha thogai customer kadan kanakil serkkappattadhu.
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.newBillBtn}
              onPress={() => {
                onClose();
                onNewBill?.();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={18} color="#ffffff" />
              <Text style={styles.btnText}>Pudhu Bill Podu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.closeBtnText}>Moodu (Close)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    padding: SIZES.xl,
    ...SHADOWS.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  successIconBox: {
    marginBottom: 4,
  },
  shopName: {
    fontSize: SIZES.fontXl,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 1,
  },
  shopSub: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  billIdText: {
    fontSize: SIZES.fontSm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  billDateText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SIZES.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  value: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
    color: COLORS.text,
  },
  subValue: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    marginTop: 4,
  },
  creditBadge: {
    backgroundColor: COLORS.dangerLight,
  },
  settledBadge: {
    backgroundColor: COLORS.successLight,
  },
  paymentBadgeText: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  creditText: {
    color: COLORS.danger,
  },
  settledText: {
    color: COLORS.success,
  },
  itemsList: {
    maxHeight: 180,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableCol: {
    flex: 1,
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  itemName: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemSize: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
  },
  itemQty: {
    flex: 1,
    fontSize: SIZES.fontSm,
    fontWeight: '800',
    color: COLORS.text,
  },
  itemRate: {
    flex: 1,
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
  },
  itemTotal: {
    flex: 1,
    fontSize: SIZES.fontSm,
    fontWeight: '900',
    color: COLORS.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: SIZES.fontXxl,
    fontWeight: '900',
    color: COLORS.primary,
  },
  creditNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerLight,
    padding: 8,
    borderRadius: SIZES.radiusSm,
    marginTop: SIZES.sm,
  },
  creditNoticeText: {
    fontSize: SIZES.fontXs,
    color: COLORS.danger,
    fontWeight: '700',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SIZES.lg,
  },
  newBillBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
  },
  btnText: {
    color: '#ffffff',
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
  closeBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: SIZES.radiusMd,
  },
  closeBtnText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
});
