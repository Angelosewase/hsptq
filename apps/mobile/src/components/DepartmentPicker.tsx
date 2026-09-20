/**
 * Department picker — shows a list of active departments to select from.
 */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors, fonts, radii, shadows, spacing } from "@/lib/theme";
import type { Department } from "@/lib/types";

interface DepartmentPickerProps {
  departments: Department[];
  loading: boolean;
  onSelect: (dept: Department) => void;
  selectedId?: string;
}

const DEPARTMENT_ICONS: Record<string, string> = {
  "General Medicine": "🩺",
  Dentistry: "🦷",
  Pediatrics: "👶",
  Ophthalmology: "👁️",
  Dermatology: "🧴",
  Orthopedics: "🦴",
  Cardiology: "❤️",
  default: "🏥",
};

export function DepartmentPicker({
  departments,
  loading,
  onSelect,
  selectedId,
}: DepartmentPickerProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Loading departments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {departments.map((dept) => {
        const isSelected = dept.id === selectedId;
        const icon = DEPARTMENT_ICONS[dept.name] ?? DEPARTMENT_ICONS.default;

        return (
          <TouchableOpacity
            key={dept.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelect(dept)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.name, isSelected && styles.nameSelected]}>
              {dept.name}
            </Text>
            {isSelected && (
              <View style={styles.check}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    color: colors.textMuted,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: "#F0FDFA",
  },
  icon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  name: {
    flex: 1,
    fontFamily: fonts.labelLg.fontFamily,
    fontSize: fonts.labelLg.fontSize,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  nameSelected: {
    color: colors.primary,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
});
