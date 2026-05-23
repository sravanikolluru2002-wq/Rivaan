import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth-context";
import { colors, radii, spacing, typography, shadow } from "@/src/theme";

type Tab = "stats" | "bookings" | "services" | "users";

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, b, sr, u] = await Promise.all([
        api.adminStats().catch(() => null),
        api.adminBookings().catch(() => []),
        api.adminServices().catch(() => []),
        api.adminUsers().catch(() => []),
      ]);
      setStats(s);
      setBookings(b as any[]);
      setServices(sr as any[]);
      setUsers(u as any[]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function confirmBooking(id: string) {
    Alert.alert("Confirm Booking", "This will assign the plot to the customer and mark it as booked.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            await api.adminConfirmBooking(id);
            Alert.alert("Confirmed", "Booking confirmed and plot assigned.");
            await load();
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  }

  async function updateService(id: string, newStatus: string) {
    try {
      await api.adminUpdateService(id, newStatus);
      await load();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

  if (!user?.is_admin) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Feather name="lock" size={48} color={colors.stone400} />
          <Text style={styles.emptyTitle}>Admin Access Required</Text>
          <Text style={styles.emptyText}>This dashboard is for Rivan Reality staff only.</Text>
          <Text style={styles.emptyText}>Login with admin: 9000000000 / 123456</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="admin-screen">
      <View style={styles.header}>
        <TouchableOpacity testID="admin-back" style={styles.headerBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.primaryDeepest} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSub}>Rivan Reality Operations</Text>
        </View>
        <View style={styles.adminBadge}>
          <Feather name="shield" size={12} color={colors.accent} />
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarInner}>
        {(["stats", "bookings", "services", "users"] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            testID={`admin-tab-${t}`}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "stats" ? "Overview" : t === "bookings" ? `Bookings (${bookings.length})` : t === "services" ? `Services (${services.length})` : `Users (${users.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      >
        {tab === "stats" && stats ? (
          <View style={styles.statsGrid}>
            <StatCard icon="users" label="Customers" value={stats.users} color={colors.primary} />
            <StatCard icon="home" label="Properties" value={stats.properties} color={colors.accent} />
            <StatCard icon="grid" label="Total Plots" value={stats.plots} color={colors.info} />
            <StatCard icon="check-circle" label="Sold" value={stats.plots_sold} color={colors.sold} />
            <StatCard icon="bookmark" label="Booked" value={stats.plots_booked} color={colors.booked} />
            <StatCard icon="clock" label="Reserved" value={stats.plots_reserved} color={colors.reserved} />
            <StatCard icon="circle" label="Available" value={stats.plots_available} color={colors.available} />
            <StatCard icon="file-text" label="Bookings" value={stats.bookings} color={colors.primary} />
            <StatCard icon="tool" label="Service Reqs" value={stats.service_requests} color={colors.accent} />
            <StatCard icon="calendar" label="Visits" value={stats.visits} color={colors.info} />
          </View>
        ) : null}

        {tab === "bookings" ? (
          <View style={{ gap: spacing.sm }}>
            {bookings.length === 0 ? <EmptyState text="No bookings yet" /> : bookings.map((b) => (
              <View key={b.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{b.name}</Text>
                    <Text style={styles.cardSub}>+91 {b.mobile}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: b.status === "confirmed" ? "#E6F4EA" : "#FEF3C7" }]}>
                    <Text style={[styles.statusText, { color: b.status === "confirmed" ? colors.success : "#D97706" }]}>
                      {b.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardMeta}>Plot: {b.plot_id} · {b.created_at?.slice(0, 10)}</Text>
                {b.message ? <Text style={styles.cardMessage}>"{b.message}"</Text> : null}
                {b.status === "pending" ? (
                  <TouchableOpacity testID={`admin-confirm-${b.id}`} style={styles.confirmBtn} onPress={() => confirmBooking(b.id)}>
                    <Feather name="check" size={14} color={colors.white} />
                    <Text style={styles.confirmBtnText}>Confirm & Assign</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {tab === "services" ? (
          <View style={{ gap: spacing.sm }}>
            {services.length === 0 ? <EmptyState text="No service requests yet" /> : services.map((s) => (
              <View key={s.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{s.service_type}</Text>
                    <Text style={styles.cardSub}>📞 {s.contact} · {s.preferred_date}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: getSvcBg(s.status) }]}>
                    <Text style={[styles.statusText, { color: getSvcColor(s.status) }]}>{s.status.replace("_", " ").toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.cardMessage}>{s.description}</Text>
                <View style={styles.statusBtns}>
                  {s.status !== "in_progress" && s.status !== "completed" ? (
                    <TouchableOpacity testID={`admin-svc-progress-${s.id}`} style={[styles.smallBtn, { backgroundColor: "#FEF3C7" }]} onPress={() => updateService(s.id, "in_progress")}>
                      <Text style={[styles.smallBtnText, { color: "#D97706" }]}>Start</Text>
                    </TouchableOpacity>
                  ) : null}
                  {s.status !== "completed" ? (
                    <TouchableOpacity testID={`admin-svc-complete-${s.id}`} style={[styles.smallBtn, { backgroundColor: "#E6F4EA" }]} onPress={() => updateService(s.id, "completed")}>
                      <Text style={[styles.smallBtnText, { color: colors.success }]}>Complete</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {tab === "users" ? (
          <View style={{ gap: spacing.sm }}>
            {users.map((u) => (
              <View key={u.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>{(u.name || "U")[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{u.name}</Text>
                    <Text style={styles.cardSub}>+91 {u.phone} · {u.kyc_status}</Text>
                  </View>
                  {u.is_admin ? (
                    <View style={styles.adminPill}>
                      <Text style={styles.adminPillText}>ADMIN</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={{ padding: 40, alignItems: "center" }}>
      <Feather name="inbox" size={48} color={colors.stone300} />
      <Text style={{ ...typography.body, color: colors.stone500, marginTop: 8 }}>{text}</Text>
    </View>
  );
}

function getSvcBg(s: string) { return s === "completed" ? "#E6F4EA" : s === "in_progress" ? "#FEF3C7" : "#E0E7FF"; }
function getSvcColor(s: string) { return s === "completed" ? colors.success : s === "in_progress" ? "#D97706" : colors.info; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.stone100 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  headerTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  headerSub: { ...typography.small, color: colors.stone500 },
  adminBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.sm },
  adminBadgeText: { color: colors.accentDark, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  tabBar: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.stone100, maxHeight: 50 },
  tabBarInner: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  tab: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radii.full, backgroundColor: colors.offWhite },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.small, color: colors.stone700, fontWeight: "600" },
  tabTextActive: { color: colors.white },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  statCard: { width: "31%", backgroundColor: colors.white, padding: spacing.md, borderRadius: radii.md, gap: 6, ...shadow.sm },
  statIcon: { width: 32, height: 32, borderRadius: radii.sm, alignItems: "center", justifyContent: "center" },
  statValue: { ...typography.h2, color: colors.primaryDeepest, fontWeight: "700" },
  statLabel: { ...typography.small, color: colors.stone500, fontWeight: "600" },
  card: { backgroundColor: colors.white, padding: spacing.md, borderRadius: radii.md, gap: 6, ...shadow.sm },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  cardTitle: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  cardSub: { ...typography.small, color: colors.stone500, marginTop: 2 },
  cardMeta: { ...typography.small, color: colors.stone500, marginTop: 2 },
  cardMessage: { ...typography.small, color: colors.stone600, fontStyle: "italic", marginTop: 4 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.sm },
  statusText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  confirmBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: radii.md, marginTop: spacing.sm },
  confirmBtnText: { ...typography.small, color: colors.white, fontWeight: "700" },
  statusBtns: { flexDirection: "row", gap: 8, marginTop: 6 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.sm },
  smallBtnText: { ...typography.label, fontSize: 10 },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  userAvatarText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  adminPill: { backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.sm },
  adminPillText: { color: colors.white, fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl, gap: spacing.sm },
  emptyTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700", marginTop: spacing.md },
  emptyText: { ...typography.body, color: colors.stone500, textAlign: "center" },
});
