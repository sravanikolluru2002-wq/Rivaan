import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { colors, radii, spacing, typography, shadow } from "@/src/theme";

const SERVICE_ICON_MAP: Record<string, any> = {
  Cleaning: "feather",
  "CCTV Installation": "video",
  "Compound Wall": "grid",
  Construction: "tool",
  Borewell: "droplet",
  Fencing: "shield",
  "Electricity Connection": "zap",
  "Water Connection": "droplet",
  "Property Maintenance": "settings",
  "Legal Documentation": "file-text",
};

export default function ServicesScreen() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "mine">("all");

  useEffect(() => {
    (async () => {
      try {
        const [c, r] = await Promise.all([api.servicesCatalog(), api.myServices().catch(() => [])]);
        setCatalog(c as any[]);
        setRequests(r as any[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="services-screen">
      <View style={styles.header}>
        <TouchableOpacity testID="services-back" style={styles.headerBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.primaryDeepest} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Services</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity testID="services-tab-all" style={[styles.tab, tab === "all" && styles.tabActive]} onPress={() => setTab("all")}>
          <Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>Browse Services</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="services-tab-mine" style={[styles.tab, tab === "mine" && styles.tabActive]} onPress={() => setTab("mine")}>
          <Text style={[styles.tabText, tab === "mine" && styles.tabTextActive]}>My Requests ({requests.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {tab === "all" ? (
          <View style={styles.grid}>
            {catalog.map((s) => (
              <TouchableOpacity
                key={s.type}
                testID={`service-${s.type}`}
                style={styles.tile}
                onPress={() => router.push(`/services/${encodeURIComponent(s.type)}`)}
                activeOpacity={0.85}
              >
                <View style={styles.tileIcon}>
                  <Feather name={SERVICE_ICON_MAP[s.type] || "tool"} size={22} color={colors.primary} />
                </View>
                <Text style={styles.tileTitle}>{s.type}</Text>
                <Text style={styles.tileDesc} numberOfLines={2}>{s.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            {requests.length === 0 ? (
              <View style={styles.empty}>
                <Feather name="inbox" size={48} color={colors.stone300} />
                <Text style={styles.emptyText}>No service requests yet</Text>
              </View>
            ) : (
              requests.map((r) => (
                <View key={r.id} style={styles.reqCard}>
                  <View style={[styles.reqIcon, { backgroundColor: colors.accentSoft }]}>
                    <Feather name={SERVICE_ICON_MAP[r.service_type] || "tool"} size={18} color={colors.accent} />
                  </View>
                  <View style={styles.reqBody}>
                    <Text style={styles.reqTitle}>{r.service_type}</Text>
                    <Text style={styles.reqMeta}>Preferred: {r.preferred_date}</Text>
                    <Text style={styles.reqDesc} numberOfLines={2}>{r.description}</Text>
                  </View>
                  <View style={[styles.reqStatus, { backgroundColor: getStatusBg(r.status) }]}>
                    <Text style={[styles.reqStatusText, { color: getStatusColor(r.status) }]}>{r.status.replace("_", " ").toUpperCase()}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusBg(status: string): string {
  switch (status) {
    case "completed": return "#E6F4EA";
    case "in_progress": return "#FEF3C7";
    default: return "#E0E7FF";
  }
}
function getStatusColor(status: string): string {
  switch (status) {
    case "completed": return colors.success;
    case "in_progress": return "#D97706";
    default: return colors.info;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.stone100 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  headerTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  tabs: { flexDirection: "row", margin: spacing.lg, marginBottom: 0, backgroundColor: colors.white, borderRadius: radii.md, padding: 4, borderWidth: 1, borderColor: colors.stone100 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: radii.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.small, color: colors.stone600, fontWeight: "600" },
  tabTextActive: { color: colors.white },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tile: { width: "48%", backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.md, gap: 8, alignItems: "flex-start", ...shadow.sm },
  tileIcon: { width: 44, height: 44, borderRadius: radii.md, backgroundColor: "#E6F4EA", alignItems: "center", justifyContent: "center" },
  tileTitle: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  tileDesc: { ...typography.small, color: colors.stone500 },
  reqCard: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.md, ...shadow.sm },
  reqIcon: { width: 40, height: 40, borderRadius: radii.full, alignItems: "center", justifyContent: "center" },
  reqBody: { flex: 1 },
  reqTitle: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  reqMeta: { ...typography.small, color: colors.stone500, marginTop: 2 },
  reqDesc: { ...typography.small, color: colors.stone600, marginTop: 4 },
  reqStatus: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: radii.sm },
  reqStatusText: { fontSize: 9, fontWeight: "700" },
  empty: { padding: spacing.xl, alignItems: "center", gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.stone500 },
});
