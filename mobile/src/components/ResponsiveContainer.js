import React from 'react';
import { View, StyleSheet, useWindowDimensions, SafeAreaView } from 'react-native';
import { COLORS } from '../styles/theme';

export default function ResponsiveContainer({ children, style, contentStyle }) {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View
        style={[
          styles.container,
          isLarge && styles.largeContainer,
          contentStyle,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  largeContainer: {
    maxWidth: 1024,
    alignSelf: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.background,
  },
});
