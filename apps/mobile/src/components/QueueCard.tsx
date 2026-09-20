/**
 * Hero queue card — shows the patient's queue number, position, and estimated wait.
 * Left accent border changes color by status (teal=waiting, amber=approaching, emerald=called).
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radii, shadows, spacing } from "@/lib/theme";
import { StatusBadge } from "./StatusPill";
import type { VisitStatusResponse } from "@/lib/types";

interface QueueCardProps {
  data: VisitStatusResponse;
}

function getAccentColor(status: string, position: number | null): string {
  if (status === "called") return colors.success;
  if (status === "waiting" && position !== null && position <= 2)
    return colors.warning;
  return colors.primary;
}

export function QueueCard({ data }: QueueCardProps) {
  const accent = getAccentColor(data.status, data.position);

  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      <View style={styles.header}>
        <Text style={styles.department}>{data.department.name}</Text>
        <StatusBadge status={data.status} />
      </View>

      <Text style={styles.queueNumber}>
        {String(data.queueNumber).padStart(3, "0")}
      </Text>

      <View style={styles.meta}>
        {data.position !== null && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Position</Text>
            <Text style={styles.metaValue}>#{data.position}</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Est. Wait</Text>
          <Text style={styles.metaValue}>
            {data.estimatedWaitMinutes > 0
              ? `~${data.estimatedWaitMinutes} min`
              : "Now"}
          </Text>
        </View>
      </View>

      <View style={styles.patientRow}>
        <Text style={styles.patientName}>{data.patient.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.lg,
    borderLeftWidth: 4,
    padding: spacing.lg,
    ...shadows.cardElevated,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  department: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    lineHeight: fonts.headlineSm.lineHeight,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  queueNumber: {
    fontFamily: fonts.displayTicketMobile.fontFamily,
    fontSize: fonts.displayTicketMobile.fontSize,
    lineHeight: fonts.displayTicketMobile.lineHeight,
    letterSpacing: fonts.displayTicketMobile.letterSpacing,
    color: colors.textPrimary,
    textAlign: "center",
    marginVertical: spacing.md,
    fontWeight: "800",
  },
  meta: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
    marginBottom: spacing.md,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    fontFamily: fonts.labelSm.fontFamily,
    fontSize: fonts.labelSm.fontSize,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
    fontWeight: "600",
  },
  metaValue: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  patientRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    alignItems: "center",
  },
  patientName: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    color: colors.textSecondary,
  },
});
