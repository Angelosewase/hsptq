/**
 * Live Queue Pass — displays the QueueCard and polls for status updates.
 */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { QueueCard } from "@/components/QueueCard";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/Button";
import { getVisitStatus } from "@/lib/api";
import { colors, fonts, spacing, radii } from "@/lib/theme";
import type { VisitStatusResponse } from "@/lib/types";

export default function QueuePassScreen() {
  const { visitId } = useLocalSearchParams<{ visitId: string }>();
  const [data, setData] = useState<VisitStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(
    async (showIndicator = false) => {
      if (!visitId) return;
      if (showIndicator) setRefreshing(true);
      try {
        const res = await getVisitStatus(visitId);
        setData(res);

        // If called, navigate to alert
        if (res.status === "called") {
          router.replace({ pathname: "/(app)/alert", params: { visitId } });
        }
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [visitId],
  );

  useEffect(() => {
    fetchStatus();

    // Poll every 15 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleLeaveQueue = () => {
    Alert.alert(
      "Leave Queue?",
      "Are you sure you want to leave your spot in the queue? You will lose your ticket number.",
      [
        { text: "Stay in Queue", style: "cancel" },
        {
          text: "Leave Queue",
          style: "destructive",
          onPress: () => {
            router.replace("/(app)");
          },
        },
      ],
    );
  };

  if (loading && !data) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Could not load queue pass.</Text>
        <Button title="Go Back" onPress={() => router.replace("/(app)")} />
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
        <Text style={styles.headerTitle}>Live Queue Pass</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchStatus(true)}
          accessibilityRole="button"
          accessibilityLabel="Refresh"
        >
          <Ionicons name="refresh" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchStatus(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.cardWrapper}>
          <QueueCard data={data} />
        </View>

        <View style={styles.trackerWrapper}>
          <Text style={styles.trackerTitle}>Queue Progress</Text>
          <StatusPill status={data.status} />
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            • Please wait in the main seating area.{"\n"}• We will notify you
            with audio & screen alert when called.{"\n"}• Pull down at any time
            to refresh your live position.
          </Text>
        </View>

        <Button
          title="Leave Queue"
          variant="secondary"
          onPress={handleLeaveQueue}
          style={styles.leaveButton}
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
    gap: spacing.md,
  },
  errorText: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.headlineMd.fontFamily,
    fontSize: fonts.headlineMd.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  cardWrapper: {
    marginBottom: spacing.xl,
  },
  trackerWrapper: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  trackerTitle: {
    fontFamily: fonts.labelLg.fontFamily,
    fontSize: fonts.labelLg.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.lg,
  },
  instructions: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  instructionsTitle: {
    fontFamily: fonts.labelLg.fontFamily,
    fontSize: fonts.labelLg.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  instructionsText: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    lineHeight: fonts.bodyMd.lineHeight,
    color: colors.textSecondary,
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
  refreshButton: {
    padding: spacing.xs,
  },
  leaveButton: {
    marginTop: spacing.xl,
    borderColor: colors.error,
  },
});
