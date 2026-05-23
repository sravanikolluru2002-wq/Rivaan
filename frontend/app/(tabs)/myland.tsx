import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { colors, radii, spacing, typography, shadow, formatINR } from "@/src/theme";

export default function MyLandScreen() {
  const router = useRouter();
  const [lands, setLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.myLand();
      setLands(data as any[]);
    } catch (e: any) {
      console.warn("myland", e?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <SafeAreaView style={styles.safe}><View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="myland-screen">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>My Land</Text>
          <Text style={styles.subheading}>Your owned & booked properties</Text>
        </View>

        {lands.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="map" size={64} color={colors.stone300} />
            <Text style={styles.emptyTitle}>No properties yet</Text>
            <Text style={styles.emptyText}>Explore our premium properties and book your dream plot.</Text>
            <TouchableOpacity
              testID="myland-browse-button"
              style={styles.exploreBtn}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.exploreBtnText}>Explore Properties</Text>
              <Feather name="arrow-right" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {lands.map((land) => (
              <View key={land.id} style={styles.card} testID={`myland-${land.id}`}>
                <View style={styles.cardHeader}>
                  <Image source={{ uri: land.property?.image }} style={styles.cardImage} />
                  <View style={styles.cardImageOverlay}>
                    <View style={[styles.statusPill, { backgroundColor: land.status === "sold" ? colors.sold : colors.booked }]}>
                      <Text style={styles.statusText}>{(land.status || "").toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.propertyName}>{land.property?.name}</Text>
                  <View style={styles.row}>
                    <Feather name="map-pin" size={12} color={colors.stone500} />
                    <Text style={styles.metaText}>{land.property?.location}</Text>
                  </View>

                  <View style={styles.detailsGrid}>
                    <Detail label="Plot No." value={land.plot_number} />
                    <Detail label="Size" value={land.size} />
                    <Detail label="Facing" value={land.facing} />
                    <Detail label="Survey" value={land.survey_number} />
                  </View>

                  <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>Plot Value</Text>
                    <Text style={styles.priceVal}>{formatINR(land.price)}</Text>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      testID={`myland-docs-${land.id}`}
                      style={styles.actionBtn}
                      onPress={() => router.push("/documents")}
                    >
                      <Feather name="file-text" size={16} color={colors.primary} />
                      <Text style={styles.actionText}>Documents</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      testID={`myland-services-${land.id}`}
                      style={styles.actionBtn}
                      onPress={() => router.push("/services")}
                    >
                      <Feather name="tool" size={16} color={colors.primary} />
                      <Text style={styles.actionText}>Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      testID={`myland-payments-${land.id}`}
                      style={styles.actionBtn}
                      onPress={() => router.push("/(tabs)/payments")}
                    >
                      <Feather name="credit-card" size={16} color={colors.primary} />
                      <Text style={styles.actionText}>Payments</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: spacing.lg, paddingBottom: 0 },
  heading: { ...typography.h1, color: colors.primaryDeepest, fontWeight: "700" },
  subheading: { ...typography.body, color: colors.stone500, marginTop: 4 },
  list: { padding: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, overflow: "hidden", ...shadow.md },
  cardHeader: { position: "relative" },
  cardImage: { width: "100%", height: 160 },
  cardImageOverlay: { position: "absolute", top: spacing.md, right: spacing.md },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.sm },
  statusText: { color: colors.white, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  cardBody: { padding: spacing.md, gap: spacing.sm },
  propertyName: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { ...typography.small, color: colors.stone600 },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm, gap: spacing.sm },
  detailItem: { flex: 1, minWidth: "45%", backgroundColor: colors.offWhite, padding: spacing.sm, borderRadius: radii.sm },
  detailLabel: { ...typography.small, color: colors.stone500, fontSize: 11 },
  detailValue: { ...typography.body, color: colors.primaryDeepest, fontWeight: "600", marginTop: 2 },
  priceBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.stone100 },
  priceLabel: { ...typography.body, color: colors.stone500 },
  priceVal: { ...typography.h3, color: colors.primary, fontWeight: "700" },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  actionBtn: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, paddingVertical: 10, backgroundColor: colors.offWhite, borderRadius: radii.md, borderWidth: 1, borderColor: colors.stone100 },
  actionText: { ...typography.small, color: colors.primary, fontWeight: "600" },
  empty: { padding: spacing.xl, alignItems: "center", gap: spacing.sm, marginTop: spacing.xl },
  emptyTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700", marginTop: spacing.md },
  emptyText: { ...typography.body, color: colors.stone500, textAlign: "center", maxWidth: 280 },
  exploreBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: 14, borderRadius: radii.md, marginTop: spacing.md },
  exploreBtnText: { ...typography.body, color: colors.white, fontWeight: "700" },
});
