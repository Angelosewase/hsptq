/**
 * Advance Slot Booking screen.
 * Allows users to book an appointment for a future date/time.
 * For MVP, this creates a Visit right now but can be expanded later.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { listDepartments, checkIn } from "@/lib/api";
import { DepartmentPicker } from "@/components/DepartmentPicker";
import { Button } from "@/components/Button";
import { colors, fonts, radii, shadows, spacing } from "@/lib/theme";
import type { Department } from "@/lib/types";

// Mock dates for MVP
const DATES = ["Today", "Tomorrow", "Wed, Sep 23", "Thu, Sep 24"];
const SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"];

export default function BookSlotScreen() {
  const { patientId } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>("Today");
  const [selectedSlot, setSelectedSlot] = useState<string>();
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    let active = true;
    listDepartments()
      .then((depts) => {
        if (active) setDepartments(depts);
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoadingDepts(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleBook = async () => {
    if (!selectedDeptId || !selectedSlot || !patientId) return;

    setBooking(true);
    try {
      // For MVP, just create a visit right away (as if they checked in)
      // In a real implementation, this would call a booking endpoint
      const visit = await checkIn({
        patientId,
        departmentId: selectedDeptId,
        source: "app",
      });

      // Pass the selected time/date for display in the pass
      router.push({
        pathname: "/(app)/scheduled-pass",
        params: {
          visitId: visit.id,
          date: selectedDate,
          time: selectedSlot,
        },
      });
    } catch (err: any) {
      Alert.alert("Booking Failed", err?.message ?? "An error occurred.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Book Appointment</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Department</Text>
          <DepartmentPicker
            departments={departments}
            loading={loadingDepts}
            selectedId={selectedDeptId}
            onSelect={(dept) => setSelectedDeptId(dept.id)}
          />
        </View>

        {selectedDeptId && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Date</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}
              >
                {DATES.map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[
                      styles.pill,
                      selectedDate === date && styles.pillSelected,
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        selectedDate === date && styles.pillTextSelected,
                      ]}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Time Slot</Text>
              <View style={styles.grid}>
                {SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotCard,
                      selectedSlot === slot && styles.slotCardSelected,
                    ]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        selectedSlot === slot && styles.slotTextSelected,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Confirm Booking"
              onPress={handleBook}
              disabled={!selectedSlot}
              loading={booking}
              style={styles.bookButton}
            />
          </>
        )}
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
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontFamily: fonts.headlineMd.fontFamily,
    fontSize: fonts.headlineMd.fontSize,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.labelLg.fontFamily,
    fontSize: fonts.labelLg.fontSize,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  hScroll: {
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.full,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillSelected: {
    backgroundColor: colors.tertiary,
    borderColor: colors.tertiary,
  },
  pillText: {
    fontFamily: fonts.labelMd.fontFamily,
    fontSize: fonts.labelMd.fontSize,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  pillTextSelected: {
    color: colors.onTertiary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  slotCard: {
    width: "48%",
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: radii.base,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  slotCardSelected: {
    backgroundColor: colors.tertiaryContainer,
    borderColor: colors.tertiary,
  },
  slotText: {
    fontFamily: fonts.labelMd.fontFamily,
    fontSize: fonts.labelMd.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  slotTextSelected: {
    color: colors.onTertiary,
  },
  bookButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.tertiary, // Use indigo for scheduling actions
  },
});
