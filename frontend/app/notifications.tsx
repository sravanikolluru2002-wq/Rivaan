import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { colors, radii, spacing, typography, shadow } from "@/src/theme";

const TYPE_ICONS: Record<string, any> = {
  welcome: "smile",
  booking: "check-circle",
  payment: "credit-card",
  service: "tool",
  visit: "calendar",
  document: "file-text",
  project: "home",
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const d = await api.notifications();
      setItems(d as any[]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await api.readNotification(id).catch(() => {});
  }
  async function markAll() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await api.readAllNotifications().catch(() => {});
  }

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  const unread = items.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="notifications-screen">
      <View style={styles.header}>
        <TouchableOpacity testID="notifications-back" style={styles.headerBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.primaryDeepest} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unread > 0 ? <Text style={styles.headerSub}>{unread} unread</Text> : null}
        </View>
        {unread > 0 ? (
          <TouchableOpacity testID="notifications-mark-all" onPress={markAll}>
            <Text style={styles.markAllText}>Mark all</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : items.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="bell-off" size={56} color={colors.stone300} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {items.map((n) => (
              <TouchableOpacity
                key={n.id}
                testID={`notification-${n.id}`}
                style={[styles.card, !n.read && styles.cardUnread]}
                onPress={() => markRead(n.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.icon, !n.read && styles.iconUnread]}>
                  <Feather name={TYPE_ICONS[n.type] || "bell"} size={18} color={!n.read ? colors.white : colors.primary} />
                </View>
                <View style={styles.body}>
                  <Text style={[styles.title, !n.read && styles.titleUnread]} numberOfLines={1}>{n.title}</Text>
                  <Text style={styles.text} numberOfLines={2}>{n.body}</Text>
                  <Text style={styles.time}>{timeAgo(n.created_at)}</Text>
                </View>
                {!n.read ? <View style={styles.dot} /> : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.stone100 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  headerTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  headerSub: { ...typography.small, color: colors.accent, marginTop: 2, fontWeight: "600" },
  markAllText: { ...typography.body, color: colors.primary, fontWeight: "600" },
  card: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.white, borderRadius: radii.md, ...shadow.sm },
  cardUnread: { backgroundColor: "#FAFBFA", borderLeftWidth: 3, borderLeftColor: colors.accent },
  icon: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  iconUnread: { backgroundColor: colors.primary },
  body: { flex: 1 },
  title: { ...typography.body, color: colors.stone700, fontWeight: "600" },
  titleUnread: { color: colors.primaryDeepest, fontWeight: "700" },
  text: { ...typography.small, color: colors.stone500, marginTop: 2, lineHeight: 18 },
  time: { ...typography.small, color: colors.stone400, marginTop: 4, fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 6 },
  empty: { padding: spacing.xl, alignItems: "center", gap: spacing.sm, marginTop: spacing.xl },
  emptyText: { ...typography.body, color: colors.stone500, marginTop: spacing.md },
});
