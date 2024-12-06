import { SafeAreaView, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function ThemedSafeAreaView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <SafeAreaView style={[{ backgroundColor, height: '100%' }, style]} {...otherProps} />;
}
