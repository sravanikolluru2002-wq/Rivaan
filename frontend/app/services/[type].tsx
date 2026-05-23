import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth-context";
import { colors, radii, spacing, typography } from "@/src/theme";
import { Button } from "@/src/components/Button";

export default function ServiceRequestScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const serviceType = decodeURIComponent(type as string);

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState(user?.phone || "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!date || !description || contact.length < 10) {
      Alert.alert("Required", "Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.requestService({
        service_type: serviceType,
        preferred_date: date,
        description,
        contact,
      });
      Alert.alert("Request Submitted", `Your ${serviceType} request has been received. Our team will contact you within 24 hours.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} testID="service-request-screen">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <TouchableOpacity testID="service-req-back" style={styles.headerBtn} onPress={() => router.back()}>
            <Feather name="x" size={22} color={colors.primaryDeepest} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{serviceType}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Feather name="tool" size={24} color={colors.primary} />
            </View>
            <Text style={styles.introTitle}>Request {serviceType}</Text>
            <Text style={styles.introText}>
              Tell us your requirements and we'll connect you with verified service partners.
            </Text>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Preferred Date *</Text>
            <TextInput
              testID="service-req-date"
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="e.g. 25 March 2026"
              placeholderTextColor={colors.stone400}
            />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              testID="service-req-description"
              style={[styles.input, { height: 120, textAlignVertical: "top" }]}
              value={description}
              onChangeText={setDescription}
              placeholder={`Describe your ${serviceType.toLowerCase()} needs...`}
              placeholderTextColor={colors.stone400}
              multiline
            />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              testID="service-req-contact"
              style={styles.input}
              value={contact}
              onChangeText={(t) => setContact(t.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor={colors.stone400}
            />
          </View>

          <Button title="Submit Request" onPress={handleSubmit} loading={submitting} testID="service-req-submit" style={{ marginTop: spacing.md }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.stone100 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.offWhite, alignItems: "center", justifyContent: "center" },
  headerTitle: { ...typography.h3, color: colors.primaryDeepest, fontWeight: "700" },
  scroll: { padding: spacing.lg, gap: spacing.md },
  intro: { alignItems: "center", gap: 8, marginBottom: spacing.md },
  introIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#E6F4EA", alignItems: "center", justifyContent: "center" },
  introTitle: { ...typography.h2, color: colors.primaryDeepest, fontWeight: "700", marginTop: spacing.sm },
  introText: { ...typography.body, color: colors.stone600, textAlign: "center", maxWidth: 280 },
  inputBlock: { gap: 6 },
  label: { ...typography.small, color: colors.stone600, fontWeight: "600" },
  input: { backgroundColor: colors.offWhite, borderWidth: 1, borderColor: colors.stone200, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 15, color: colors.stone900 },
});
