import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme';

export default function AppButton({ title, onPress, color = COLORS.primary, disabled = false, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.btn, { backgroundColor: color }, disabled && styles.disabled, style]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  btn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontSize: 15, fontWeight: '700' },
};
