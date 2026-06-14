import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth-context";
import { colors, radii, spacing, typography, shadow, formatINR } from "@/src/theme";

const LOCATIONS = ["Vizag", "Vijayawada"];

const CATEGORIES = [
  { key: "all", label: "All", icon: "grid" as const },
  { key: "Apartment", label: "Apartment", icon: "home" as const },
  { key: "Villa", label: "Villa", icon: "home" as const },
  { key: "Plot", label: "Plot", icon: "square" as const },
  { key: "Farm Lands", label: "Farm Lands", icon: "sun" as const },
  { key: "Commercial", label: "Commercial", icon: "briefcase" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("Vizag");
  const [locationOpen, setLocationOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const props = await api.listProperties({ category: category === "all" ? undefined : category, location, search });
      setProperties(props as any[]);
    } catch (e: any) {
      console.warn("home fetch", e?.message);
      setProperties([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }

    api.featured()
      .then((feat) => setFeatured(feat as any[]))
      .catch(() => setFeatured([]));

    api.notifications()
      .then((notifs) => setUnreadCount((notifs as any[]).filter((n) => !n.read).length))
      .catch(() => setUnreadCount(0));
  }, [category, location, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function onRefresh() {
    setRefreshing(true);
    fetchData();
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="home-screen">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            testID="home-location-button"
            style={styles.locationBtn}
            onPress={() => setLocationOpen(!locationOpen)}
          >
            <Feather name="map-pin" size={14} color={colors.accent} />
            <Text style={styles.locationText}>{location}</Text>
            <Feather name={locationOpen ? "chevron-up" : "chevron-down"} size={14} color={colors.stone600} />
          </TouchableOpacity>
          <Text style={styles.greeting}>Hi, {user?.name?.split(" ")[0] || "Guest"} 👋</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            testID="home-wishlist-button"
            style={styles.iconBtn}
            onPress={() => router.push("/wishlist")}
          >
            <Feather name="heart" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="home-notifications-button"
            style={styles.iconBtn}
            onPress={() => router.push("/notifications")}
          >
            <Feather name="bell" size={20} color={colors.primary} />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      {locationOpen ? (
        <View style={styles.locationDropdown} testID="home-location-dropdown">
          {LOCATIONS.map((l) => (
            <TouchableOpacity
              key={l}
              testID={`home-location-${l}`}
              style={styles.locationItem}
              onPress={() => {
                setLocation(l);
                setLocationOpen(false);
              }}
            >
              <Feather
                name={l === location ? "check" : "map-pin"}
                size={14}
                color={l === location ? colors.primary : colors.stone400}
              />
              <Text style={[styles.locationItemText, l === location && styles.locationItemActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            {/* Search */}
            <View style={styles.searchBox}>
              <Feather name="search" size={18} color={colors.stone400} />
              <TextInput
                testID="home-search-input"
                style={styles.searchInput}
                placeholder="Search properties, locations..."
                placeholderTextColor={colors.stone400}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
              {search ? (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Feather name="x" size={16} color={colors.stone400} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Featured Carousel */}
            {featured.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured Projects</Text>
                  <View style={styles.featuredTag}>
                    <Feather name="star" size={11} color={colors.accent} />
                    <Text style={styles.featuredTagText}>Premium</Text>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredScroll}
                  decelerationRate="fast"
                  snapToInterval={296}
                >
                  {featured.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      testID={`home-featured-${p.id}`}
                      style={styles.featuredCard}
                      onPress={() => router.push(`/property/${p.id}`)}
                      activeOpacity={0.9}
                    >
                      <Image source={{ uri: p.image }} style={styles.featuredImage} />
                      <View style={styles.featuredOverlay} />
                      <View style={styles.featuredContent}>
                        <View style={styles.categoryPillSmall}>
                          <Text style={styles.categoryPillTextSmall}>{p.category}</Text>
                        </View>
                        <Text style={styles.featuredName} numberOfLines={1}>
                          {p.name}
                        </Text>
                        <View style={styles.featuredMeta}>
                          <Feather name="map-pin" size={11} color={colors.white} />
                          <Text style={styles.featuredMetaText} numberOfLines={1}>
                            {p.location}
                          </Text>
                        </View>
                        <Text style={styles.featuredPrice}>From {formatINR(p.starting_price)}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    testID={`home-category-${cat.key}`}
                    style={[styles.categoryPill, category === cat.key && styles.categoryPillActive]}
                    onPress={() => setCategory(cat.key)}
                  >
                    <Feather
                      name={cat.icon}
                      size={14}
                      color={category === cat.key ? colors.white : colors.primary}
                    />
                    <Text style={[styles.categoryText, category === cat.key && styles.categoryTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                testID="home-quick-services"
                style={styles.quickAction}
                onPress={() => router.push("/services")}
              >
                <View style={[styles.quickIcon, { backgroundColor: colors.accentSoft }]}>
                  <Feather name="tool" size={18} color={colors.accent} />
                </View>
                <Text style={styles.quickLabel}>Services</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="home-quick-documents"
                style={styles.quickAction}
                onPress={() => router.push("/documents")}
              >
                <View style={[styles.quickIcon, { backgroundColor: "#E6F4EA" }]}>
                  <Feather name="folder" size={18} color={colors.primary} />
                </View>
                <Text style={styles.quickLabel}>Documents</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="home-quick-wishlist"
                style={styles.quickAction}
                onPress={() => router.push("/wishlist")}
              >
                <View style={[styles.quickIcon, { backgroundColor: "#FEE2E2" }]}>
                  <Feather name="heart" size={18} color={colors.danger} />
                </View>
                <Text style={styles.quickLabel}>Wishlist</Text>
              </TouchableOpacity>
              {user?.is_admin ? (
                <TouchableOpacity
                  testID="home-quick-admin"
                  style={styles.quickAction}
                  onPress={() => router.push("/admin")}
                >
                  <View style={[styles.quickIcon, { backgroundColor: "#FEF3C7" }]}>
                    <Feather name="settings" size={18} color="#D97706" />
                  </View>
                  <Text style={styles.quickLabel}>Admin</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {category === "all" ? `${location} Properties` : category} ({properties.length})
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => router.push(`/property/${item.id}`)}
            onAvailability={() => router.push(`/property/${item.id}/availability-map`)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View style={styles.empty}>
              <Feather name="inbox" size={48} color={colors.stone300} />
              <Text style={styles.emptyTitle}>No properties found</Text>
              <Text style={styles.emptyText}>Try another Vizag or Vijayawada location, or clear your search to see available projects.</Text>
              {(search || category !== "all") ? (
                <TouchableOpacity
                  testID="home-clear-filters"
                  style={styles.clearFiltersBtn}
                  onPress={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                >
                  <Text style={styles.clearFiltersText}>Clear Filters</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

function PropertyCard({ property, onPress, onAvailability }: { property: any; onPress: () => void; onAvailability: () => void }) {
  return (
    <TouchableOpacity
      testID={`home-property-${property.id}`}
      style={styles.propertyCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: property.image }} style={styles.propertyImage} />
      <View style={styles.propertyImageOverlay}>
        <View style={styles.availabilityBadge}>
          <View style={styles.availabilityDot} />
          <Text style={styles.availabilityText}>{property.availability || "Available"}</Text>
        </View>
        <View style={styles.categoryPillSmall}>
          <Text style={styles.categoryPillTextSmall}>{property.category}</Text>
        </View>
      </View>
      <View style={styles.propertyBody}>
        <Text style={styles.propertyName} numberOfLines={1}>
          {property.name}
        </Text>
        <View style={styles.propertyMeta}>
          <Feather name="map-pin" size={12} color={colors.stone500} />
          <Text style={styles.propertyMetaText} numberOfLines={1}>
            {property.location}
          </Text>
        </View>
        <View style={styles.propertyMeta}>
          <Feather name="maximize-2" size={12} color={colors.stone500} />
          <Text style={styles.propertyMetaText}>{property.size}</Text>
        </View>
        {property.highlights ? (
          <Text style={styles.highlights} numberOfLines={1}>
            ✦ {property.highlights}
          </Text>
        ) : null}
        <View style={styles.propertyFooter}>
          <View>
            <Text style={styles.priceLabel}>Starting at</Text>
            <Text style={styles.price}>{formatINR(property.starting_price)}</Text>
          </View>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
            <Feather name="arrow-right" size={14} color={colors.white} />
          </View>
        </View>
        <TouchableOpacity
          testID={`home-property-map-${property.id}`}
          style={styles.availabilityMapBtn}
          onPress={onAvailability}
          activeOpacity={0.85}
        >
          <Feather name="grid" size={14} color={colors.primary} />
          <Text style={styles.availabilityMapText}>View Availability Map</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
  },
  headerLeft: { flex: 1 },
  headerRight: { flexDirection: "row", gap: 8 },
  locationBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { ...typography.small, color: colors.stone900, fontWeight: "600" },
  greeting: { ...typography.h4, color: colors.primaryDeepest, marginTop: 2 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.offWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "700" },
  locationDropdown: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radii.md,
    padding: spacing.sm,
    ...shadow.md,
  },
  locationItem: { flexDirection: "row", alignItems: "center", gap: 8, padding: spacing.sm },
  locationItemText: { ...typography.body, color: colors.stone700 },
  locationItemActive: { color: colors.primary, fontWeight: "600" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.stone100,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.stone900 },
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  featuredTag: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full },
  featuredTagText: { ...typography.label, color: colors.accentDark, fontSize: 10 },
  featuredScroll: { gap: spacing.md, paddingRight: spacing.lg },
  featuredCard: { width: 280, height: 200, borderRadius: radii.lg, overflow: "hidden", ...shadow.md },
  featuredImage: { width: "100%", height: "100%", position: "absolute" },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,47,15,0.45)" },
  featuredContent: { flex: 1, padding: spacing.md, justifyContent: "flex-end", gap: 4 },
  featuredName: { ...typography.h3, color: colors.white, fontWeight: "700", marginTop: 4 },
  featuredMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  featuredMetaText: { ...typography.small, color: colors.white },
  featuredPrice: { ...typography.bodyLarge, color: colors.accentLight, fontWeight: "700", marginTop: 2 },
  categoryScroll: { gap: spacing.sm, paddingRight: spacing.lg },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.stone200,
  },
  categoryPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { ...typography.body, color: colors.primary, fontWeight: "600" },
  categoryTextActive: { color: colors.white },
  categoryPillSmall: { backgroundColor: "rgba(255,255,255,0.92)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.sm, alignSelf: "flex-start" },
  categoryPillTextSmall: { ...typography.label, color: colors.primary, fontSize: 9 },
  quickActions: { flexDirection: "row", justifyContent: "space-around", marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  quickAction: { alignItems: "center", gap: 6 },
  quickIcon: { width: 52, height: 52, borderRadius: radii.md, alignItems: "center", justifyContent: "center" },
  quickLabel: { ...typography.small, color: colors.stone700, fontWeight: "600" },
  propertyCard: { backgroundColor: colors.white, marginHorizontal: spacing.lg, marginBottom: spacing.md, borderRadius: radii.lg, overflow: "hidden", ...shadow.sm },
  propertyImage: { width: "100%", height: 180 },
  propertyImageOverlay: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, flexDirection: "row", justifyContent: "space-between" },
  availabilityBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(16,185,129,0.95)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.sm },
  availabilityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  availabilityText: { ...typography.label, color: colors.white, fontSize: 9 },
  propertyBody: { padding: spacing.md, gap: 4 },
  propertyName: { ...typography.h4, color: colors.primaryDeepest, fontWeight: "700" },
  propertyMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  propertyMetaText: { ...typography.small, color: colors.stone600 },
  highlights: { ...typography.small, color: colors.accent, fontWeight: "600", marginTop: 4 },
  propertyFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm },
  priceLabel: { ...typography.small, color: colors.stone500 },
  price: { ...typography.h4, color: colors.primary, fontWeight: "700" },
  viewBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radii.md },
  viewBtnText: { ...typography.body, color: colors.white, fontWeight: "700" },
  availabilityMapBtn: { marginTop: spacing.sm, minHeight: 42, borderRadius: radii.md, borderWidth: 1, borderColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#E6F4EA" },
  availabilityMapText: { ...typography.small, color: colors.primary, fontWeight: "700" },
  empty: { padding: spacing.xl, alignItems: "center", gap: spacing.sm },
  emptyTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  emptyText: { ...typography.body, color: colors.stone500, textAlign: "center", maxWidth: 280 },
  clearFiltersBtn: { marginTop: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radii.md, backgroundColor: colors.primary },
  clearFiltersText: { ...typography.small, color: colors.white, fontWeight: "700" },
});
