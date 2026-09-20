/**
 * CareQueue Design System Tokens
 * Extracted from the Stitch design system for the Hospital Queue Mobile App.
 */

export const colors = {
  // Primary palette — clinical teal
  primary: "#00685F",
  primaryContainer: "#008378",
  onPrimary: "#FFFFFF",
  onPrimaryContainer: "#F4FFFC",

  // Secondary
  secondary: "#006B5F",
  secondaryContainer: "#6DF5E1",
  onSecondary: "#FFFFFF",
  onSecondaryContainer: "#006F64",

  // Tertiary — scheduling indigo
  tertiary: "#4B41E1",
  tertiaryContainer: "#645EFB",
  onTertiary: "#FFFFFF",

  // Surfaces
  surface: "#FAF8FF",
  surfaceDim: "#D2D9F4",
  surfaceContainer: "#EAEDFF",
  surfaceContainerHigh: "#E2E7FF",
  surfaceContainerLow: "#F2F3FF",
  onSurface: "#131B2E",
  onSurfaceVariant: "#3D4947",

  // Outline
  outline: "#6D7A77",
  outlineVariant: "#BCC9C6",

  // Error
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onError: "#FFFFFF",
  onErrorContainer: "#93000A",

  // Functional status colors
  success: "#059669",
  successBg: "#ECFDF5",
  successText: "#065F46",

  warning: "#D97706",
  warningBg: "#FEF3C7",
  warningText: "#92400E",

  critical: "#E11D48",
  criticalBg: "#FFF1F2",

  // Appointment
  appointmentBg: "#EEF2FF",
  appointmentText: "#3730A3",

  // Backgrounds & borders
  background: "#F8FAFC",
  cardBg: "#FFFFFF",
  border: "#E2E8F0",
  borderInput: "#CBD5E1",

  // Deep text
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#64748B",

  // Inverse
  inverseSurface: "#283044",
  inverseOnSurface: "#EEF0FF",
  inversePrimary: "#6BD8CB",
} as const;

export const fonts = {
  headlineFamily: "PlusJakartaSans",
  bodyFamily: "Inter",

  displayTicket: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -0.03 * 56,
  },
  displayTicketMobile: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.02 * 40,
  },
  headlineLg: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.02 * 32,
  },
  headlineLgMobile: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.01 * 26,
  },
  headlineMd: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 22,
    lineHeight: 28,
  },
  headlineSm: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 18,
    lineHeight: 24,
  },
  bodyLg: {
    fontFamily: "Inter-Regular",
    fontSize: 17,
    lineHeight: 26,
  },
  bodyMd: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  bodySm: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  labelLg: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.01 * 15,
  },
  labelMd: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.02 * 13,
  },
  labelSm: {
    fontFamily: "Inter-Bold",
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.04 * 11,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  gutter: 16,
  margin: 16,
} as const;

export const radii = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardElevated: {
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  modal: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
} as const;
