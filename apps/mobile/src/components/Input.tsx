/**
 * Styled text input following the CareQueue design system.
 */
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { colors, radii, fonts, spacing } from "@/lib/theme";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.labelMd.fontFamily,
    fontSize: fonts.labelMd.fontSize,
    lineHeight: fonts.labelMd.lineHeight,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radii.base,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cardBg,
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontFamily: fonts.bodySm.fontFamily,
    fontSize: fonts.bodySm.fontSize,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
