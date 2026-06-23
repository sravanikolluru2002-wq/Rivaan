import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Button } from "@/src/components/Button";
import { api } from "@/src/api";
import { useAuth } from "@/src/auth-context";
import { colors, radii, shadow, spacing, typography } from "@/src/theme";

export default function AdminLoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 920;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAdminPreviewAccess() {
    setLoading(true);
    setErrorMessage("");
    try {
      const session = await api.adminDemoAccess();
      if (!session.user?.is_admin) {
        throw new Error("This account does not have admin access.");
      }
      await signIn(session.access_token, session.user);
      router.replace("/admin");
    } catch (error: any) {
      const rawMessage = String(error?.message || "");
      const normalized = rawMessage.toLowerCase();
      const message =
        normalized.includes("not found") || normalized.includes("404")
          ? "The live backend has not been updated with admin preview access yet. Redeploy the Render backend, then try again."
          : rawMessage || "Admin preview access failed.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={[styles.scroll, isWide && styles.scrollWide]}>
          <View style={[styles.shell, isWide && styles.shellWide]}>
            <View style={styles.hero}>
              <View style={styles.heroBadge}>
                <Feather name="shield" size={14} color={colors.white} />
                <Text style={styles.heroBadgeText}>MANAGEMENT ACCESS</Text>
              </View>
              <Text style={styles.heroTitle}>Admin control for approvals, bookings, and live operations.</Text>
              <Text style={styles.heroBody}>
                This screen now opens the seeded admin review console directly so you can test the full agent application and approval workflow without the broken phone-password step.
              </Text>

              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>Agents</Text>
                  <Text style={styles.heroStatLabel}>approval queue</Text>
                </View>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>Bookings</Text>
                  <Text style={styles.heroStatLabel}>confirmation flow</Text>
                </View>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>CRM</Text>
                  <Text style={styles.heroStatLabel}>pipeline visibility</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.cardTitle}>Admin Review Access</Text>
                  <Text style={styles.cardSubtitle}>Use seeded preview access to open the admin approval console directly.</Text>
                </View>
                <View style={styles.cardTopLinks}>
                  <TouchableOpacity onPress={() => router.replace("/")}>
                    <Text style={styles.backLink}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.backLink}>Customer Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/agent-login")}>
                    <Text style={styles.backLink}>Agent Login</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Feather name="alert-circle" size={14} color={colors.danger} />
                  <Text style={styles.errorBannerText}>{errorMessage}</Text>
                </View>
              ) : null}

              <View style={styles.previewBanner}>
                <Feather name="shield" size={18} color={colors.primary} />
                <Text style={styles.previewBannerText}>
                  Phone and password inputs are removed for now. This page only exists to test the agent-apply to admin-approval workflow on the live app.
                </Text>
              </View>

              <Button title="Open Admin Dashboard" onPress={handleAdminPreviewAccess} loading={loading} />

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Current testing mode</Text>
                <Text style={styles.infoText}>Step 1: Agent applies from the live app.</Text>
                <Text style={styles.infoText}>Step 2: Open this seeded admin console.</Text>
                <Text style={styles.infoText}>Step 3: Approve or reject the application.</Text>
                <Text style={styles.infoText}>Step 4: Return to agent login and verify access.</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F1E8" },
  scroll: { flexGrow: 1, padding: spacing.lg },
  scrollWide: { justifyContent: "center", paddingVertical: spacing.xl },
  shell: { gap: spacing.lg },
  shellWide: { flexDirection: "row", alignItems: "stretch" },
  hero: {
    flex: 1,
    minHeight: 300,
    borderRadius: radii.xl,
    backgroundColor: "#102F24",
    padding: spacing.xl,
    gap: spacing.md,
    justifyContent: "space-between",
  },
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroBadgeText: { ...typography.label, color: colors.white, fontSize: 10 },
  heroTitle: { ...typography.h1, color: colors.white, fontWeight: "800" },
  heroBody: { ...typography.body, color: "#D8E7DE", lineHeight: 22 },
  heroStats: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  heroStat: {
    minWidth: 110,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  heroStatValue: { color: colors.white, fontWeight: "800", fontSize: 18 },
  heroStatLabel: { color: "#D8E7DE", fontSize: 11, fontWeight: "600" },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "#EADFCC",
    ...shadow.md,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  cardTopLinks: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap", justifyContent: "flex-end" },
  cardTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "800" },
  cardSubtitle: { ...typography.body, color: colors.stone600, lineHeight: 21, maxWidth: 520 },
  backLink: { color: colors.primary, fontWeight: "700" },
  previewBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: "#F5FAF6",
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#D8E8DB",
  },
  previewBannerText: { flex: 1, ...typography.small, color: colors.stone600, lineHeight: 18 },
  infoBox: {
    gap: 5,
    backgroundColor: "#FBF6EE",
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#EEDFC6",
  },
  infoTitle: { ...typography.small, color: colors.primaryDeepest, fontWeight: "800" },
  infoText: { ...typography.small, color: colors.stone600, lineHeight: 18 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FEECEC",
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#F6C7C7",
  },
  errorBannerText: { flex: 1, ...typography.small, color: colors.danger, fontWeight: "600", lineHeight: 18 },
});
