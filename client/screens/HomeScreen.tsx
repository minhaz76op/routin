import React, { useState, useEffect } from "react";
import { FlatList, View, StyleSheet, Pressable, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
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
  items: { en: string; bn: string }[];
}

interface RoutineItem {
  id: string;
  timeKey: string;
  time: { en: string; bn: string };
  subtitleKey: string;
  icon: keyof typeof Feather.glyphMap;
  options?: MealOption[];
  singleItems?: { en: string; bn: string }[];
  benefits?: { en: string; bn: string };
  avoid?: { en: string; bn: string };
  color: string;
}

const routineData: RoutineItem[] = [
  {
    id: "1",
    timeKey: "earlyMorning",
    time: { en: "6:00 AM", bn: "সকাল ৬:০০" },
    subtitleKey: "afterWakingUp",
    icon: "sunrise",
    color: "#FFB347",
    singleItems: [
      { en: "1 glass of lukewarm water", bn: "১ গ্লাস কুসুম গরম পানি" },
      { en: "Optional: 1 teaspoon soaked fenugreek seeds (soaked overnight)", bn: "ঐচ্ছিক: ১ চা চামচ ভেজানো মেথি বীজ (রাতে ভিজিয়ে রাখুন)" },
    ],
    benefits: {
      en: "Supports digestion and helps with hormone balance and blood sugar control.",
      bn: "হজমে সাহায্য করে এবং হরমোন ভারসাম্য ও রক্তে শর্করা নিয়ন্ত্রণে সহায়তা করে।"
    },
  },
  {
    id: "2",
    timeKey: "breakfast",
    time: { en: "8:00 AM", bn: "সকাল ৮:০০" },
    subtitleKey: "mostImportantMeal",
    icon: "coffee",
    color: "#E8A5A5",
    options: [
      { id: "1", items: [
        { en: "2 boiled eggs", bn: "২টি সিদ্ধ ডিম" },
        { en: "1 whole wheat flatbread", bn: "১টি গমের রুটি" },
        { en: "Cucumber or tomato", bn: "শসা বা টমেটো" }
      ]},
      { id: "2", items: [
        { en: "Oats with milk", bn: "দুধ দিয়ে ওটস" },
        { en: "Nuts + 1 teaspoon chia seeds", bn: "বাদাম + ১ চা চামচ চিয়া বীজ" },
        { en: "1 egg", bn: "১টি ডিম" }
      ]},
      { id: "3", items: [
        { en: "Vegetable omelette (2 eggs)", bn: "সবজি অমলেট (২টি ডিম)" },
        { en: "1 whole wheat flatbread", bn: "১টি গমের রুটি" }
      ]},
    ],
    avoid: { en: "Paratha, white bread, biscuits, sugary tea", bn: "পরোটা, সাদা রুটি, বিস্কুট, চিনিযুক্ত চা" },
  },
  {
    id: "3",
    timeKey: "midMorningSnack",
    time: { en: "11:00 AM", bn: "সকাল ১১:০০" },
    subtitleKey: "around11AM",
    icon: "sun",
    color: "#F4D03F",
    singleItems: [
      { en: "1 fruit (apple, guava, or orange)", bn: "১টি ফল (আপেল, পেয়ারা, বা কমলা)" },
      { en: "OR 8-10 almonds", bn: "অথবা ৮-১০টি কাঠবাদাম" },
    ],
    benefits: { en: "Helps prevent sudden drops in blood sugar.", bn: "রক্তে শর্করার হঠাৎ পতন রোধ করতে সাহায্য করে।" },
  },
  {
    id: "4",
    timeKey: "lunch",
    time: { en: "1:00 PM", bn: "দুপুর ১:০০" },
    subtitleKey: "plateMethod",
    icon: "disc",
    color: "#A8D5A8",
    singleItems: [
      { en: "Half plate: Vegetables (spinach, beans, cabbage, cauliflower, bottle gourd, etc.)", bn: "অর্ধেক প্লেট: সবজি (পালং শাক, বরবটি, বাঁধাকপি, ফুলকপি, লাউ ইত্যাদি)" },
      { en: "One quarter: Protein (fish, chicken, lentils, chickpeas)", bn: "এক চতুর্থাংশ: প্রোটিন (মাছ, মুরগি, ডাল, ছোলা)" },
      { en: "One quarter: Rice (preferably brown/red rice, small portion)", bn: "এক চতুর্থাংশ: ভাত (বাদামী/লাল চাল পছন্দনীয়, অল্প পরিমাণে)" },
      { en: "Add fresh salad", bn: "তাজা সালাদ যোগ করুন" },
    ],
    avoid: { en: "Fried foods, too much potato, and soft drinks", bn: "ভাজা খাবার, অতিরিক্ত আলু, এবং কোমল পানীয়" },
  },
  {
    id: "5",
    timeKey: "eveningSnack",
    time: { en: "5:00 PM", bn: "বিকাল ৫:০০" },
    subtitleKey: "",
    icon: "cloud",
    color: "#85C1E9",
    singleItems: [
      { en: "Green tea or lemon water (no sugar)", bn: "গ্রিন টি বা লেবু পানি (চিনি ছাড়া)" },
      { en: "With: Roasted chickpeas OR boiled egg OR boiled mung beans", bn: "সাথে: ভাজা ছোলা অথবা সিদ্ধ ডিম অথবা সিদ্ধ মুগ ডাল" },
    ],
  },
  {
    id: "6",
    timeKey: "dinner",
    time: { en: "7:30 PM", bn: "রাত ৭:৩০" },
    subtitleKey: "eatBefore8PM",
    icon: "moon",
    color: "#7C7CD9",
    singleItems: [
      { en: "Vegetables + lentils OR fish + vegetables", bn: "সবজি + ডাল অথবা মাছ + সবজি" },
      { en: "1 whole wheat flatbread (avoid rice at night if possible)", bn: "১টি গমের রুটি (সম্ভব হলে রাতে ভাত এড়িয়ে চলুন)" },
    ],
    avoid: { en: "Heavy rice meals, biryani, noodles, and fast food", bn: "ভারী ভাতের খাবার, বিরিয়ানি, নুডলস, এবং ফাস্ট ফুড" },
  },
  {
    id: "7",
    timeKey: "beforeBed",
    time: { en: "10:00 PM", bn: "রাত ১০:০০" },
    subtitleKey: "ifFeelingWeak",
    icon: "star",
    color: "#9B59B6",
    singleItems: [
      { en: "1 glass warm milk", bn: "১ গ্লাস গরম দুধ" },
      { en: "OR 1 date + 2 almonds", bn: "অথবা ১টি খেজুর + ২টি বাদাম" },
    ],
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getGreeting(language: "en" | "bn"): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) {
    return language === "bn" ? "সুপ্রভাত, জুহি!" : "Good Morning, Juhi!";
  } else if (hour >= 11 && hour < 15) {
    return language === "bn" ? "শুভ দুপুর, জুহি!" : "Good Noon, Juhi!";
  } else if (hour >= 15 && hour < 18) {
    return language === "bn" ? "শুভ বিকাল, জুহি!" : "Good Afternoon, Juhi!";
  } else if (hour >= 18 && hour < 21) {
    return language === "bn" ? "শুভ সন্ধ্যা, জুহি!" : "Good Evening, Juhi!";
  } else {
    return language === "bn" ? "শুভ রাত্রি, জুহি!" : "Good Night, Juhi!";
  }
}

