import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth-context";
import { colors, radii, spacing, typography, shadow } from "@/src/theme";

export default function AdminScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const pendingAgents = useMemo(
    () => agents.filter((agent) => String(agent.approval_status || "pending").toLowerCase() === "pending"),
    [agents]
  );
  const approvedAgents = useMemo(
    () => agents.filter((agent) => String(agent.approval_status || "").toLowerCase() === "approved"),
    [agents]
  );

  const load = useCallback(async () => {
    try {
      const list = await api.adminAgents().catch((error) => {
        throw error;
      });
      setAgents(list as any[]);
    } catch (error: any) {
      const message = String(error?.message || "Unable to load admin approval queue.");
      Alert.alert("Admin approvals", message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(agentId: string) {
    try {
      await api.adminApproveAgent(agentId);
      Alert.alert("Approved", "Agent access is now active. This phone number can log in immediately.");
      await load();
    } catch (error: any) {
      Alert.alert("Approval failed", error?.message || "Unable to approve the agent right now.");
    }
  }

  async function handleReject(agentId: string) {
    try {
      await api.adminUpdateAgentStatus(agentId, "rejected");
      Alert.alert("Rejected", "The application was rejected.");
      await load();
    } catch (error: any) {
      Alert.alert("Update failed", error?.message || "Unable to reject the application right now.");
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  if (!user?.is_admin) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Feather name="lock" size={48} color={colors.stone400} />
          <Text style={styles.emptyTitle}>Admin Access Required</Text>
          <Text style={styles.emptyText}>Open the admin preview access screen to continue the approval workflow test.</Text>
          <View style={styles.emptyActions}>
            <TouchableOpacity style={styles.emptyActionBtn} onPress={() => router.replace("/")}>
              <Text style={styles.emptyActionText}>Go Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.emptyActionBtn, styles.emptyActionBtnPrimary]} onPress={() => router.replace("/admin-login")}>
              <Text style={[styles.emptyActionText, styles.emptyActionTextPrimary]}>Open Admin Access</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="admin-screen">
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.replace("/")}>
          <Feather name="arrow-left" size={20} color={colors.primaryDeepest} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Agent Approval Console</Text>
          <Text style={styles.headerSub}>Only pending applications and activation controls</Text>
        </View>
        <TouchableOpacity style={styles.headerGhostBtn} onPress={handleSignOut}>
          <Feather name="log-out" size={16} color={colors.danger} />
          <Text style={[styles.headerGhostText, { color: colors.danger }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heroPanel}>
        <View style={styles.heroMetricCard}>
          <Text style={styles.heroMetricValue}>{pendingAgents.length}</Text>
          <Text style={styles.heroMetricLabel}>Pending Applications</Text>
        </View>
        <View style={styles.heroMetricCard}>
          <Text style={styles.heroMetricValue}>{approvedAgents.length}</Text>
          <Text style={styles.heroMetricLabel}>Approved Agents</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />
        }
      >
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Pending Approval</Text>
          <Text style={styles.sectionText}>Approve from here and the same phone number will get agent login access immediately.</Text>
          {pendingAgents.length === 0 ? (
            <EmptyState text="No pending applications right now." />
          ) : (
            pendingAgents.map((agent) => (
              <View key={agent.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{(agent.name || "A")[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{agent.name}</Text>
                    <Text style={styles.cardSub}>{agent.phone || "-"}</Text>
                    {agent.occupation ? <Text style={styles.cardMeta}>Occupation: {agent.occupation}</Text> : null}
                    {agent.agent_brand_name ? <Text style={styles.cardMeta}>Team: {agent.agent_brand_name}</Text> : null}
                    {agent.address ? <Text style={styles.cardMeta}>Address: {agent.address}</Text> : null}
                    {agent.application_notes ? <Text style={styles.cardMessage}>{agent.application_notes}</Text> : null}
                  </View>
                  <View style={styles.pendingPill}>
                    <Text style={styles.pendingPillText}>PENDING</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(agent.id)} testID={`admin-approve-agent-${agent.id}`}>
                    <Feather name="check" size={16} color={colors.white} />
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(agent.id)}>
                    <Feather name="x" size={16} color={colors.danger} />
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Approved Agents</Text>
          <Text style={styles.sectionText}>Only the necessary activated list is shown here.</Text>
          {approvedAgents.length === 0 ? (
            <EmptyState text="No approved agents yet." />
          ) : (
            approvedAgents.map((agent) => (
              <View key={agent.id} style={styles.compactCard}>
                <View style={styles.compactLeft}>
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>{(agent.name || "A")[0]?.toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{agent.name}</Text>
                    <Text style={styles.cardSub}>{agent.phone || "-"}</Text>
                  </View>
                </View>
                <View style={styles.approvedPill}>
                  <Feather name="check-circle" size={12} color={colors.success} />
                  <Text style={styles.approvedPillText}>APPROVED</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.emptyList}>
      <Feather name="inbox" size={42} color={colors.stone300} />
      <Text style={styles.emptyListText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.stone100,
  },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  headerGhostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: "#FEECEC",
  },
  headerGhostText: { ...typography.small, fontWeight: "700" },
  headerTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "800" },
  headerSub: { ...typography.small, color: colors.stone500 },
  heroPanel: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  heroMetricCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  heroMetricValue: { ...typography.h2, color: colors.primaryDeepest, fontWeight: "800" },
  heroMetricLabel: { ...typography.small, color: colors.stone500, fontWeight: "700" },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  sectionBlock: { gap: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "800" },
  sectionText: { ...typography.body, color: colors.stone600, lineHeight: 20 },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.md, ...shadow.sm },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  cardTitle: { ...typography.body, color: colors.primaryDeepest, fontWeight: "800" },
  cardSub: { ...typography.small, color: colors.stone500, marginTop: 2 },
  cardMeta: { ...typography.small, color: colors.stone500, marginTop: 4 },
  cardMessage: { ...typography.small, color: colors.stone600, marginTop: 6, lineHeight: 18 },
  pendingPill: { backgroundColor: "#FEF3C7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.sm },
  pendingPillText: { fontSize: 9, fontWeight: "800", color: "#D97706", letterSpacing: 0.6 },
  actionRow: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 130,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
  },
  approveBtnText: { ...typography.small, color: colors.white, fontWeight: "800" },
  rejectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: "#FEECEC",
    borderWidth: 1,
    borderColor: "#F6C7C7",
  },
  rejectBtnText: { ...typography.small, color: colors.danger, fontWeight: "800" },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  compactLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  approvedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  approvedPillText: { fontSize: 9, fontWeight: "800", color: colors.success, letterSpacing: 0.6 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl, gap: spacing.sm },
  emptyActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md, justifyContent: "center" },
  emptyActionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.full,
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.stone200,
  },
  emptyActionBtnPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  emptyActionText: { ...typography.small, color: colors.primaryDeepest, fontWeight: "700" },
  emptyActionTextPrimary: { color: colors.white },
  emptyTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700", marginTop: spacing.md },
  emptyText: { ...typography.body, color: colors.stone500, textAlign: "center" },
  emptyList: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.xl, alignItems: "center", gap: spacing.sm, ...shadow.sm },
  emptyListText: { ...typography.body, color: colors.stone500 },
});
