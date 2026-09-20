/**
 * Patient Sign Up screen.
 * - Full name, phone, national ID, password fields
 * - Create Account → POST /api/patients, then auto-login
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { colors, fonts, spacing } from "@/lib/theme";

export default function SignUpScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?\d{8,15}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid phone number";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        phone: phone.replace(/\s/g, "").trim(),
        nationalId: nationalId.trim() || undefined,
        password,
      });
      router.replace("/(app)");
    } catch (err: any) {
      Alert.alert(
        "Registration Failed",
        err?.message ?? "Could not create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoSection}>
            <Logo size="md" />
          </View>

          <View style={styles.form}>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.description}>
              Register to join hospital queues and book appointments.
            </Text>

            <Input
              label="Full Name"
              placeholder="e.g. Jean Mugabo"
              value={name}
              onChangeText={setName}
              autoComplete="name"
              error={errors.name}
            />

            <Input
              label="Phone Number"
              placeholder="+250 7XX XXX XXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              error={errors.phone}
            />

            <Input
              label="National ID (Optional)"
              placeholder="Enter your national ID"
              value={nationalId}
              onChangeText={setNationalId}
              error={errors.nationalId}
            />

            <Input
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: spacing.margin,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  form: {
    flex: 1,
  },
  heading: {
    fontFamily: fonts.headlineLgMobile.fontFamily,
    fontSize: fonts.headlineLgMobile.fontSize,
    lineHeight: fonts.headlineLgMobile.lineHeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: "700",
  },
  description: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: 4,
  },
  footerText: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    color: colors.textSecondary,
  },
  link: {
    fontFamily: fonts.labelLg.fontFamily,
    fontSize: fonts.labelLg.fontSize,
    color: colors.primary,
    fontWeight: "600",
  },
});
