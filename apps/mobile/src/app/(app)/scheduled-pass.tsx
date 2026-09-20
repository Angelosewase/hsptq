/**
 * Scheduled Visit Pass — displays the appointment details and a QR code for check-in.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import { getVisitStatus } from "@/lib/api";
import { colors, fonts, radii, shadows, spacing } from "@/lib/theme";
import type { VisitStatusResponse } from "@/lib/types";

export default function ScheduledPassScreen() {
  const { visitId, date, time } = useLocalSearchParams<{
    visitId: string;
    date: string;
    time: string;
  }>();
  const [data, setData] = useState<VisitStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visitId) return;

    getVisitStatus(visitId)
      .then(setData)
      .catch((err) => Alert.alert("Error", err.message))
      .finally(() => setLoading(false));
  }, [visitId]);

  if (loading || !data) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.tertiary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(app)")}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Pass</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.department}>{data.department.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Confirmed</Text>
            </View>
          </View>

          <View style={styles.datetimeRow}>
            <View style={styles.datetimeItem}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.tertiary}
              />
              <Text style={styles.datetimeText}>{date}</Text>
            </View>
            <View style={styles.datetimeItem}>
              <Ionicons name="time-outline" size={20} color={colors.tertiary} />
              <Text style={styles.datetimeText}>{time}</Text>
            </View>
          </View>

          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code" size={100} color={colors.textPrimary} />
            <Text style={styles.qrDesc}>
              Scan this at the kiosk when you arrive
            </Text>
          </View>

          <View style={styles.patientRow}>
            <Text style={styles.patientName}>{data.patient.name}</Text>
          </View>
        </View>

        <Button
          title="Cancel Booking"
          variant="secondary"
          onPress={() => {
            Alert.alert(
              "Cancel Booking?",
              "Are you sure you want to cancel this appointment?",
              [
                { text: "No", style: "cancel" },
                {
                  text: "Yes, Cancel",
                  style: "destructive",
                  onPress: () => router.replace("/(app)"),
                },
              ],
            );
          }}
          style={styles.cancelButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.margin,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.headlineMd.fontFamily,
    fontSize: fonts.headlineMd.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.lg,
    borderTopWidth: 6,
    borderTopColor: colors.tertiary,
    padding: spacing.lg,
    ...shadows.cardElevated,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  department: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: colors.appointmentBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  badgeText: {
    fontFamily: fonts.labelMd.fontFamily,
    fontSize: fonts.labelMd.fontSize,
    color: colors.appointmentText,
    fontWeight: "600",
  },
  datetimeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.xl,
  },
  datetimeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  datetimeText: {
    fontFamily: fonts.labelLg.fontFamily,
    fontSize: fonts.labelLg.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  qrPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  qrDesc: {
    fontFamily: fonts.bodySm.fontFamily,
    fontSize: fonts.bodySm.fontSize,
    color: colors.textMuted,
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
  cancelButton: {
    marginTop: spacing.xl,
    borderColor: colors.error,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBg,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    color: colors.textPrimary,
    fontWeight: "700",
  },
});
