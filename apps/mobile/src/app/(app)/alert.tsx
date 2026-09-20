/**
 * Your Turn Called Alert — full screen overlay displayed when the staff calls the patient.
 */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Vibration } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import { getVisitStatus } from "@/lib/api";
import { colors, fonts, radii, shadows, spacing } from "@/lib/theme";
import type { VisitStatusResponse } from "@/lib/types";

export default function AlertScreen() {
  const { visitId } = useLocalSearchParams<{ visitId: string }>();
  const [data, setData] = useState<VisitStatusResponse | null>(null);

  // Pulse animation for the border
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Vibrate to alert the patient that they are called
    try {
      Vibration.vibrate([0, 500, 200, 500]);
    } catch {
      // Ignore vibration error on unsupported platforms
    }

    if (visitId) {
      getVisitStatus(visitId).then(setData).catch(console.error);
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [pulseAnim, visitId]);

  const borderColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(5, 150, 105, 0.2)", "rgba(5, 150, 105, 1)"], // colors.success
  });

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View
        style={[styles.container, { borderColor, borderWidth: 8 }]}
      >
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={64} color={colors.onPrimary} />
          </View>

          <Text style={styles.title}>Your Turn!</Text>
          <Text style={styles.subtitle}>
            Please proceed to the consultation room immediately.
          </Text>

          <View style={styles.card}>
            {data?.queueNumber && (
              <Text style={styles.ticketNumber}>
                Ticket #{String(data.queueNumber).padStart(3, "0")}
              </Text>
            )}
            <Text style={styles.roomLabel}>Room</Text>
            <Text style={styles.roomNumber}>04</Text>
            <Text style={styles.deptName}>
              {data?.department.name || "General Medicine"}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="I'm On My Way"
            onPress={() => {
              // Return to the queue pass, which will now show "Called" status
              router.replace({
                pathname: "/(app)/queue-pass",
                params: { visitId },
              });
            }}
            style={styles.button}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.successBg,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
    ...shadows.cardElevated,
  },
  title: {
    fontFamily: fonts.headlineLg.fontFamily,
    fontSize: fonts.headlineLg.fontSize,
    color: colors.successText,
    fontWeight: "800",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.bodyLg.fontFamily,
    fontSize: fonts.bodyLg.fontSize,
    color: colors.successText,
    textAlign: "center",
    marginBottom: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.cardBg,
    padding: spacing.xl,
    borderRadius: radii.lg,
    width: "100%",
    alignItems: "center",
    ...shadows.card,
  },
  ticketNumber: {
    fontFamily: fonts.headlineMd.fontFamily,
    fontSize: fonts.headlineMd.fontSize,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  roomLabel: {
    fontFamily: fonts.labelLg.fontFamily,
    fontSize: fonts.labelLg.fontSize,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  roomNumber: {
    fontFamily: fonts.displayTicket.fontFamily,
    fontSize: fonts.displayTicket.fontSize,
    color: colors.successText,
    marginBottom: spacing.sm,
  },
  deptName: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    color: colors.textSecondary,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  button: {
    backgroundColor: colors.successText,
  },
});
