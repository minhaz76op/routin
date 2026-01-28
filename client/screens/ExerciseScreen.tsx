import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

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
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <View style={[styles.card, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
            <Feather name={icon} size={20} color={iconColor} />
          </View>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", flex: 1 }}>
            {title}
          </ThemedText>
        </View>
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={[styles.bullet, { backgroundColor: iconColor }]} />
              <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_400Regular" }}>
                {item}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export default function ExerciseScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
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
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Image
          source={require("../../assets/images/exercise-illustration.png")}
          style={styles.headerImage}
          resizeMode="cover"
        />
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
  headerImage: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: Spacing.sm,
  },
});