function getGreetingIcon(): keyof typeof Feather.glyphMap {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return "sunrise";
  if (hour >= 11 && hour < 15) return "sun";
  if (hour >= 15 && hour < 18) return "cloud";
  if (hour >= 18 && hour < 21) return "sunset";
  return "moon";
}

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
  const { t, language, getTodayCompletedCount, stats } = useApp();
  const [greeting, setGreeting] = useState(getGreeting(language));
  const [greetingIcon, setGreetingIcon] = useState<keyof typeof Feather.glyphMap>(getGreetingIcon());
  const completedCount = getTodayCompletedCount();
  const totalRoutines = routineData.length;

  const today = new Date();
  const dateStr = today.toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
  
  useEffect(() => {
    setGreeting(getGreeting(language));
    setGreetingIcon(getGreetingIcon());
    
    const interval = setInterval(() => {
      setGreeting(getGreeting(language));
      setGreetingIcon(getGreetingIcon());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [language]);
  
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
          <View style={styles.greetingRow}>
            <Feather name={greetingIcon} size={24} color={Colors.light.primary} style={{ marginRight: Spacing.sm }} />
            <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold" }}>
              {greeting}
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: Colors.light.primary, fontFamily: "Nunito_600SemiBold", marginTop: 2 }}>
            {dateStr}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
            {t("stayHealthy")}
          </ThemedText>
          
          <View style={styles.weeklyHistoryContainer}>
            <ThemedText type="small" style={{ fontFamily: "Nunito_700Bold", marginBottom: 8, color: Colors.light.primary }}>
              {language === "bn" ? "গত ৭ দিনের অগ্রগতি" : "Completed task (Last 7 Days)"}
            </ThemedText>
            <View style={styles.weeklyHistoryRow}>
              {stats.weeklyHistory.map((day: { date: string, percentage: number }, idx: number) => {
                const dateObj = new Date(day.date);
                const dayLabel = dateObj.toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", { weekday: 'short' });
                const dateLabel = dateObj.getDate();
                return (
                  <View key={idx} style={styles.historyItem}>
                    <View style={styles.historyBarContainer}>
                      <View style={[styles.historyBarFill, { height: `${day.percentage}%` }]} />
                    </View>
                    <ThemedText style={styles.historyPercentage}>{day.percentage}%</ThemedText>
                    <ThemedText style={styles.historyDate}>{dateLabel}</ThemedText>
                    <ThemedText style={styles.historyDay}>{dayLabel}</ThemedText>
                  </View>
                );
              })}
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(completedCount / totalRoutines) * 100}%`,
                    backgroundColor: Colors.light.secondary,
                  }
                ]} 
              />
            </View>
            <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
              {completedCount}/{totalRoutines} {t("completed")}
            </ThemedText>
            <ThemedText type="small" style={{ color: Colors.light.primary, fontFamily: "Nunito_700Bold", marginTop: 4 }}>
              {language === "bn" ? "আপনার কাজের " : "Your complete "}{Math.round((completedCount / totalRoutines) * 100)}% {language === "bn" ? "সম্পন্ন হয়েছে" : "of your task"}
            </ThemedText>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText type="h4" style={styles.statValue}>{stats.daily}</ThemedText>
              <ThemedText type="small" style={styles.statLabel}>{language === "bn" ? "দৈনিক" : "Daily"}</ThemedText>
              <ThemedText type="small" style={styles.statPercentage}>{Math.round((stats.daily / totalRoutines) * 100)}%</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="h4" style={styles.statValue}>{stats.weekly}</ThemedText>
              <ThemedText type="small" style={styles.statLabel}>{language === "bn" ? "সাপ্তাহিক" : "Weekly"}</ThemedText>
              <ThemedText type="small" style={styles.statPercentage}>{Math.round((stats.weekly / (totalRoutines * 7)) * 100)}%</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="h4" style={styles.statValue}>{stats.monthly}</ThemedText>
              <ThemedText type="small" style={styles.statLabel}>{language === "bn" ? "মাসিক" : "Monthly"}</ThemedText>
              <ThemedText type="small" style={styles.statPercentage}>{Math.round((stats.monthly / (totalRoutines * 30)) * 100)}%</ThemedText>
            </View>
          </View>

          <View style={styles.detailedBreakdown}>
            <ThemedText type="small" style={styles.breakdownTitle}>
              {language === "bn" ? "রুটিন ভিত্তিক অগ্রগতি" : "Routine Breakdown"}
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breakdownScroll}>
              {routineData.map((item) => {
                const count = stats.breakdown[item.id] || 0;
                return (
                  <View key={item.id} style={styles.breakdownItem}>
                    <View style={[styles.breakdownIcon, { backgroundColor: item.color + "20" }]}>
                      <Feather name={item.icon} size={14} color={item.color} />
                    </View>
                    <ThemedText style={styles.breakdownCount}>{count}</ThemedText>
                    <ThemedText type="small" style={styles.breakdownLabel} numberOfLines={1}>
                      {t(item.timeKey)}
                    </ThemedText>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function RoutineCard({ item, index }: { item: RoutineItem; index: number }) {
  const { theme } = useTheme();
  const { t, language, isRoutineCompleted, toggleRoutineComplete } = useApp();
  const completed = isRoutineCompleted(item.id);
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
    toggleRoutineComplete(item.id);
  };

  const getText = (textItem: { en: string; bn: string }) => language === "bn" ? textItem.bn : textItem.en;

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
            <View style={styles.titleRow}>
              <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", flex: 1 }}>
                {t(item.timeKey)}
              </ThemedText>
              <View style={[styles.timeBadge, { backgroundColor: item.color + "20" }]}>
                <Feather name="clock" size={12} color={item.color} />
                <ThemedText type="small" style={{ color: item.color, marginLeft: 4, fontFamily: "Nunito_600SemiBold" }}>
                  {getText(item.time)}
                </ThemedText>
              </View>
            </View>
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
                backgroundColor: completed ? Colors.light.success : theme.backgroundSecondary,
                borderColor: completed ? Colors.light.success : theme.border,
              },
              checkAnimatedStyle,
            ]}
          >
            <Feather name="check" size={18} color={completed ? "#fff" : theme.textSecondary} />
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
                        {getText(itm)}
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
                      {getText(itm)}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ) : null}

            {item.benefits ? (
              <View style={[styles.infoBox, { backgroundColor: Colors.light.secondary + "15" }]}>
                <Feather name="check-circle" size={18} color={Colors.light.secondary} />
                <ThemedText type="small" style={{ flex: 1, marginLeft: Spacing.sm, fontFamily: "Nunito_400Regular" }}>
                  {getText(item.benefits)}
                </ThemedText>
              </View>
            ) : null}

            {item.avoid ? (
              <View style={[styles.infoBox, { backgroundColor: Colors.light.primary + "15" }]}>
                <Feather name="x-circle" size={18} color={Colors.light.primary} />
                <ThemedText type="small" style={{ flex: 1, marginLeft: Spacing.sm, fontFamily: "Nunito_400Regular" }}>
                  {t("avoid")}: {getText(item.avoid)}
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

function ResourceCard({ item }: { item: { id: string; title: string; subtitle: string; icon: keyof typeof Feather.glyphMap; color: string; screen: string } }) {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <Animated.View entering={FadeInUp.delay(800).springify()}>
      <Pressable
        onPress={() => navigation.navigate("Resources", { screen: item.screen })}
        style={({ pressed }) => [
          styles.resourceCard,
          {
            backgroundColor: theme.backgroundSecondary,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View style={[styles.resourceIconContainer, { backgroundColor: item.color + "20" }]}>
          <Feather name={item.icon} size={20} color={item.color} />
        </View>
        <View style={styles.resourceContent}>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold" }}>
            {item.title}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, fontFamily: "Nunito_400Regular" }}>
            {item.subtitle}
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { language } = useApp();

  const resourceCards = [];

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
      ListHeaderComponent={
        <>
          <WelcomeHeader />
          <View style={{ marginBottom: Spacing.xl }}>
            {resourceCards.map((card) => (
              <ResourceCard key={card.id} item={card} />
            ))}
          </View>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md, fontFamily: "Nunito_700Bold" }}>
            {language === "bn" ? "আজকের রুটিন" : "Today's Routine"}
          </ThemedText>
        </>
      }
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
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
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
  progressContainer: {
    marginTop: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontFamily: "Nunito_700Bold",
    color: Colors.light.primary,
  },
  statLabel: {
    fontFamily: "Nunito_400Regular",
    color: "rgba(0,0,0,0.5)",
    fontSize: 10,
  },
  statPercentage: {
    fontFamily: "Nunito_700Bold",
    color: Colors.light.primary,
    fontSize: 10,
    marginTop: 2,
  },
  detailedBreakdown: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  breakdownTitle: {
    fontFamily: "Nunito_600SemiBold",
    marginBottom: Spacing.sm,
    color: "rgba(0,0,0,0.6)",
  },
  breakdownScroll: {
    flexDirection: "row",
  },
  breakdownItem: {
    alignItems: "center",
    marginRight: Spacing.md,
    width: 60,
  },
  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  breakdownCount: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
  },
  weeklyHistoryContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: "rgba(232, 165, 165, 0.1)",
    borderRadius: BorderRadius.lg,
  },
  weeklyHistoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 10,
  },
  historyItem: {
    alignItems: 'center',
    flex: 1,
  },
  historyBarContainer: {
    width: 8,
    height: 50,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  historyBarFill: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  historyPercentage: {
    fontSize: 8,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.primary,
    marginTop: 4,
  },
  historyDate: {
    fontSize: 9,
    fontFamily: "Nunito_600SemiBold",
    marginTop: 2,
  },
  historyDay: {
    fontSize: 8,
    fontFamily: "Nunito_400Regular",
    color: "rgba(0,0,0,0.5)",
  },
  breakdownLabel: {
    fontSize: 8,
    textAlign: "center",
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.sm,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
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
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  resourceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  resourceContent: {
    flex: 1,
  },
});
