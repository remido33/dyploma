import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle';
};

export default function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { fontFamily: 'Montserrat_Medium', color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 14,
        letterSpacing: .32,
    },
    title: {
        fontSize: 20,
        letterSpacing: .32,
    },
    subtitle: {
        fontSize: 16,
        letterSpacing: .32,
    },
});
