import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth-context";
import { colors, radii, spacing, typography, shadow } from "@/src/theme";

const ADMIN_VISIT_PREVIEW = [
  {
    id: "admin-visit-001",
    customer_name: "Mahesh Kumar",
    customer_phone: "+91 99000 01111",
    property_name: "Sripuram Gardens",
    plot_id: "IH-001",
    visit_date: "2026-06-25",
    visit_time: "10:30 AM",
    status: "scheduled",
    assigned_agent_name: "Primary Agent",
    notes: "Customer requested pricing comparison during visit.",
  },
  {
    id: "admin-visit-002",
    customer_name: "Anita Reddy",
    customer_phone: "+91 99111 12222",
    property_name: "Sripuram Gardens",
    plot_id: "IH-014",
    visit_date: "2026-06-26",
    visit_time: "04:00 PM",
    status: "confirmed",
    assigned_agent_name: "Sub-Agent",
    notes: "Family visit with layout walkthrough.",
  },
] as const;

function normalizeVisitStatus(status?: string) {
  return String(status || "scheduled").toLowerCase();
}

function visitStatusLabel(status?: string) {
  const normalized = normalizeVisitStatus(status);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function reminderTone(type?: string) {
  switch (type) {
    case "warning":
      return { backgroundColor: "#FFF6E8", borderColor: "#F3D19C", icon: "clock" as const };
    case "success":
      return { backgroundColor: "#EFF8F0", borderColor: "#CAE7CF", icon: "check-circle" as const };
    default:
      return { backgroundColor: "#F4F8F5", borderColor: "#D8E8DB", icon: "bell" as const };
  }
}

export default function AdminScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [agents, setAgents] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activePanel, setActivePanel] = useState<"approvals" | "visits">("approvals");
  const [visitFilter, setVisitFilter] = useState<"all" | "scheduled" | "confirmed" | "completed">("all");

  const pendingAgents = useMemo(
    () => agents.filter((agent) => String(agent.approval_status || "pending").toLowerCase() === "pending"),
    [agents]
  );
  const approvedAgents = useMemo(
    () => agents.filter((agent) => String(agent.approval_status || "").toLowerCase() === "approved"),
    [agents]
  );
  const filteredVisits = useMemo(() => {
    if (visitFilter === "all") return visits;
    return visits.filter((visit) => normalizeVisitStatus(visit.status) === visitFilter);
  }, [visitFilter, visits]);
  const scheduledVisits = useMemo(
    () => visits.filter((visit) => ["scheduled", "confirmed"].includes(normalizeVisitStatus(visit.status))),
    [visits]
  );

  const load = useCallback(async (silent = false) => {
    try {
      const overview = await api.adminOverview();
      const list = Array.isArray(overview?.agents) ? overview.agents : [];
      const visitList = Array.isArray(overview?.visits) ? overview.visits : [];
      const reminderList = Array.isArray(overview?.reminders) ? overview.reminders : [];
      setAgents(list as any[]);
      setVisits(visitList.length ? visitList : [...ADMIN_VISIT_PREVIEW]);
      setReminders(reminderList);
    } catch (error: any) {
      if (!silent) {
        const message = String(error?.message || "Unable to load admin approval queue.");
        Alert.alert("Admin approvals", message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  useEffect(() => {
    const timer = setInterval(() => {
      load(true);
    }, 15000);
    return () => clearInterval(timer);
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

  async function handleVisitStatusChange(visitId: string, nextStatus: "confirmed" | "completed") {
    const previous = visits;
    setVisits((current) =>
      current.map((visit) =>
        visit.id === visitId ? { ...visit, status: nextStatus } : visit
      )
    );
    try {
      await api.agentUpdateSiteVisit(visitId, { status: nextStatus });
      Alert.alert("Visit updated", `Visit marked as ${nextStatus}.`);
    } catch (error: any) {
      setVisits(previous);
      Alert.alert("Visit update failed", error?.message || "Unable to update visit status right now.");
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
          <Text style={styles.headerTitle}>Admin Operations Console</Text>
          <Text style={styles.headerSub}>Live approvals, reminders, and scheduled visit tracking</Text>
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
        <View style={styles.heroMetricCard}>
          <Text style={styles.heroMetricValue}>{scheduledVisits.length}</Text>
          <Text style={styles.heroMetricLabel}>Live Visit Queue</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />
        }
      >
        {reminders.length ? (
          <View style={styles.remindersBlock}>
            <Text style={styles.sectionTitle}>Realtime Reminders</Text>
            <Text style={styles.sectionText}>These cards refresh automatically so admins can react without manually reloading.</Text>
            {reminders.map((reminder) => {
              const tone = reminderTone(reminder.type);
              return (
                <View
                  key={reminder.id}
                  style={[styles.reminderCard, { backgroundColor: tone.backgroundColor, borderColor: tone.borderColor }]}
                >
                  <View style={styles.reminderIcon}>
                    <Feather name={tone.icon} size={16} color={colors.primaryDeepest} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderText}>{reminder.body}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        <View style={styles.panelTabs}>
          <TouchableOpacity
            style={[styles.panelTab, activePanel === "approvals" && styles.panelTabActive]}
            onPress={() => setActivePanel("approvals")}
          >
            <Text style={[styles.panelTabText, activePanel === "approvals" && styles.panelTabTextActive]}>Approvals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.panelTab, activePanel === "visits" && styles.panelTabActive]}
            onPress={() => setActivePanel("visits")}
          >
            <Text style={[styles.panelTabText, activePanel === "visits" && styles.panelTabTextActive]}>Schedule Visits</Text>
          </TouchableOpacity>
        </View>

        {activePanel === "approvals" ? (
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
        ) : null}

        {activePanel === "approvals" ? (
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
        ) : null}

        {activePanel === "visits" ? (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Scheduled Visits</Text>
            <Text style={styles.sectionText}>Admins can now review upcoming visits, check ownership, and update progress from here.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {(["all", "scheduled", "confirmed", "completed"] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, visitFilter === filter && styles.filterChipActive]}
                  onPress={() => setVisitFilter(filter)}
                >
                  <Text style={[styles.filterChipText, visitFilter === filter && styles.filterChipTextActive]}>
                    {filter === "all" ? "All" : visitStatusLabel(filter)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredVisits.length === 0 ? (
              <EmptyState text="No visits available for this filter." />
            ) : (
              filteredVisits.map((visit) => (
                <View key={visit.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.avatarText}>{(visit.customer_name || "V")[0]?.toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{visit.customer_name || "Customer Visit"}</Text>
                      <Text style={styles.cardSub}>{visit.property_name || "Property"} - {visit.plot_id || "-"}</Text>
                      <Text style={styles.cardMeta}>Agent: {visit.assigned_agent_name || "Assigned team"}</Text>
                      <Text style={styles.cardMeta}>Schedule: {visit.visit_date || "-"} {visit.visit_time ? `at ${visit.visit_time}` : ""}</Text>
                      {visit.customer_phone ? <Text style={styles.cardMeta}>Phone: {visit.customer_phone}</Text> : null}
                      {visit.notes ? <Text style={styles.cardMessage}>{visit.notes}</Text> : null}
                    </View>
                    <View style={styles.pendingPill}>
                      <Text style={styles.pendingPillText}>{visitStatusLabel(visit.status).toUpperCase()}</Text>
                    </View>
                  </View>

                  <View style={styles.timelineRow}>
                    <View style={styles.timelineStep}>
                      <View style={styles.timelineDot} />
                      <Text style={styles.timelineText}>Requested</Text>
                    </View>
                    <View style={styles.timelineStep}>
                      <View style={styles.timelineDot} />
                      <Text style={styles.timelineText}>Assigned</Text>
                    </View>
                    <View style={styles.timelineStep}>
                      <View style={styles.timelineDot} />
                      <Text style={styles.timelineText}>{visitStatusLabel(visit.status)}</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    {normalizeVisitStatus(visit.status) !== "confirmed" ? (
                      <TouchableOpacity style={styles.approveBtn} onPress={() => handleVisitStatusChange(visit.id, "confirmed")}>
                        <Feather name="calendar" size={16} color={colors.white} />
                        <Text style={styles.approveBtnText}>Mark Confirmed</Text>
                      </TouchableOpacity>
                    ) : null}
                    {normalizeVisitStatus(visit.status) !== "completed" ? (
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleVisitStatusChange(visit.id, "completed")}>
                        <Feather name="check-circle" size={16} color={colors.success} />
                        <Text style={[styles.rejectBtnText, { color: colors.success }]}>Mark Completed</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </View>
        ) : null}
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
    flexWrap: "wrap",
  },
  heroMetricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  heroMetricValue: { ...typography.h2, color: colors.primaryDeepest, fontWeight: "800" },
  heroMetricLabel: { ...typography.small, color: colors.stone500, fontWeight: "700" },
  panelTabs: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  panelTab: {
    flex: 1,
    minHeight: 46,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stone200,
    alignItems: "center",
    justifyContent: "center",
  },
  panelTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  panelTabText: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  panelTabTextActive: { color: colors.white },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  remindersBlock: { gap: spacing.sm },
  reminderCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  reminderIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(18,58,41,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  reminderTitle: { ...typography.body, color: colors.primaryDeepest, fontWeight: "800" },
  reminderText: { ...typography.small, color: colors.stone600, lineHeight: 18, marginTop: 2 },
  sectionBlock: { gap: spacing.sm },
  filterRow: { gap: spacing.sm, paddingBottom: spacing.xs },
  filterChip: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stone200,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: { ...typography.small, color: colors.primaryDeepest, fontWeight: "700" },
  filterChipTextActive: { color: colors.white },
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
  timelineRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  timelineStep: { flexDirection: "row", alignItems: "center", gap: 6 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  timelineText: { ...typography.small, color: colors.stone600, fontWeight: "600" },
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
