/**
 * CareQueue logo component — SVG rendered inline.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/lib/theme";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 18 },
    md: { icon: 48, text: 24 },
    lg: { icon: 64, text: 32 },
  };

  const s = sizes[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.icon,
          { width: s.icon, height: s.icon, borderRadius: s.icon * 0.25 },
        ]}
      >
        <Text style={[styles.iconText, { fontSize: s.icon * 0.45 }]}>CQ</Text>
      </View>
      <Text style={[styles.text, { fontSize: s.text }]}>CareQueue</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: colors.onPrimary,
    fontWeight: "800",
  },
  text: {
    fontFamily: fonts.headlineLg.fontFamily,
    fontWeight: "700",
    color: colors.primary,
  },
});
