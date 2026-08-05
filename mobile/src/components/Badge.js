import React from 'react';
import { Text, View } from 'react-native';

export default function Badge({ text, color = '#64748b', bg = '#f1f5f9', border = '#e2e8f0' }) {
  return (
    <View style={styles.pill(bg, border)}>
      <Text style={styles.text(color)}>{text}</Text>
    </View>
  );
}

const styles = {
  pill: (bg, border) => ({
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  }),
  text: (color) => ({ fontSize: 11, fontWeight: '700', color }),
};
