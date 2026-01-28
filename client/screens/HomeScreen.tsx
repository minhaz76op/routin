import React, { useState } from "react";
import { FlatList, View, StyleSheet, Pressable, Image, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

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
  color: string;
}

const routineData: RoutineItem[] = [
  {
    id: "1",
    timeKey: "earlyMorning",
    subtitleKey: "afterWakingUp",
    icon: "sunrise",
    color: "#FFB347",
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
    color: "#E8A5A5",
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
    color: "#F4D03F",
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
    color: "#A8D5A8",
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
    color: "#85C1E9",
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
    color: "#7C7CD9",
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
    color: "#9B59B6",
    singleItems: [
      "1 glass warm milk",
      "OR 1 date + 2 almonds",
    ],
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FloatingHeart({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.6);
  const scale = useSharedValue(0.8);
  
  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.4, { duration: 2000 })
      ),
      -1,
      true
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.8, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={[styles.floatingHeart, { left: delay * 60 }, animatedStyle]}>
      <Feather name="heart" size={16} color={Colors.light.primary} />
    </Animated.View>
  );
}

function WelcomeHeader() {
  const { theme, isDark } = useTheme();
  const { t } = useApp();
  
  return (
    <Animated.View entering={FadeInDown.delay(50).springify()}>
      <LinearGradient
        colors={isDark ? [theme.backgroundSecondary, theme.backgroundDefault] : [Colors.light.primary + "15", Colors.light.secondary + "10"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.welcomeCard}
      >
        <View style={styles.floatingHeartsContainer}>
          <FloatingHeart delay={0} />
          <FloatingHeart delay={1} />
          <FloatingHeart delay={2} />
          <FloatingHeart delay={3} />
        </View>
        <Image
          source={require("../../assets/images/morning-illustration.png")}
          style={styles.welcomeImage}
          resizeMode="cover"
        />
        <View style={styles.welcomeContent}>
          <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold" }}>
            {t("goodMorning")}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
            {t("stayHealthy")}
          </ThemedText>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function RoutineCard({ item, index }: { item: RoutineItem; index: number }) {
  const { theme, isDark } = useTheme();
  const { t, language } = useApp();
  const [completed, setCompleted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
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
    checkScale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    setCompleted(!completed);
  };

  return (
    <Animated.View entering={FadeInUp.delay(200 + index * 80).springify()}>
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
        <LinearGradient
          colors={[item.color + "10", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        />
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
            <Feather name={item.icon} size={22} color={item.color} />
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
          <AnimatedPressable
            onPress={handleComplete}
            hitSlop={12}
            style={[
              styles.checkButton,
              {
                backgroundColor: completed ? Colors.light.success : "transparent",
                borderColor: completed ? Colors.light.success : theme.border,
              },
              checkAnimatedStyle,
            ]}
          >
            {completed ? <Feather name="check" size={16} color="#fff" /> : null}
          </AnimatedPressable>
        </View>

        {expanded ? (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.cardContent}>
            {item.options ? (
              item.options.map((opt, idx) => (
                <View key={opt.id} style={styles.optionContainer}>
                  <View style={[styles.optionBadge, { backgroundColor: item.color + "20" }]}>
                    <ThemedText type="small" style={[styles.optionLabel, { color: item.color, fontFamily: "Nunito_600SemiBold" }]}>
                      {t("option")} {idx + 1}
                    </ThemedText>
                  </View>
                  {opt.items.map((itm, i) => (
                    <View key={i} style={styles.itemRow}>
                      <View style={[styles.bullet, { backgroundColor: item.color }]} />
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
                    <View style={[styles.bullet, { backgroundColor: item.color }]} />
                    <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_400Regular" }}>
                      {itm}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ) : null}

            {item.benefitsKey ? (
              <View style={[styles.infoBox, { backgroundColor: Colors.light.secondary + "15" }]}>
                <Feather name="check-circle" size={18} color={Colors.light.secondary} />
                <ThemedText type="small" style={{ flex: 1, marginLeft: Spacing.sm, fontFamily: "Nunito_400Regular" }}>
                  {item.benefitsKey}
                </ThemedText>
              </View>
            ) : null}

            {item.avoidKey ? (
              <View style={[styles.infoBox, { backgroundColor: Colors.light.primary + "15" }]}>
                <Feather name="x-circle" size={18} color={Colors.light.primary} />
                <ThemedText type="small" style={{ flex: 1, marginLeft: Spacing.sm, fontFamily: "Nunito_400Regular" }}>
                  {t("avoid")}: {item.avoidKey}
                </ThemedText>
              </View>
            ) : null}
          </Animated.View>
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
      ListHeaderComponent={<WelcomeHeader />}
      renderItem={({ item, index }) => <RoutineCard item={item} index={index} />}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    overflow: "hidden",
    position: "relative",
  },
  welcomeImage: {
    width: "100%",
    height: 140,
  },
  welcomeContent: {
    padding: Spacing.lg,
  },
  floatingHeartsContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
  },
  floatingHeart: {
    position: "absolute",
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    overflow: "hidden",
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  checkButton: {
    width: 32,
    height: 32,
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
  optionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.sm,
  },
  optionLabel: {
    fontSize: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.xs,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
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
