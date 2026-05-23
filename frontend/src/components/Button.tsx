import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle, TextStyle, GestureResponderEvent } from "react-native";
import { colors, radii, spacing, typography } from "@/src/theme";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
  textStyle,
  testID,
  icon,
  fullWidth = true,
  size = "md",
}: Props) {
  const isDisabled = disabled || loading;
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        sizeStyles.container,
        variantStyles.container,
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text style={[sizeStyles.text, variantStyles.text, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function getVariantStyles(variant: Variant): { container: ViewStyle; text: TextStyle } {
  switch (variant) {
    case "primary":
      return {
        container: { backgroundColor: colors.primary, borderWidth: 0 },
        text: { color: colors.white, fontWeight: "700" },
      };
    case "secondary":
      return {
        container: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.accent },
        text: { color: colors.accent, fontWeight: "600" },
      };
    case "accent":
      return {
        container: { backgroundColor: colors.accent, borderWidth: 0 },
        text: { color: colors.white, fontWeight: "700" },
      };
    case "ghost":
      return {
        container: { backgroundColor: "transparent", borderWidth: 0 },
        text: { color: colors.primary, fontWeight: "600" },
      };
    case "danger":
      return {
        container: { backgroundColor: colors.danger, borderWidth: 0 },
        text: { color: colors.white, fontWeight: "700" },
      };
  }
}

function getSizeStyles(size: "sm" | "md" | "lg"): { container: ViewStyle; text: TextStyle } {
  switch (size) {
    case "sm":
      return { container: { minHeight: 38, paddingHorizontal: spacing.md }, text: { ...typography.body, fontSize: 13 } };
    case "lg":
      return { container: { minHeight: 56, paddingHorizontal: spacing.lg }, text: { ...typography.bodyLarge, fontSize: 16 } };
    case "md":
    default:
      return { container: { minHeight: 50, paddingHorizontal: spacing.md }, text: { ...typography.body, fontSize: 15 } };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: { alignSelf: "stretch" },
  disabled: { opacity: 0.5 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { marginRight: 4 },
});
