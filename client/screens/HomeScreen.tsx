import React, { useState } from "react";
import { FlatList, View, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface MealOption {
  id: string;
  items: string[];
}

interface RoutineItem {
  id: string;
  timeKey: string;
  subtitleKey: string;
  icon: keyof typeof Feather.glyphMap;
  options?: MealOption[];
  singleItems?: string[];
  benefitsKey?: string;
  avoidKey?: string;
}

const routineData: RoutineItem[] = [
  {
    id: "1",
    timeKey: "earlyMorning",
    subtitleKey: "afterWakingUp",
    icon: "sunrise",
    singleItems: [
      "1 glass of lukewarm water",
      "Optional: 1 teaspoon soaked fenugreek seeds (soaked overnight)",
    ],
    benefitsKey: "Supports digestion and helps with hormone balance and blood sugar control.",
  },
  {
    id: "2",
    timeKey: "breakfast",
    subtitleKey: "mostImportantMeal",
    icon: "coffee",
    options: [
      { id: "1", items: ["2 boiled eggs", "1 whole wheat flatbread", "Cucumber or tomato"] },
      { id: "2", items: ["Oats with milk", "Nuts + 1 teaspoon chia seeds", "1 egg"] },
      { id: "3", items: ["Vegetable omelette (2 eggs)", "1 whole wheat flatbread"] },
    ],
    avoidKey: "Paratha, white bread, biscuits, sugary tea",
  },
  {
    id: "3",
    timeKey: "midMorningSnack",
    subtitleKey: "around11AM",
    icon: "sun",
    singleItems: [
      "1 fruit (apple, guava, or orange)",
      "OR 8-10 almonds",
    ],
    benefitsKey: "Helps prevent sudden drops in blood sugar.",
  },
  {
    id: "4",
    timeKey: "lunch",
    subtitleKey: "plateMethod",
    icon: "disc",
    singleItems: [
      "Half plate: Vegetables (spinach, beans, cabbage, cauliflower, bottle gourd, etc.)",
      "One quarter: Protein (fish, chicken, lentils, chickpeas)",
      "One quarter: Rice (preferably brown/red rice, small portion)",
      "Add fresh salad",
    ],
    avoidKey: "Fried foods, too much potato, and soft drinks",
  },
  {
    id: "5",
    timeKey: "eveningSnack",
    subtitleKey: "",
    icon: "cloud",
    singleItems: [
      "Green tea or lemon water (no sugar)",
      "With: Roasted chickpeas OR boiled egg OR boiled mung beans",
    ],
  },
  {
    id: "6",
    timeKey: "dinner",
    subtitleKey: "eatBefore8PM",
    icon: "moon",
    singleItems: [
      "Vegetables + lentils OR fish + vegetables",
      "1 whole wheat flatbread (avoid rice at night if possible)",
    ],
    avoidKey: "Heavy rice meals, biryani, noodles, and fast food",
  },
  {
    id: "7",
    timeKey: "beforeBed",
    subtitleKey: "ifFeelingWeak",
    icon: "star",
    singleItems: [
      "1 glass warm milk",
      "OR 1 date + 2 almonds",
    ],
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function RoutineCard({ item, index }: { item: RoutineItem; index: number }) {
  const { theme, isDark } = useTheme();
  const { t, language } = useApp();
  const [completed, setCompleted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, 100);
    setExpanded(!expanded);
  };

  const handleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCompleted(!completed);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <AnimatedPressable
        onPress={handlePress}
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: completed ? Colors.light.success : theme.border,
            borderWidth: completed ? 2 : 1,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.backgroundTertiary : Colors.light.primaryDark + "20" }]}>
            <Feather name={item.icon} size={20} color={theme.primary} />
          </View>
          <View style={styles.cardTitleContainer}>
            <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold" }}>
              {t(item.timeKey)}
            </ThemedText>
            {item.subtitleKey ? (
              <ThemedText type="small" style={{ color: theme.textSecondary, fontFamily: "Nunito_400Regular" }}>
                {t(item.subtitleKey)}
              </ThemedText>
            ) : null}
          </View>
          <Pressable
            onPress={handleComplete}
            hitSlop={12}
            style={[
              styles.checkButton,
              {
                backgroundColor: completed ? Colors.light.success : "transparent",
                borderColor: completed ? Colors.light.success : theme.border,
              },
            ]}
          >
            {completed ? <Feather name="check" size={16} color="#fff" /> : null}
          </Pressable>
        </View>

        {expanded ? (
          <View style={styles.cardContent}>
            {item.options ? (
              item.options.map((opt, idx) => (
                <View key={opt.id} style={styles.optionContainer}>
                  <ThemedText type="small" style={[styles.optionLabel, { color: theme.primary, fontFamily: "Nunito_600SemiBold" }]}>
                    {t("option")} {idx + 1}
                  </ThemedText>
                  {opt.items.map((itm, i) => (
                    <View key={i} style={styles.itemRow}>
                      <View style={[styles.bullet, { backgroundColor: theme.secondary }]} />
                      <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_400Regular" }}>
                        {itm}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              ))
            ) : null}

            {item.singleItems ? (
              <View style={styles.singleItemsContainer}>
                {item.singleItems.map((itm, i) => (
                  <View key={i} style={styles.itemRow}>
                    <View style={[styles.bullet, { backgroundColor: theme.secondary }]} />
                    <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_400Regular" }}>
                      {itm}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ) : null}

            {item.benefitsKey ? (
              <View style={[styles.infoBox, { backgroundColor: Colors.light.secondary + "20" }]}>
                <Feather name="check-circle" size={16} color={Colors.light.secondary} />
                <ThemedText type="small" style={{ flex: 1, marginLeft: Spacing.sm, fontFamily: "Nunito_400Regular" }}>
                  {item.benefitsKey}
                </ThemedText>
              </View>
            ) : null}

            {item.avoidKey ? (
              <View style={[styles.infoBox, { backgroundColor: Colors.light.primary + "20" }]}>
                <Feather name="x-circle" size={16} color={Colors.light.primary} />
                <ThemedText type="small" style={{ flex: 1, marginLeft: Spacing.sm, fontFamily: "Nunito_400Regular" }}>
                  {t("avoid")}: {item.avoidKey}
                </ThemedText>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.collapsedHint}>
            <ThemedText type="small" style={{ color: theme.textSecondary, fontFamily: "Nunito_400Regular" }}>
              {language === "bn" ? "বিস্তারিত দেখতে ট্যাপ করুন" : "Tap to see details"}
            </ThemedText>
            <Feather name="chevron-down" size={16} color={theme.textSecondary} />
          </View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useApp();

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={routineData}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => <RoutineCard item={item} index={index} />}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  checkButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    marginTop: Spacing.lg,
  },
  optionContainer: {
    marginBottom: Spacing.md,
  },
  optionLabel: {
    marginBottom: Spacing.xs,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: Spacing.sm,
  },
  singleItemsContainer: {
    marginBottom: Spacing.sm,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  collapsedHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
});
