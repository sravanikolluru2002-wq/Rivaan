import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth-context";
import { colors, formatINRFull, plotStatusColor, plotStatusLabel, radii, shadow, spacing, typography } from "@/src/theme";

const STATUS_FILTERS = ["All", "Available", "Reserved", "Sold Out", "Coming Soon"];

function unitTypeForCategory(category: string) {
  switch (category) {
    case "Apartment": return "Flat";
    case "Villa": return "Villa";
    case "Farm Lands": return "Farm Parcel";
    case "Commercial": return "Shop / Office";
    default: return "Plot";
  }
}

export default function AvailabilityMapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [prop, unitRows] = await Promise.all([
          api.getProperty(id as string),
          api.getPropertyUnits(id as string),
        ]);
        setProperty(prop);
        setUnits(unitRows as any[]);
      } catch (e: any) {
        Alert.alert("Could not load availability", e.message || "Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const filteredUnits = useMemo(() => {
    if (status === "All") return units;
    return units.filter((unit) => plotStatusLabel(unit.status) === status);
  }, [status, units]);

  const groupedUnits = useMemo(() => {
    const groups = new Map<string, any[]>();
    filteredUnits.forEach((unit) => {
      const label = unit.block
        ? `${unit.block}${unit.floor ? ` · Floor ${unit.floor}` : ""}`
        : unit.floor
          ? `Floor ${unit.floor}`
          : unit.row != null
            ? `Block ${Number(unit.row) + 1}`
            : "Availability";
      groups.set(label, [...(groups.get(label) || []), unit]);
    });
    return Array.from(groups.entries());
  }, [filteredUnits]);

  async function submitUnitEnquiry(unit: any) {
    const phone = (user?.phone || "").replace(/\D/g, "").slice(-10);
    if (!user?.name || phone.length !== 10) {
      Alert.alert("Contact details needed", "Please update your profile with name and phone before sending an enquiry.");
      return;
    }

    setSubmitting(true);
    try {
      const action = plotStatusLabel(unit.status) === "Sold Out" ? "join the waitlist for" : "enquire about";
      const res = await api.submitPropertyEnquiry({
        property_id: id as string,
        name: user.name,
        phone,
        message: `I want to ${action} ${unit.unit_no} (${unitTypeForCategory(property?.category || "")}) at ${property?.name}. Status: ${plotStatusLabel(unit.status)}.`,
      });
      Alert.alert("Request sent", res.message || "Our team will contact you shortly.");
      setSelected(null);
    } catch (e: any) {
      Alert.alert("Could not send request", e.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }

  const unitType = unitTypeForCategory(property?.category || "");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="availability-map-screen">
      <View style={styles.header}>
        <TouchableOpacity testID="availability-back-button" style={styles.headerBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.primaryDeepest} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>{property?.name || "Availability Map"}</Text>
          <Text style={styles.subtitle}>{unitType} availability · {property?.location}</Text>
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STATUS_FILTERS.map((item) => {
            const count = item === "All" ? units.length : units.filter((unit) => plotStatusLabel(unit.status) === item).length;
            return (
              <TouchableOpacity
                key={item}
                testID={`availability-filter-${item}`}
                style={[styles.filterPill, status === item && styles.filterPillActive]}
                onPress={() => setStatus(item)}
              >
                <View style={[styles.statusDot, { backgroundColor: item === "All" ? colors.stone400 : plotStatusColor(item) }]} />
                <Text style={[styles.filterText, status === item && styles.filterTextActive]}>{item}</Text>
                <Text style={[styles.filterCount, status === item && styles.filterTextActive]}>{count}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {groupedUnits.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="grid" size={38} color={colors.stone300} />
            <Text style={styles.emptyTitle}>No units found</Text>
            <Text style={styles.emptyText}>Try another status filter to view this property availability.</Text>
          </View>
        ) : (
          groupedUnits.map(([group, rows]) => (
            <View key={group} style={styles.group}>
              <Text style={styles.groupTitle}>{group}</Text>
              <View style={styles.grid}>
                {rows.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    testID={`availability-unit-${unit.id}`}
                    style={[styles.unitCell, { borderColor: plotStatusColor(unit.status) }]}
                    onPress={() => setSelected(unit)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.unitColor, { backgroundColor: plotStatusColor(unit.status) }]} />
                    <Text style={styles.unitNo} numberOfLines={1}>{unit.unit_no}</Text>
                    <Text style={styles.unitSize} numberOfLines={1}>{unit.size}</Text>
                    <Text style={styles.unitStatus} numberOfLines={1}>{plotStatusLabel(unit.status)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setSelected(null)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{unitType} {selected?.unit_no}</Text>
                <Text style={styles.modalSub}>{property?.name}</Text>
              </View>
              <View style={[styles.modalStatus, { backgroundColor: plotStatusColor(selected?.status) }]}>
                <Text style={styles.modalStatusText}>{plotStatusLabel(selected?.status)}</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <Detail label="Category" value={unitType} icon="tag" />
              <Detail label="Size" value={selected?.size} icon="maximize-2" />
              <Detail label="Facing" value={selected?.facing} icon="compass" />
              <Detail label="Block" value={selected?.block || "-"} icon="layers" />
              <Detail label="Floor" value={selected?.floor ? String(selected.floor) : "-"} icon="bar-chart-2" />
              <Detail label="Price" value={selected ? formatINRFull(selected.price) : "-"} icon="credit-card" />
            </View>

            <TouchableOpacity
              testID="availability-enquiry-button"
              style={[styles.enquiryBtn, submitting && styles.enquiryBtnDisabled]}
              onPress={() => selected && submitUnitEnquiry(selected)}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Text style={styles.enquiryBtnText}>
                    {plotStatusLabel(selected?.status) === "Sold Out" ? "Join Waitlist" : "Send Enquiry"}
                  </Text>
                  <Feather name="send" size={15} color={colors.white} />
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function Detail({ label, value, icon }: { label: string; value?: string; icon: any }) {
  return (
    <View style={styles.detailItem}>
      <Feather name={icon} size={14} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>{value || "-"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  loader: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.stone100 },
  headerBtn: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  headerText: { flex: 1 },
  title: { ...typography.h4, color: colors.primaryDeepest, fontWeight: "700" },
  subtitle: { ...typography.small, color: colors.stone500 },
  filterBar: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.stone100, paddingVertical: spacing.sm },
  filterScroll: { gap: spacing.sm, paddingHorizontal: spacing.md },
  filterPill: { minHeight: 36, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.sm, borderRadius: radii.full, backgroundColor: colors.offWhite, borderWidth: 1, borderColor: colors.stone100 },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  filterText: { ...typography.small, color: colors.stone700, fontWeight: "700" },
  filterTextActive: { color: colors.white },
  filterCount: { ...typography.small, color: colors.stone500, fontWeight: "700" },
  body: { flex: 1 },
  bodyContent: { padding: spacing.md, paddingBottom: spacing.xl },
  group: { marginBottom: spacing.lg },
  groupTitle: { ...typography.label, color: colors.stone600, marginBottom: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  unitCell: { width: 104, minHeight: 104, borderRadius: radii.md, borderWidth: 1.5, backgroundColor: colors.white, padding: spacing.sm, ...shadow.sm },
  unitColor: { width: 24, height: 4, borderRadius: 2, marginBottom: spacing.sm },
  unitNo: { ...typography.body, color: colors.primaryDeepest, fontWeight: "800" },
  unitSize: { ...typography.small, color: colors.stone600, marginTop: 2 },
  unitStatus: { ...typography.small, color: colors.stone500, fontWeight: "700", marginTop: "auto" },
  empty: { alignItems: "center", padding: spacing.xl, gap: spacing.sm },
  emptyTitle: { ...typography.h4, color: colors.primaryDeepest, fontWeight: "700" },
  emptyText: { ...typography.body, color: colors.stone500, textAlign: "center" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, padding: spacing.lg, gap: spacing.md, maxHeight: "82%" },
  modalHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: colors.stone200, alignSelf: "center" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  modalTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  modalSub: { ...typography.small, color: colors.stone500 },
  modalStatus: { alignSelf: "flex-start", paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radii.full },
  modalStatusText: { ...typography.small, color: colors.white, fontWeight: "800" },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  detailItem: { flexBasis: "47%", minHeight: 58, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.offWhite, borderRadius: radii.md, padding: spacing.sm },
  detailLabel: { ...typography.small, color: colors.stone500 },
  detailValue: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  enquiryBtn: { minHeight: 50, borderRadius: radii.md, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  enquiryBtnDisabled: { opacity: 0.65 },
  enquiryBtnText: { ...typography.body, color: colors.white, fontWeight: "800" },
});
