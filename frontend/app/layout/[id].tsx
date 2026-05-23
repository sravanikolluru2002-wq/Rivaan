import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { api } from "@/src/api";
import { colors, radii, spacing, typography, shadow, plotStatusColor, plotStatusLabel, formatINR, formatINRFull } from "@/src/theme";
import { Button } from "@/src/components/Button";

const PLOT_SIZE = 76;

export default function LayoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [plots, setPlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        const [p, pl] = await Promise.all([api.getProperty(id as string), api.getPropertyPlots(id as string)]);
        setProperty(p);
        setPlots(pl as any[]);
      } catch (e: any) {
        Alert.alert("Error", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }

  const cols = Math.max(...plots.map((p) => p.col)) + 1;
  const rows = Math.max(...plots.map((p) => p.row)) + 1;
  const counts = {
    available: plots.filter((p) => p.status === "available").length,
    reserved: plots.filter((p) => p.status === "reserved").length,
    booked: plots.filter((p) => p.status === "booked").length,
    sold: plots.filter((p) => p.status === "sold").length,
  };

  const visiblePlots = filter === "all" ? plots : plots.filter((p) => p.status === filter);

  function openWhatsApp(p: any) {
    const text = `Hi, I'm interested in plot ${p.plot_number} at ${property.name}.`;
    Linking.openURL(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="layout-screen">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity testID="layout-back-button" style={styles.headerBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.primaryDeepest} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{property?.name}</Text>
          <Text style={styles.headerSub}>Interactive Plot Layout</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={() => Alert.alert("Help", "Tap on any plot to view details and book.\n\n🟢 Green: Available\n🟡 Yellow: Reserved\n🔵 Blue: Booked\n🔴 Red: Sold")}>
          <Feather name="info" size={20} color={colors.primaryDeepest} />
        </TouchableOpacity>
      </View>

      {/* Legend & Filter */}
      <View style={styles.legendRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legendScroll}>
          <LegendPill label="All" count={plots.length} color={colors.stone400} active={filter === "all"} onPress={() => setFilter("all")} testID="layout-filter-all" />
          <LegendPill label="Available" count={counts.available} color={colors.available} active={filter === "available"} onPress={() => setFilter("available")} testID="layout-filter-available" />
          <LegendPill label="Reserved" count={counts.reserved} color={colors.reserved} active={filter === "reserved"} onPress={() => setFilter("reserved")} testID="layout-filter-reserved" />
          <LegendPill label="Booked" count={counts.booked} color={colors.booked} active={filter === "booked"} onPress={() => setFilter("booked")} testID="layout-filter-booked" />
          <LegendPill label="Sold" count={counts.sold} color={colors.sold} active={filter === "sold"} onPress={() => setFilter("sold")} testID="layout-filter-sold" />
        </ScrollView>
      </View>

      {/* Layout Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ScrollView horizontal contentContainerStyle={styles.hScroll}>
          <View>
            {/* Top road */}
            <View style={[styles.road, { width: cols * (PLOT_SIZE + 6) }]}>
              <Text style={styles.roadText}>● Main Road (40 ft) ●</Text>
            </View>
            <View style={styles.gridRow}>
              <View style={[styles.sideRoad, { height: rows * (PLOT_SIZE + 6) }]}>
                <Text style={styles.sideRoadText}>Internal Road</Text>
              </View>
              <View>
                {Array.from({ length: rows }).map((_, r) => (
                  <View key={r} style={styles.plotRow}>
                    {Array.from({ length: cols }).map((_, c) => {
                      const plot = plots.find((p) => p.row === r && p.col === c);
                      if (!plot) return <View key={c} style={[styles.plotCell, { backgroundColor: "transparent" }]} />;
                      const isVisible = filter === "all" || plot.status === filter;
                      return (
                        <TouchableOpacity
                          key={plot.id}
                          testID={`layout-plot-${plot.id}`}
                          style={[
                            styles.plotCell,
                            {
                              backgroundColor: plotStatusColor(plot.status),
                              opacity: isVisible ? 1 : 0.25,
                            },
                          ]}
                          onPress={() => setSelected(plot)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.plotNumber}>{plot.plot_number.replace("P-", "").replace("L-", "")}</Text>
                          <Text style={styles.plotSize}>{plot.size_sqy}sqy</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
            {/* Bottom park */}
            <View style={[styles.park, { width: cols * (PLOT_SIZE + 6) + 28 }]}>
              <Feather name="sun" size={14} color={colors.primaryLight} />
              <Text style={styles.parkText}>Central Park · Open Space</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.helperBox}>
          <Feather name="zoom-in" size={14} color={colors.stone500} />
          <Text style={styles.helperText}>Scroll horizontally to view full layout. Tap any plot for details.</Text>
        </View>
      </ScrollView>

      {/* Plot Detail Modal */}
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <TouchableOpacity activeOpacity={1} style={styles.modalBg} onPress={() => setSelected(null)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalPlot}>Plot {selected?.plot_number}</Text>
                <Text style={styles.modalProperty}>{property?.name}</Text>
              </View>
              <View style={[styles.modalStatus, { backgroundColor: plotStatusColor(selected?.status) }]}>
                <Text style={styles.modalStatusText}>{plotStatusLabel(selected?.status)}</Text>
              </View>
            </View>

            <View style={styles.modalGrid}>
              <ModalInfo icon="hash" label="Survey No." value={selected?.survey_number} />
              <ModalInfo icon="maximize-2" label="Size" value={selected?.size} />
              <ModalInfo icon="compass" label="Facing" value={selected?.facing} />
              <ModalInfo icon="tag" label="Price" value={selected ? formatINR(selected.price) : ""} accent />
            </View>

            <View style={styles.modalPriceRow}>
              <Text style={styles.modalPriceLabel}>Total Price</Text>
              <Text style={styles.modalPriceValue}>{selected ? formatINRFull(selected.price) : ""}</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity testID="plot-modal-whatsapp" style={styles.modalIconBtn} onPress={() => openWhatsApp(selected)}>
                <Feather name="message-circle" size={20} color="#25D366" />
              </TouchableOpacity>
              <TouchableOpacity
                testID="plot-modal-visit"
                style={[styles.modalIconBtn, { backgroundColor: colors.accentSoft }]}
                onPress={() => { setSelected(null); router.push(`/centre/site-${id}`); }}
              >
                <Feather name="calendar" size={20} color={colors.accent} />
              </TouchableOpacity>
              {(selected?.status === "available" || selected?.status === "reserved") ? (
                <TouchableOpacity
                  testID="plot-modal-book"
                  style={styles.modalBookBtn}
                  onPress={() => {
                    setSelected(null);
                    router.push(`/booking/${selected.id}`);
                  }}
                >
                  <Text style={styles.modalBookText}>Book This Plot</Text>
                  <Feather name="arrow-right" size={16} color={colors.white} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.modalBookBtn, { backgroundColor: colors.stone300 }]}>
                  <Feather name="lock" size={16} color={colors.stone600} />
                  <Text style={[styles.modalBookText, { color: colors.stone600 }]}>{plotStatusLabel(selected?.status)}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function LegendPill({ label, count, color, active, onPress, testID }: { label: string; count: number; color: string; active: boolean; onPress: () => void; testID: string }) {
  return (
    <TouchableOpacity testID={testID} style={[styles.legendPill, active && styles.legendPillActive]} onPress={onPress}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, active && styles.legendLabelActive]}>{label}</Text>
      <View style={[styles.legendCount, active && styles.legendCountActive]}>
        <Text style={[styles.legendCountText, active && styles.legendCountTextActive]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ModalInfo({ icon, label, value, accent }: { icon: any; label: string; value?: string; accent?: boolean }) {
  return (
    <View style={styles.modalInfo}>
      <Feather name={icon} size={14} color={accent ? colors.accent : colors.primary} />
      <View>
        <Text style={styles.modalInfoLabel}>{label}</Text>
        <Text style={[styles.modalInfoValue, accent && { color: colors.accent }]}>{value || "-"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.stone100 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1 },
  headerTitle: { ...typography.h4, color: colors.primaryDeepest, fontWeight: "700" },
  headerSub: { ...typography.small, color: colors.stone500 },
  legendRow: { backgroundColor: colors.white, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.stone100 },
  legendScroll: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  legendPill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.full, backgroundColor: colors.offWhite, borderWidth: 1, borderColor: colors.stone100 },
  legendPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { ...typography.small, color: colors.stone700, fontWeight: "600" },
  legendLabelActive: { color: colors.white },
  legendCount: { minWidth: 22, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  legendCountActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  legendCountText: { fontSize: 10, fontWeight: "700", color: colors.primary },
  legendCountTextActive: { color: colors.white },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.md, alignItems: "center" },
  hScroll: { padding: spacing.sm },
  road: { height: 28, backgroundColor: colors.stone700, alignItems: "center", justifyContent: "center", borderRadius: radii.sm, marginLeft: 28, marginBottom: 6 },
  roadText: { ...typography.label, color: colors.stone200, fontSize: 9 },
  gridRow: { flexDirection: "row" },
  sideRoad: { width: 22, marginRight: 6, backgroundColor: colors.stone700, borderRadius: radii.sm, alignItems: "center", justifyContent: "center" },
  sideRoadText: { ...typography.label, color: colors.stone200, fontSize: 8, transform: [{ rotate: "-90deg" }], width: 80 },
  plotRow: { flexDirection: "row", gap: 6, marginBottom: 6 },
  plotCell: { width: PLOT_SIZE, height: PLOT_SIZE, borderRadius: radii.sm, alignItems: "center", justifyContent: "center", padding: 4, ...shadow.sm },
  plotNumber: { color: colors.white, fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
  plotSize: { color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: "600" },
  park: { height: 32, backgroundColor: "#E6F4EA", borderRadius: radii.sm, marginTop: 6, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  parkText: { ...typography.small, color: colors.primaryLight, fontWeight: "600" },
  helperBox: { flexDirection: "row", alignItems: "center", gap: 6, padding: spacing.md, marginTop: spacing.md, backgroundColor: colors.white, borderRadius: radii.md, marginHorizontal: spacing.lg },
  helperText: { ...typography.small, color: colors.stone500, flex: 1 },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, padding: spacing.lg, gap: spacing.md },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.stone200, alignSelf: "center" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalPlot: { ...typography.h1, color: colors.primaryDeepest, fontWeight: "700" },
  modalProperty: { ...typography.small, color: colors.stone500 },
  modalStatus: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.sm },
  modalStatusText: { color: colors.white, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  modalGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  modalInfo: { flexBasis: "47%", flexDirection: "row", alignItems: "center", gap: 8, padding: spacing.sm, backgroundColor: colors.offWhite, borderRadius: radii.md },
  modalInfoLabel: { ...typography.small, color: colors.stone500, fontSize: 11 },
  modalInfoValue: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  modalPriceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.md, backgroundColor: colors.primary, borderRadius: radii.md },
  modalPriceLabel: { ...typography.body, color: "rgba(255,255,255,0.8)", fontWeight: "600" },
  modalPriceValue: { ...typography.h2, color: colors.white, fontWeight: "700" },
  modalActions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  modalIconBtn: { width: 48, height: 48, borderRadius: radii.md, backgroundColor: "#E6F9EE", alignItems: "center", justifyContent: "center" },
  modalBookBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, backgroundColor: colors.primary, borderRadius: radii.md },
  modalBookText: { ...typography.body, color: colors.white, fontWeight: "700" },
});
