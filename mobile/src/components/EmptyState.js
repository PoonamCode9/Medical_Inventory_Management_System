import React from 'react';
import { Text, View } from 'react-native';
import { COLORS } from '../theme';

export default function EmptyState({ title, subtitle }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = {
  box: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  subtitle: { marginTop: 4, fontSize: 12, color: COLORS.faint, textAlign: 'center' },
};
