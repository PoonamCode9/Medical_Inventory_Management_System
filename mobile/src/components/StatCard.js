import React from 'react';
import { Text, View } from 'react-native';
import { COLORS } from '../theme';

export default function StatCard({ title, value, accent = COLORS.primary }) {
  return (
    <View style={styles.card}>
      <View style={[styles.bar, { backgroundColor: accent }]} />
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    width: '48%',
    marginBottom: 12,
    overflow: 'hidden',
  },
  bar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: { fontSize: 26, fontWeight: '900', color: COLORS.text, marginTop: 6 },
};
