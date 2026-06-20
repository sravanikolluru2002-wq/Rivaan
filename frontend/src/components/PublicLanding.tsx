import React, { useMemo, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors, shadow, spacing, typography } from "@/src/theme";

const HERO_FALLBACK = require("../../assets/images/landing-hero.jpg");

const WEB_FRAME_SOURCES = Array.from({ length: 136 }, (_, index) => {
  const frame = String(index + 1).padStart(3, "0");
  return `/landing/frames/ezgif-frame-${frame}.png`;
});

const NAV_LINKS = ["Home", "About", "Services", "Contact"];

const PLATFORM_FEATURES = [
  {
    title: "Discovery that leads somewhere",
    text: "Customers can move from cinematic first impression to actual property browsing, layout review, booking interest, and visit requests.",
  },
  {
    title: "Customer and agent continuity",
    text: "The same enquiry can continue inside the agent workspace through site visits, bookings, leads, tasks, and CRM activities.",
  },
  {
    title: "Made for premium real estate ops",
    text: "The product is shaped around inventory visibility, customer ownership, visit planning, and smoother conversion handling.",
  },
];

const WORKFLOW_COLUMNS = [
  {
    heading: "Customer side",
    items: ["Project discovery", "Layout availability", "Booking request", "Profile and services"],
  },
  {
    heading: "Agent side",
    items: ["Site visit scheduling", "Booking status tracking", "Lead desk", "CRM tasks and activity"],
  },
];

