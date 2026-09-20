/**
 * Primary / Secondary / Danger button following the CareQueue design system.
 */
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
} from "react-native";
import { colors, radii, fonts } from "@/lib/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? colors.primary : colors.onPrimary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "secondary" && styles.textSecondary,
            variant === "danger" && styles.textDanger,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radii.base,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.cardBg,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.criticalBg,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: fonts.labelLg.fontFamily,
    fontSize: fonts.labelLg.fontSize,
    lineHeight: fonts.labelLg.lineHeight,
    color: colors.onPrimary,
    fontWeight: "600",
  },
  textSecondary: {
    color: colors.primary,
  },
  textDanger: {
    color: colors.critical,
  },
});
