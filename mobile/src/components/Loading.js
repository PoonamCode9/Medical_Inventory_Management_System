import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../theme';

export default function Loading({ color = COLORS.primary }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}
