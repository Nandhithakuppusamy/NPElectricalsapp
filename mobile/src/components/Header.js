import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

export default function Header({ navigation }) {
  const { cartTotalItems, cartSubtotal, isBackendConnected } = useShop();

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <Ionicons name="flash" size={20} color="#fbbf24" />
        </View>
        <View>
          <Text style={styles.title}>NP Electricals</Text>
          <Text style={styles.subtitle}>மின்துறை & குழாய் பொருட்கள்</Text>
        </View>
      </View>

      <View style={styles.rightActions}>
        {/* Backend Status indicator */}
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isBackendConnected ? COLORS.success : COLORS.warning },
            ]}
          />
          <Text style={styles.statusText}>
            {isBackendConnected ? 'DB Live' : 'Offline'}
          </Text>
        </View>

        {/* Cart Quick Shortcut */}
        {cartTotalItems > 0 && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation?.navigate('Billing')}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={18} color="#ffffff" />
            <Text style={styles.cartText}>
              ₹{cartSubtotal.toLocaleString('en-IN')} ({cartTotalItems})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: SIZES.fontLg,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: SIZES.fontXs,
    color: '#94a3b8',
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
  },
  cartText: {
    fontSize: SIZES.fontXs,
    fontWeight: '900',
    color: '#ffffff',
  },
});