export default function PublicLanding() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768;
  const [scrollY, setScrollY] = useState(0);

  const heroHeight = Math.max(height, isDesktop ? 860 : 720);
  const sequenceScrollRange = heroHeight * 4.2;

  const frameIndex = useMemo(() => {
    if (Platform.OS !== "web") return 0;
    const progress = Math.min(1, Math.max(0, scrollY / sequenceScrollRange));
    return Math.min(WEB_FRAME_SOURCES.length - 1, Math.round(progress * (WEB_FRAME_SOURCES.length - 1)));
  }, [scrollY, sequenceScrollRange]);

  const backgroundSource = Platform.OS === "web"
    ? { uri: WEB_FRAME_SOURCES[frameIndex] }
    : HERO_FALLBACK;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.fixedStage}>
        <Image source={backgroundSource} style={styles.fixedImage} resizeMode="cover" />
        <View style={styles.topShade} />
        <View style={styles.centerShade} />
        <View style={styles.bottomShade} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.navbar, isDesktop && styles.navbarDesktop]}>
          <View style={styles.logoGroup}>
            <View style={styles.logoBadge}>
              <Feather name="home" size={21} color={colors.white} />
            </View>
            <Text style={styles.logoWordmark}>RIVAN</Text>
          </View>

          <View style={styles.navLinks}>
            {NAV_LINKS.map((item) => (
              <Text key={item} style={[styles.navLink, !isTablet && item !== "Home" ? styles.navLinkHidden : null]}>
                {item}
              </Text>
            ))}
          </View>
        </View>

        <View style={[styles.hero, { minHeight: heroHeight }]}>
          <View style={styles.heroCenter}>
            <Text style={[styles.heroTitle, isDesktop ? styles.heroTitleDesktop : null]}>RIVAN</Text>
            <Text style={[styles.heroSubtitle, isDesktop ? styles.heroSubtitleDesktop : null]}>
              CUSTOMER AND AGENT REAL ESTATE WORKSPACE
            </Text>
            <Text style={styles.heroBody}>
              Browse projects, inspect availability, raise booking interest, schedule site visits, and continue the same customer journey inside the sales CRM.
            </Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => router.push("/login")}>
              <Text style={styles.heroButtonText}>ENTER</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scrollCue}>
            <Text style={styles.scrollCueText}>SCROLL</Text>
            <View style={styles.scrollCueLine} />
          </View>
        </View>

        <View style={[styles.sectionWrap, isDesktop && styles.sectionWrapDesktop]}>
          <View style={styles.sectionIntro}>
            <Text style={styles.sectionEyebrow}>ABOUT</Text>
            <Text style={styles.sectionTitle}>A landing page that connects to the real product flow.</Text>
          </View>

          <View style={[styles.featureGrid, isDesktop && styles.featureGridDesktop]}>
            {PLATFORM_FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureCard}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionWrap, isDesktop && styles.sectionWrapDesktop]}>
          <View style={styles.sectionIntro}>
            <Text style={styles.sectionEyebrow}>SERVICES</Text>
            <Text style={styles.sectionTitle}>What the app supports on both sides of the journey.</Text>
          </View>

          <View style={[styles.workflowGrid, isDesktop && styles.workflowGridDesktop]}>
            {WORKFLOW_COLUMNS.map((column) => (
              <View key={column.heading} style={styles.workflowCard}>
                <Text style={styles.workflowTitle}>{column.heading}</Text>
                <View style={styles.workflowList}>
                  {column.items.map((item) => (
                    <View key={item} style={styles.workflowItem}>
                      <View style={styles.workflowDot} />
                      <Text style={styles.workflowText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionWrap, isDesktop && styles.sectionWrapDesktop]}>
          <View style={styles.ctaPanel}>
            <Text style={styles.sectionEyebrow}>CONTACT</Text>
            <Text style={styles.ctaTitle}>Choose your entry point into the Rivan system.</Text>
            <Text style={styles.ctaText}>
              Customers should start with the discovery portal. Sales staff should continue inside the agent workspace and CRM console.
            </Text>
            <View style={styles.ctaActions}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/login")}>
                <Text style={styles.primaryButtonText}>Customer Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/agent-login")}>
                <Text style={styles.secondaryButtonText}>Agent Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#050709",
  },
  fixedStage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050709",
  },
  fixedImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  topShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,6,11,0.16)",
  },
  centerShade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  bottomShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "35%",
    backgroundColor: "rgba(3,5,8,0.62)",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  navbarDesktop: {
    paddingHorizontal: 58,
    paddingTop: 30,
  },
  logoGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A9CFF",
    ...shadow.md,
  },
  logoWordmark: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 6,
    color: colors.white,
    fontWeight: "400",
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  navLink: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 4,
    color: "rgba(255,255,255,0.88)",
    fontWeight: "500",
  },
  navLinkHidden: {
    display: "none",
  },
  hero: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 120,
  },
  heroCenter: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 1120,
  },
  heroTitle: {
    fontSize: 64,
    lineHeight: 72,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: 8,
    textAlign: "center",
  },
  heroTitleDesktop: {
    fontSize: 140,
    lineHeight: 150,
    letterSpacing: 14,
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 6,
    color: "#2A9CFF",
    textAlign: "center",
  },
  heroSubtitleDesktop: {
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: 10,
  },
  heroBody: {
    marginTop: 28,
    maxWidth: 820,
    fontSize: 16,
    lineHeight: 28,
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
  },
  heroButton: {
    marginTop: 34,
    minWidth: 190,
    minHeight: 76,
    borderRadius: 999,
    backgroundColor: "#22B8EA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    ...shadow.lg,
  },
  heroButtonText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 3,
    color: colors.white,
    fontWeight: "800",
  },
  scrollCue: {
    position: "absolute",
    bottom: 46,
    alignItems: "center",
    gap: 10,
  },
  scrollCueText: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 5,
    color: "rgba(255,255,255,0.5)",
  },
  scrollCueLine: {
    width: 1,
    height: 54,
    backgroundColor: "rgba(255,255,255,0.32)",
  },
  sectionWrap: {
    paddingHorizontal: 20,
    paddingVertical: 80,
    minHeight: 560,
    justifyContent: "center",
    gap: 28,
  },
  sectionWrapDesktop: {
    paddingHorizontal: 58,
    paddingVertical: 120,
    minHeight: 760,
  },
  sectionIntro: {
    maxWidth: 900,
    gap: 10,
  },
  sectionEyebrow: {
    ...typography.label,
    color: "#2A9CFF",
    letterSpacing: 4,
  },
  sectionTitle: {
    fontSize: 32,
    lineHeight: 40,
    color: colors.white,
    fontWeight: "800",
    maxWidth: 820,
  },
  featureGrid: {
    gap: 16,
  },
  featureGridDesktop: {
    flexDirection: "row",
  },
  featureCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(8,12,18,0.44)",
    borderRadius: 24,
    padding: 24,
    gap: 14,
    ...shadow.md,
  },
  featureTitle: {
    fontSize: 21,
    lineHeight: 27,
    color: colors.white,
    fontWeight: "700",
  },
  featureText: {
    fontSize: 15,
    lineHeight: 25,
    color: "rgba(255,255,255,0.72)",
  },
  workflowGrid: {
    gap: 16,
  },
  workflowGridDesktop: {
    flexDirection: "row",
  },
  workflowCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(8,12,18,0.44)",
    borderRadius: 24,
    padding: 24,
    gap: 18,
    ...shadow.md,
  },
  workflowTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: colors.white,
    fontWeight: "800",
  },
  workflowList: {
    gap: 14,
  },
  workflowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  workflowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2A9CFF",
  },
  workflowText: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.78)",
  },
  ctaPanel: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(8,12,18,0.5)",
    borderRadius: 28,
    padding: 28,
    gap: 14,
    ...shadow.lg,
  },
  ctaTitle: {
    fontSize: 34,
    lineHeight: 42,
    color: colors.white,
    fontWeight: "900",
    maxWidth: 800,
  },
  ctaText: {
    fontSize: 16,
    lineHeight: 27,
    color: "rgba(255,255,255,0.74)",
    maxWidth: 760,
  },
  ctaActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 10,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 999,
    backgroundColor: "#22B8EA",
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 2,
    color: colors.white,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 2,
    color: colors.white,
    fontWeight: "700",
  },
});
