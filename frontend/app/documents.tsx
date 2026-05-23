import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { colors, radii, spacing, typography, shadow } from "@/src/theme";

const TYPE_COLORS: Record<string, { bg: string; fg: string; icon: any }> = {
  Agreement: { bg: "#E6F4EA", fg: colors.primary, icon: "file-text" },
  Letter: { bg: colors.accentSoft, fg: colors.accentDark, icon: "mail" },
  Receipt: { bg: "#E0E7FF", fg: colors.info, icon: "credit-card" },
  KYC: { bg: "#FEF3C7", fg: "#D97706", icon: "user-check" },
  Approval: { bg: "#FCE7F3", fg: "#BE185D", icon: "check-circle" },
  Deed: { bg: "#F3E8FF", fg: "#7E22CE", icon: "award" },
};

export default function DocumentsScreen() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await api.documents();
        setDocs(d as any[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function download(d: any) {
    if (d.url) Linking.openURL(d.url).catch(() => Alert.alert("Cannot open", d.name));
    else Alert.alert("Downloaded", `${d.name} saved to your device.`);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="documents-screen">
      <View style={styles.header}>
        <TouchableOpacity testID="documents-back" style={styles.headerBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.primaryDeepest} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Document Locker</Text>
          <Text style={styles.headerSub}>Secure storage for property papers</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : docs.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="folder" size={56} color={colors.stone300} />
            <Text style={styles.emptyTitle}>No documents yet</Text>
            <Text style={styles.emptyText}>Your property documents will appear here once uploaded by the Rivan team.</Text>
          </View>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {docs.map((d) => {
              const styling = TYPE_COLORS[d.type] || { bg: colors.offWhite, fg: colors.primary, icon: "file" };
              return (
                <View key={d.id} style={styles.docCard} testID={`document-${d.id}`}>
                  <View style={[styles.docIcon, { backgroundColor: styling.bg }]}>
                    <Feather name={styling.icon} size={20} color={styling.fg} />
                  </View>
                  <View style={styles.docBody}>
                    <Text style={styles.docName} numberOfLines={1}>{d.name}</Text>
                    <Text style={styles.docMeta}>{d.type} · {d.size}</Text>
                  </View>
                  <View style={styles.docActions}>
                    <TouchableOpacity testID={`document-preview-${d.id}`} style={styles.docBtn} onPress={() => download(d)}>
                      <Feather name="eye" size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity testID={`document-download-${d.id}`} style={styles.docBtn} onPress={() => download(d)}>
                      <Feather name="download" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.secureBanner}>
          <Feather name="shield" size={16} color={colors.success} />
          <Text style={styles.secureText}>All documents are encrypted and secured for your access only.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.stone100 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  headerTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  headerSub: { ...typography.small, color: colors.stone500 },
  docCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, backgroundColor: colors.white, borderRadius: radii.md, ...shadow.sm },
  docIcon: { width: 44, height: 44, borderRadius: radii.md, alignItems: "center", justifyContent: "center" },
  docBody: { flex: 1 },
  docName: { ...typography.body, color: colors.primaryDeepest, fontWeight: "700" },
  docMeta: { ...typography.small, color: colors.stone500, marginTop: 2 },
  docActions: { flexDirection: "row", gap: 6 },
  docBtn: { width: 34, height: 34, borderRadius: radii.sm, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  empty: { padding: spacing.xl, alignItems: "center", gap: spacing.sm, marginTop: spacing.xl },
  emptyTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700", marginTop: spacing.md },
  emptyText: { ...typography.body, color: colors.stone500, textAlign: "center", maxWidth: 280 },
  secureBanner: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: spacing.lg, padding: spacing.md, backgroundColor: "#E6F4EA", borderRadius: radii.md },
  secureText: { flex: 1, ...typography.small, color: colors.primary, fontWeight: "600" },
});
