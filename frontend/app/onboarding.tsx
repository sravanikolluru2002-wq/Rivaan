import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { api } from "@/src/api";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/auth-context";
import { colors, radii, shadow, spacing, typography } from "@/src/theme";

const LOCATION_OPTIONS = ["Vizag", "Vijayawada"];
const PROPERTY_OPTIONS = ["Plot", "Villa", "Apartment", "Commercial"];
const PURPOSE_OPTIONS = ["Investment", "Own use", "Business", "Not sure"];
const TIMELINE_OPTIONS = ["Immediately", "1-3 months", "3-6 months", "Just exploring"];
const CONTACT_OPTIONS = ["Call", "WhatsApp", "Email"];

type Answers = {
  full_name: string;
  location_preference: string;
  property_interest: string;
  budget_range: string;
  buying_purpose: string;
  timeline: string;
  preferred_contact_method: string;
  notes: string;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [answers, setAnswers] = useState<Answers>({
    full_name: user?.name?.startsWith("User-") || user?.name?.startsWith("Dev User") ? "" : user?.name || "",
    location_preference: "",
    property_interest: "",
    budget_range: "",
    buying_purpose: "",
    timeline: "",
    preferred_contact_method: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const canSave = !!answers.full_name.trim() &&
    !!answers.location_preference &&
    !!answers.property_interest &&
    !!answers.budget_range.trim() &&
    !!answers.buying_purpose &&
    !!answers.timeline &&
    !!answers.preferred_contact_method;

  function setField(key: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    if (!canSave) {
      Alert.alert("Almost done", "Please complete all required fields.");
      return;
    }

    setSaving(true);
    try {
      await api.saveOnboarding({
        ...answers,
        full_name: answers.full_name.trim(),
        budget_range: answers.budget_range.trim(),
        notes: answers.notes.trim(),
      });
      await refresh();
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Could not save", e.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} testID="onboarding-screen">
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Customer preferences</Text>
          <Text style={styles.title}>Tell us what you are looking for</Text>
          <Text style={styles.subtitle}>This helps the Rivan team show the right properties and follow up the way you prefer.</Text>
        </View>

        <View style={styles.form}>
          <FieldLabel label="Full name" />
          <TextInput
            testID="onboarding-full-name"
            style={styles.input}
            value={answers.full_name}
            onChangeText={(value) => setField("full_name", value)}
            placeholder="Enter your full name"
            placeholderTextColor={colors.stone400}
          />

          <OptionGroup
            label="Location preference"
            options={LOCATION_OPTIONS}
            value={answers.location_preference}
            onChange={(value) => setField("location_preference", value)}
          />

          <OptionGroup
            label="Property interest"
            options={PROPERTY_OPTIONS}
            value={answers.property_interest}
            onChange={(value) => setField("property_interest", value)}
          />

          <FieldLabel label="Budget range" />
          <TextInput
            testID="onboarding-budget"
            style={styles.input}
            value={answers.budget_range}
            onChangeText={(value) => setField("budget_range", value)}
            placeholder="e.g. 25L - 50L"
            placeholderTextColor={colors.stone400}
          />

          <OptionGroup
            label="Buying purpose"
            options={PURPOSE_OPTIONS}
            value={answers.buying_purpose}
            onChange={(value) => setField("buying_purpose", value)}
          />

          <OptionGroup
            label="Timeline"
            options={TIMELINE_OPTIONS}
            value={answers.timeline}
            onChange={(value) => setField("timeline", value)}
          />

          <OptionGroup
            label="Preferred contact method"
            options={CONTACT_OPTIONS}
            value={answers.preferred_contact_method}
            onChange={(value) => setField("preferred_contact_method", value)}
          />

          <FieldLabel label="Notes" optional />
          <TextInput
            testID="onboarding-notes"
            style={[styles.input, styles.notes]}
            value={answers.notes}
            onChangeText={(value) => setField("notes", value)}
            placeholder="Anything else the team should know?"
            placeholderTextColor={colors.stone400}
            multiline
          />

          <Button
            testID="onboarding-save"
            title="Continue to Home"
            onPress={handleSave}
            loading={saving}
            disabled={!canSave}
            style={styles.submit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FieldLabel({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <Text style={styles.label}>
      {label}{optional ? <Text style={styles.optional}> optional</Text> : null}
    </Text>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.optionBlock}>
      <FieldLabel label={label} />
      <View style={styles.options}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <TouchableOpacity
              key={option}
              testID={`onboarding-${label.toLowerCase().replace(/\s+/g, "-")}-${option.toLowerCase().replace(/\s+/g, "-")}`}
              activeOpacity={0.85}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onChange(option)}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.lg },
  eyebrow: { ...typography.label, color: colors.accent, marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.primaryDeepest, fontWeight: "700" },
  subtitle: { ...typography.body, color: colors.stone600, marginTop: spacing.sm },
  form: { gap: spacing.md, backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.md, ...shadow.sm },
  label: { ...typography.small, color: colors.primaryDeepest, fontWeight: "700" },
  optional: { color: colors.stone400, fontWeight: "400" },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.stone200,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.primaryDeepest,
    backgroundColor: colors.white,
  },
  notes: { minHeight: 92, textAlignVertical: "top" },
  optionBlock: { gap: spacing.sm },
  options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.md,
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.stone200,
  },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { ...typography.small, color: colors.stone700, fontWeight: "600" },
  optionTextSelected: { color: colors.white },
  submit: { marginTop: spacing.sm },
});
