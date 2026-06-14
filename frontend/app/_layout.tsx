import React, { useEffect } from "react";
import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { AuthProvider, useAuth } from "@/src/auth-context";
import { registerServiceWorker } from "@/src/pwa/register-service-worker";
import { colors } from "@/src/theme";

SplashScreen.preventAutoHideAsync();
registerServiceWorker();

function RootLayoutInner() {
  const { isLoading, isAuthed, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const inLoginRoute = segments[0] === "login";
  const inOnboardingRoute = segments[0] === "onboarding";
  const needsOnboarding = isAuthed && user?.onboarding_completed !== true;

  useEffect(() => {
    if (isLoading) return;
    console.log("[auth-flow] root guard effect", { isAuthed, isLoading, segments, inLoginRoute, inOnboardingRoute, needsOnboarding });
    if (!isAuthed && !inLoginRoute) {
      console.log("[auth-flow] root guard effect -> router.replace('/login')");
      router.replace("/login");
    } else if (needsOnboarding && !inOnboardingRoute) {
      console.log("[auth-flow] root guard effect -> router.replace('/onboarding')");
      router.replace("/onboarding");
    } else if (isAuthed && !needsOnboarding && (inLoginRoute || inOnboardingRoute)) {
      console.log("[auth-flow] root guard effect -> router.replace('/(tabs)')");
      router.replace("/(tabs)");
    }
  }, [isAuthed, isLoading, inLoginRoute, inOnboardingRoute, needsOnboarding, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthed && !inLoginRoute) {
    console.log("[auth-flow] root guard render -> Redirect('/login')");
    return <Redirect href="/login" />;
  }
  if (needsOnboarding && !inOnboardingRoute) {
    console.log("[auth-flow] root guard render -> Redirect('/onboarding')");
    return <Redirect href="/onboarding" />;
  }
  if (isAuthed && !needsOnboarding && (inLoginRoute || inOnboardingRoute)) {
    console.log("[auth-flow] root guard render -> Redirect('/(tabs)')");
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.white } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="property/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="layout/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="booking/[plotId]" options={{ presentation: "modal" }} />
      <Stack.Screen name="documents" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="services" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="services/[type]" options={{ presentation: "modal" }} />
      <Stack.Screen name="notifications" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="wishlist" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="centre/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="admin" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useIconFonts();

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <RootLayoutInner />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
