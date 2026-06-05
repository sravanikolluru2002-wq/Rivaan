import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { colors, radii, spacing, typography, shadow, formatINR, formatINRFull } from "@/src/theme";
import { Button } from "@/src/components/Button";

type Tab = "upcoming" | "history";

export default function PaymentsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [summary, setSummary] = useState<any>(null);
  const [installments, setInstallments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paying, setPaying] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [s, ins, hist] = await Promise.all([
        api.paymentsSummary(),
        api.installments(),
        api.paymentHistory(),
      ]);
      setSummary(s);
      setInstallments(ins as any[]);
      setHistory(hist as any[]);
    } catch (e: any) {
      console.warn("payments load", e?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handlePay(inst: any) {
    setPaying(inst.id);
    try {
      await api.payInstallment(inst.id);
      Alert.alert("Payment Successful", `Installment #${inst.installment_number} paid successfully.`);
      await load();
    } catch (e: any) {
      Alert.alert("Payment failed", e.message);
    } finally {
      setPaying(null);
    }
  }

  const upcoming = installments.filter((i) => i.status !== "paid");
  const paid = installments.filter((i) => i.status === "paid");
  const hasPayments = installments.length > 0 || history.length > 0 || (summary?.total_cost || 0) > 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="payments-screen">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Payments</Text>
          <Text style={styles.subheading}>Track all your installments & receipts</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryLabel}>Remaining Balance</Text>
            <View style={styles.summaryBadge}>
              <Feather name="trending-up" size={11} color={colors.accent} />
              <Text style={styles.summaryBadgeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.summaryBalance}>{formatINRFull(summary?.balance || 0)}</Text>
          <View style={styles.summaryProgress}>
            <View style={[styles.summaryProgressFill, { width: `${(summary?.amount_paid / summary?.total_cost) * 100 || 0}%` }]} />
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatLabel}>Total</Text>
              <Text style={styles.summaryStatValue}>{formatINR(summary?.total_cost || 0)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatLabel}>Paid</Text>
              <Text style={[styles.summaryStatValue, { color: colors.accentLight }]}>{formatINR(summary?.amount_paid || 0)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatLabel}>Done</Text>
              <Text style={styles.summaryStatValue}>{summary?.paid_count || 0}/{summary?.total_installments || 0}</Text>
            </View>
          </View>
        </View>

        {/* Overdue alert */}
        {summary?.overdue_count > 0 ? (
          <View style={styles.alertBox} testID="payments-overdue-alert">
            <Feather name="alert-triangle" size={18} color={colors.danger} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{summary.overdue_count} installment(s) overdue</Text>
              <Text style={styles.alertSubtitle}>Please pay to avoid late fees.</Text>
            </View>
          </View>
        ) : summary?.upcoming_installment ? (
          <View style={styles.noticeBox} testID="payments-upcoming-notice">
            <Feather name="bell" size={18} color={colors.primary} />
            <View style={styles.alertContent}>
              <Text style={styles.noticeTitle}>Next: {formatINRFull(summary.upcoming_installment.amount)}</Text>
              <Text style={styles.noticeSubtitle}>Due on {summary.upcoming_installment.due_date}</Text>
            </View>
          </View>
        ) : null}

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            testID="payments-tab-upcoming"
            style={[styles.tab, tab === "upcoming" && styles.tabActive]}
            onPress={() => setTab("upcoming")}
          >
            <Text style={[styles.tabText, tab === "upcoming" && styles.tabTextActive]}>
              Upcoming ({upcoming.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="payments-tab-history"
            style={[styles.tab, tab === "history" && styles.tabActive]}
            onPress={() => setTab("history")}
          >
            <Text style={[styles.tabText, tab === "history" && styles.tabTextActive]}>
              History ({history.length})
            </Text>
          </TouchableOpacity>
        </View>

        {!hasPayments ? (
          <View style={styles.listSection}>
            <View style={styles.empty}>
              <Feather name="credit-card" size={48} color={colors.stone300} />
              <Text style={styles.emptyTitle}>No payments yet</Text>
              <Text style={styles.emptyText}>Once you book a Vizag or Vijayawada property, installments, receipts and due dates will appear here.</Text>
              <TouchableOpacity testID="payments-browse-properties" style={styles.exploreBtn} onPress={() => router.push("/(tabs)")}>
                <Text style={styles.exploreBtnText}>Browse Properties</Text>
                <Feather name="arrow-right" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        ) : tab === "upcoming" ? (
          <View style={styles.listSection}>
            {upcoming.length === 0 ? (
              <View style={styles.empty}>
                <Feather name="check-circle" size={48} color={colors.success} />
                <Text style={styles.emptyTitle}>No upcoming installments</Text>
                <Text style={styles.emptyText}>You are currently up to date. Future payment schedules will appear here.</Text>
              </View>
            ) : (
              upcoming.map((inst) => (
                <View key={inst.id} style={styles.instCard} testID={`payments-inst-${inst.id}`}>
                  <View style={[styles.instLeft, { backgroundColor: inst.status === "overdue" ? colors.danger : colors.warning }]} />
                  <View style={styles.instBody}>
                    <View style={styles.instTop}>
                      <Text style={styles.instNumber}>Installment #{inst.installment_number}</Text>
                      <View style={[styles.statusPill, { backgroundColor: inst.status === "overdue" ? "#FEE2E2" : "#FEF3C7" }]}>
                        <Text style={[styles.statusPillText, { color: inst.status === "overdue" ? colors.danger : "#D97706" }]}>
                          {inst.status === "overdue" ? "OVERDUE" : "UPCOMING"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.instAmount}>{formatINRFull(inst.amount)}</Text>
                    <View style={styles.instMeta}>
                      <Feather name="calendar" size={12} color={colors.stone500} />
                      <Text style={styles.instMetaText}>Due {inst.due_date}</Text>
                    </View>
                    <Button
                      testID={`payments-pay-${inst.id}`}
                      title="Pay Now"
                      onPress={() => handlePay(inst)}
                      loading={paying === inst.id}
                      size="sm"
                      variant={inst.status === "overdue" ? "danger" : "primary"}
                      style={{ marginTop: 12 }}
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.listSection}>
            {history.length === 0 ? (
              <View style={styles.empty}>
                <Feather name="inbox" size={48} color={colors.stone300} />
                <Text style={styles.emptyTitle}>No receipts yet</Text>
                <Text style={styles.emptyText}>Completed payment receipts will appear here after your first installment.</Text>
              </View>
            ) : (
              history.map((p) => (
                <View key={p.id} style={styles.histCard} testID={`payments-hist-${p.id}`}>
                  <View style={styles.histIcon}>
                    <Feather name="check" size={18} color={colors.white} />
                  </View>
                  <View style={styles.histBody}>
                    <Text style={styles.histTitle}>Installment #{p.installment_number}</Text>
                    <Text style={styles.histReceipt}>Receipt: {p.receipt_id}</Text>
                    <Text style={styles.histMeta}>{p.paid_at?.slice(0, 10)} · {p.method}</Text>
                  </View>
                  <View style={styles.histRight}>
                    <Text style={styles.histAmount}>{formatINRFull(p.amount)}</Text>
                    <TouchableOpacity
                      testID={`payments-receipt-${p.id}`}
                      onPress={() => Alert.alert("Receipt", `Receipt ${p.receipt_id} downloaded.`)}
                    >
                      <Feather name="download" size={18} color={colors.primary} />
                    </TouchableOpacity>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: spacing.lg, paddingBottom: 0 },
  heading: { ...typography.h1, color: colors.primaryDeepest, fontWeight: "700" },
  subheading: { ...typography.body, color: colors.stone500, marginTop: 4 },
  summaryCard: { margin: spacing.lg, backgroundColor: colors.primary, borderRadius: radii.lg, padding: spacing.lg, ...shadow.md },
  summaryTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { ...typography.small, color: "rgba(255,255,255,0.7)", fontWeight: "600", letterSpacing: 1 },
  summaryBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full },
  summaryBadgeText: { ...typography.label, color: colors.accentLight, fontSize: 10 },
  summaryBalance: { fontSize: 36, fontWeight: "700", color: colors.white, marginTop: 8 },
  summaryProgress: { height: 4, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 2, marginTop: 12, overflow: "hidden" },
  summaryProgressFill: { height: "100%", backgroundColor: colors.accent },
  summaryStats: { flexDirection: "row", marginTop: spacing.md, gap: spacing.md },
  summaryStat: { flex: 1 },
  summaryStatLabel: { ...typography.small, color: "rgba(255,255,255,0.7)" },
  summaryStatValue: { ...typography.bodyLarge, color: colors.white, fontWeight: "700", marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.18)" },
  alertBox: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginHorizontal: spacing.lg, padding: spacing.md, backgroundColor: "#FEE2E2", borderRadius: radii.md, borderLeftWidth: 3, borderLeftColor: colors.danger },
  noticeBox: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginHorizontal: spacing.lg, padding: spacing.md, backgroundColor: "#E6F4EA", borderRadius: radii.md, borderLeftWidth: 3, borderLeftColor: colors.primary },
  alertContent: { flex: 1 },
  alertTitle: { ...typography.body, color: colors.danger, fontWeight: "700" },
  alertSubtitle: { ...typography.small, color: colors.stone600, marginTop: 2 },
  noticeTitle: { ...typography.body, color: colors.primary, fontWeight: "700" },
  noticeSubtitle: { ...typography.small, color: colors.stone600, marginTop: 2 },
  tabs: { flexDirection: "row", marginHorizontal: spacing.lg, marginTop: spacing.lg, backgroundColor: colors.white, borderRadius: radii.md, padding: 4, borderWidth: 1, borderColor: colors.stone100 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: radii.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.body, color: colors.stone600, fontWeight: "600" },
  tabTextActive: { color: colors.white },
  listSection: { padding: spacing.lg, gap: spacing.md },
  instCard: { flexDirection: "row", backgroundColor: colors.white, borderRadius: radii.md, overflow: "hidden", ...shadow.sm },
  instLeft: { width: 4 },
  instBody: { flex: 1, padding: spacing.md },
  instTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  instNumber: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.sm },
  statusPillText: { ...typography.label, fontSize: 9 },
  instAmount: { ...typography.h2, color: colors.primary, fontWeight: "700", marginTop: 4 },
  instMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  instMetaText: { ...typography.small, color: colors.stone500 },
  histCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.md, ...shadow.sm },
  histIcon: { width: 36, height: 36, borderRadius: radii.full, backgroundColor: colors.success, alignItems: "center", justifyContent: "center" },
  histBody: { flex: 1 },
  histTitle: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  histReceipt: { ...typography.small, color: colors.stone600, marginTop: 2 },
  histMeta: { ...typography.small, color: colors.stone400, marginTop: 2 },
  histRight: { alignItems: "flex-end", gap: 6 },
  histAmount: { ...typography.body, color: colors.primary, fontWeight: "700" },
  empty: { padding: spacing.xl, alignItems: "center", gap: spacing.sm },
  emptyTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700", marginTop: spacing.sm },
  emptyText: { ...typography.body, color: colors.stone500, textAlign: "center" },
  exploreBtn: { marginTop: spacing.sm, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 12, borderRadius: radii.md },
  exploreBtnText: { ...typography.body, color: colors.white, fontWeight: "700" },
});
