import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

function PulsingCircle({ color, delay }: { color: string; delay: number }) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0.5);
  
  React.useEffect(() => {
    setTimeout(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.9, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }, delay);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={[styles.pulsingCircle, { backgroundColor: color + "30" }, animatedStyle]} />
  );
}

interface TipCardProps {
  title: string;
  items: string[];
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  delay: number;
}

function TipCard({ title, items, icon, iconColor, delay }: TipCardProps) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <View style={[styles.card, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <LinearGradient
          colors={[iconColor + "08", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
            <Feather name={icon} size={22} color={iconColor} />
          </View>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", flex: 1 }}>
            {title}
          </ThemedText>
        </View>
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <Animated.View key={index} entering={FadeInUp.delay(delay + index * 40)} style={styles.itemRow}>
              <View style={[styles.bullet, { backgroundColor: iconColor }]} />
              <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_400Regular" }}>
                {item}
              </ThemedText>
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export default function ExerciseScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const { t, language } = useApp();

  const exerciseTips = language === "bn"
    ? ["প্রতিদিন ৩০ মিনিট হাঁটা", "হালকা কার্ডিও, স্কিপিং, বা যোগব্যায়াম"]
    : ["30 minutes walking daily", "Light cardio, skipping, or yoga"];

  const sleepTips = language === "bn"
    ? ["৭-৮ ঘণ্টা ঘুম", "রাত ১১টার আগে ঘুমান"]
    : ["7-8 hours of sleep", "Sleep before 11 PM"];

  const hydrationTips = language === "bn"
    ? ["প্রতিদিন ২.৫-৩ লিটার পানি পান করুন"]
    : ["Drink 2.5-3 liters of water daily"];

  const stressTips = language === "bn"
    ? ["গভীর শ্বাস নিন", "প্রার্থনা বা ধ্যান করুন", "সঙ্গীত শুনুন", "হালকা হাঁটা"]
    : ["Deep breathing", "Prayer or meditation", "Listen to music", "Light walks"];

  const warningItems = language === "bn"
    ? [
        "পিরিয়ড ২-৩ মাস বন্ধ থাকলে",
        "অতিরিক্ত চুল পড়লে",
        "তীব্র ব্রণ হলে",
        "হঠাৎ ওজন বাড়লে",
      ]
    : [
        "Periods stop for 2-3 months",
        "Excessive hair fall",
        "Severe acne",
        "Sudden weight gain",
      ];

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.headerSection}>
        <LinearGradient
          colors={isDark ? [theme.backgroundSecondary, theme.backgroundDefault] : [Colors.light.primary + "15", Colors.light.secondary + "10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.pulsingContainer}>
            <PulsingCircle color={Colors.light.primary} delay={0} />
            <PulsingCircle color={Colors.light.secondary} delay={200} />
            <PulsingCircle color="#7C7CD9" delay={400} />
          </View>
          <Image
            source={require("../../assets/images/exercise-illustration.png")}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </LinearGradient>
      </Animated.View>

      <TipCard
        title={t("exercise")}
        items={exerciseTips}
        icon="activity"
        iconColor={Colors.light.secondary}
        delay={200}
      />

      <View style={{ height: Spacing.md }} />

      <TipCard
        title={t("sleep")}
        items={sleepTips}
        icon="moon"
        iconColor="#7C7CD9"
        delay={300}
      />

      <View style={{ height: Spacing.md }} />

      <TipCard
        title={t("hydration")}
        items={hydrationTips}
        icon="droplet"
        iconColor="#5DADE2"
        delay={400}
      />

      <View style={{ height: Spacing.md }} />

      <TipCard
        title={t("stressManagement")}
        items={stressTips}
        icon="heart"
        iconColor={Colors.light.primary}
        delay={500}
      />

      <View style={{ height: Spacing.md }} />

      <TipCard
        title={t("seeDoctor")}
        items={warningItems}
        icon="alert-circle"
        iconColor="#E57373"
        delay={600}
      />
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: Spacing.xl,
  },
  headerGradient: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  pulsingContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  pulsingCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  itemsList: {
    gap: Spacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: Spacing.sm,
  },
});
