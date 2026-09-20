/**
 * Home Screen / Check-in & Department Select
 * - Scan QR Code option
 * - Department list to manually select
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "@/lib/auth";
import { listDepartments, checkIn, getActiveVisit } from "@/lib/api";
import { DepartmentPicker } from "@/components/DepartmentPicker";
import { Button } from "@/components/Button";
import { colors, fonts, radii, shadows, spacing } from "@/lib/theme";
import type { Department, Visit } from "@/lib/types";

export default function HomeScreen() {
  const { patientName, patientId, logout } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      async function fetchData() {
        try {
          const [depts, visit] = await Promise.all([
            listDepartments(),
            getActiveVisit(),
          ]);

          if (!active) return;
          setDepartments(depts);

          if (
            visit &&
            (visit.status === "waiting" || visit.status === "called")
          ) {
            setActiveVisit(visit);
            if (visit.status === "called") {
              router.push({
                pathname: "/(app)/alert",
                params: { visitId: visit.id },
              });
            }
          } else {
            setActiveVisit(null);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (active) setLoadingDepts(false);
        }
      }

      fetchData();
      return () => {
        active = false;
      };
    }, []),
  );

  const handleCheckIn = async (deptId: string, source: "app" | "qr") => {
    if (!patientId) return;
    setCheckingIn(true);
    try {
      const visit = await checkIn({
        patientId,
        departmentId: deptId,
        source,
      });
      router.push({
        pathname: "/(app)/queue-pass",
        params: { visitId: visit.id },
      });
    } catch (err: any) {
      Alert.alert("Check-in Failed", err?.message ?? "An error occurred.");
    } finally {
      setCheckingIn(false);
      setShowScanner(false);
    }
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    // Basic QR data validation (assuming format like: "carequeue:dept:ckz1...")
    if (data.startsWith("carequeue:dept:")) {
      const deptId = data.split(":")[2];
      const dept = departments.find((d) => d.id === deptId);
      if (dept) {
        handleCheckIn(deptId, "qr");
      } else {
        Alert.alert("Invalid QR", "Department not found.");
        setShowScanner(false);
      }
    } else {
      Alert.alert("Invalid QR", "Unrecognized QR format.");
      setShowScanner(false);
    }
  };

  const startScanner = async () => {
    if (!permission?.granted) {
      const p = await requestPermission();
      if (!p.granted) return;
    }
    setShowScanner(true);
  };

  if (showScanner) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={checkingIn ? undefined : handleBarcodeScanned}
        />
        <SafeAreaView style={styles.scannerOverlay}>
          <Text style={styles.scannerText}>Scan Hospital QR Code</Text>
          <Button
            title="Cancel"
            onPress={() => setShowScanner(false)}
            variant="secondary"
            style={styles.scannerCancel}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{patientName || "Guest"}</Text>
          </View>
          <Ionicons
            name="log-out-outline"
            size={28}
            color={colors.textSecondary}
            onPress={logout}
          />
        </View>

        {activeVisit && (
          <TouchableOpacity
            style={styles.activePassCard}
            onPress={() =>
              router.push({
                pathname: "/(app)/queue-pass",
                params: { visitId: activeVisit.id },
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.activePassHeader}>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ACTIVE QUEUE PASS</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.activePassDept}>
              {departments.find((d) => d.id === activeVisit.departmentId)
                ?.name ?? "Hospital Department"}
            </Text>
            <View style={styles.activePassRow}>
              <Text style={styles.activePassTicket}>
                Ticket #{String(activeVisit.queueNumber).padStart(3, "0")}
              </Text>
              <Text style={styles.activePassCta}>Tap to open live pass →</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.scanCard}>
          <View style={styles.scanIconBg}>
            <Ionicons name="qr-code-outline" size={32} color={colors.primary} />
          </View>
          <View style={styles.scanTextContainer}>
            <Text style={styles.scanTitle}>At the hospital?</Text>
            <Text style={styles.scanDesc}>
              Scan a QR code at the department desk to check in instantly.
            </Text>
          </View>
          <Button
            title="Scan QR"
            onPress={startScanner}
            style={styles.scanButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check In Manually</Text>
          <Text style={styles.sectionDesc}>
            Select a department below to join the virtual queue.
          </Text>
          <DepartmentPicker
            departments={departments}
            loading={loadingDepts}
            onSelect={(dept) => handleCheckIn(dept.id, "app")}
          />
        </View>
      </ScrollView>

      {checkingIn && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
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
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  greeting: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    color: colors.textSecondary,
  },
  name: {
    fontFamily: fonts.headlineLgMobile.fontFamily,
    fontSize: fonts.headlineLgMobile.fontSize,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  activePassCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadows.cardElevated,
  },
  activePassHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  activeBadge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  activeBadgeText: {
    fontFamily: fonts.labelSm.fontFamily,
    fontSize: 10,
    color: colors.onPrimaryContainer,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  activePassDept: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  activePassRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activePassTicket: {
    fontFamily: fonts.headlineMd.fontFamily,
    fontSize: fonts.headlineMd.fontSize,
    color: colors.primary,
    fontWeight: "800",
  },
  activePassCta: {
    fontFamily: fonts.bodySm.fontFamily,
    fontSize: fonts.bodySm.fontSize,
    color: colors.primary,
    fontWeight: "600",
  },
  scanCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    alignItems: "center",
    ...shadows.card,
  },
  scanIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  scanTextContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  scanTitle: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 4,
  },
  scanDesc: {
    fontFamily: fonts.bodySm.fontFamily,
    fontSize: fonts.bodySm.fontSize,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.md,
  },
  scanButton: {
    width: "100%",
  },
  section: {},
  sectionTitle: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionDesc: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  scannerText: {
    fontFamily: fonts.headlineSm.fontFamily,
    fontSize: fonts.headlineSm.fontSize,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    borderRadius: radii.base,
    overflow: "hidden",
  },
  scannerCancel: {
    backgroundColor: "#fff",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
});
