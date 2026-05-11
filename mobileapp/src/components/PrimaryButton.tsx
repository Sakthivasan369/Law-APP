import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
  variant = 'primary',
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.textDisabled;
    if (variant === 'secondary') return COLORS.secondary;
    if (variant === 'outline') return 'transparent';
    return COLORS.primary;
  };

  const getTextColor = () => {
    if (variant === 'outline') return COLORS.primary;
    return COLORS.white;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return COLORS.primary;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrimaryButton;
