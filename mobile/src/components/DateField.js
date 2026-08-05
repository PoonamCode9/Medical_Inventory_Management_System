import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../theme';
import { formatDate } from '../constants';

// A text-looking field that opens the native date picker when tapped.
// Props: label, value (Date | null), onChange (Date)
export default function DateField({ label, value, onChange, mode = 'date' }) {
  const [show, setShow] = useState(false);

  const open = () => setShow(true);

  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity style={styles.field} onPress={open} activeOpacity={0.7}>
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value ? formatDate(value) : 'Select date...'}
        </Text>
        <Text style={styles.chevron}>📅</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selected) => {
            setShow(Platform.OS === 'ios');
            if (selected) onChange(selected);
          }}
        />
      )}
    </View>
  );
}

const styles = {
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  value: { fontSize: 15, color: COLORS.text },
  placeholder: { color: COLORS.faint },
  chevron: { fontSize: 14, color: COLORS.faint },
};
