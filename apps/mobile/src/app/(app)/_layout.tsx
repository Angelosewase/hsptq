/**
 * Main app layout — checks auth and provides standard tab bar navigation.
 */
import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/lib/theme";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  // Protect all routes inside (app)
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.cardBg,
          borderTopColor: colors.border,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.labelSm.fontFamily,
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="book-slot"
        options={{
          title: "Book",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hide the passes from the tab bar itself, we'll navigate to them programmatically */}
      <Tabs.Screen name="queue-pass" options={{ href: null }} />
      <Tabs.Screen name="scheduled-pass" options={{ href: null }} />
      <Tabs.Screen name="alert" options={{ href: null }} />
    </Tabs>
  );
}
