/**
 * Patient Sign In screen.
 * - CareQueue logo at top
 * - Phone number + password inputs
 * - Sign In button → POST /api/auth/patient/login
 * - Link to sign-up
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

export default function SignInScreen() {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {},
  );

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!phone.trim()) e.phone = "Phone number is required";
    if (!password.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ phone: phone.trim(), password });
      router.replace("/(app)");
    } catch (err: any) {
      Alert.alert(
        "Sign In Failed",
        err?.message ?? "Invalid phone number or password.",
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
            <Logo size="lg" />
            <Text style={styles.subtitle}>
              Skip the line. Join the queue from anywhere.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.description}>
              Sign in with your phone number to continue.
            </Text>

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
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              error={errors.password}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                <Text style={styles.link}>Create Account</Text>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  subtitle: {
    fontFamily: fonts.bodyMd.fontFamily,
    fontSize: fonts.bodyMd.fontSize,
    lineHeight: fonts.bodyMd.lineHeight,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  form: {
    flex: 1,
    paddingTop: spacing.lg,
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
