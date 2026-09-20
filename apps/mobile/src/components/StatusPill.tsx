/**
 * Status step tracker: Checked-In → Waiting → Called → In Consultation
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, spacing } from "@/lib/theme";
import type { VisitStatus } from "@/lib/types";

interface StatusPillProps {
  status: VisitStatus;
}

const steps = [
  { key: "waiting", label: "Checked In" },
  { key: "waiting", label: "Waiting" },
  { key: "called", label: "Called" },
  { key: "served", label: "Consulted" },
] as const;

function getStepIndex(status: VisitStatus): number {
  switch (status) {
    case "waiting":
      return 1;
    case "called":
      return 2;
    case "served":
      return 3;
    case "no_show":
      return -1;
    default:
      return 0;
  }
}

export function StatusPill({ status }: StatusPillProps) {
  const activeIndex = getStepIndex(status);

  return (
    <View style={styles.container}>
      {steps.map((step, i) => (
        <View key={i} style={styles.stepWrapper}>
          {i > 0 && (
            <View
              style={[
                styles.connector,
                i <= activeIndex && styles.connectorActive,
              ]}
            />
          )}
          <View
            style={[
              styles.dot,
              i <= activeIndex && styles.dotActive,
              i === activeIndex && styles.dotCurrent,
            ]}
          />
          <Text style={[styles.label, i <= activeIndex && styles.labelActive]}>
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function StatusBadge({ status }: StatusPillProps) {
  const config = {
    waiting: {
      bg: colors.warningBg,
      text: colors.warningText,
      label: "Waiting",
    },
    called: { bg: colors.successBg, text: colors.successText, label: "Called" },
    served: { bg: colors.successBg, text: colors.successText, label: "Served" },
    no_show: { bg: colors.criticalBg, text: colors.critical, label: "No Show" },
  };

  const c = config[status];

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
  },
  stepWrapper: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  connector: {
    position: "absolute",
    top: 6,
    right: "50%",
    left: "-50%",
    height: 2,
    backgroundColor: colors.border,
    zIndex: 0,
  },
  connectorActive: {
    backgroundColor: colors.primary,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
    zIndex: 1,
    marginBottom: spacing.xs,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  dotCurrent: {
    borderWidth: 3,
    borderColor: colors.primaryContainer,
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: fonts.labelSm.fontFamily,
    fontSize: fonts.labelSm.fontSize,
    lineHeight: fonts.labelSm.lineHeight,
    color: colors.textMuted,
    textAlign: "center",
    fontWeight: "600",
  },
  labelActive: {
    color: colors.primary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontFamily: fonts.labelMd.fontFamily,
    fontSize: fonts.labelMd.fontSize,
    fontWeight: "600",
  },
});
