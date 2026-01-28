import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

function FloatingIcon({ icon, color, delay }: { icon: keyof typeof Feather.glyphMap; color: string; delay: number }) {
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(0);
  
  React.useEffect(() => {
    setTimeout(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(8, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }, delay);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));
  
  return (
    <Animated.View style={[styles.floatingIcon, animatedStyle]}>
      <Feather name={icon} size={16} color={color} />
    </Animated.View>
  );
}

interface FoodSectionProps {
  title: string;
  items: string[];
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  delay: number;
}

function FoodSection({ title, items, icon, iconColor, delay }: FoodSectionProps) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <LinearGradient
          colors={[iconColor + "08", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
            <Feather name={icon} size={22} color={iconColor} />
          </View>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", flex: 1 }}>
            {title}
          </ThemedText>
        </View>
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <Animated.View key={index} entering={FadeInUp.delay(delay + index * 50)} style={styles.itemRow}>
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

export default function FoodChartScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const { language } = useApp();

  const plateMethodTitle = language === "bn" ? "প্লেট মেথড" : "The Plate Method";
  const plateMethodItems = language === "bn"
    ? [
        "অর্ধেক প্লেট: সবজি (পালং শাক, বরবটি, বাঁধাকপি, ফুলকপি, লাউ ইত্যাদি)",
        "এক চতুর্থাংশ: প্রোটিন (মাছ, মুরগি, ডাল, ছোলা)",
        "এক চতুর্থাংশ: ভাত (বাদামী/লাল চাল পছন্দনীয়, অল্প পরিমাণে)",
        "তাজা সালাদ যোগ করুন",
      ]
    : [
        "Half plate: Vegetables (spinach, beans, cabbage, cauliflower, bottle gourd, etc.)",
        "One quarter: Protein (fish, chicken, lentils, chickpeas)",
        "One quarter: Rice (preferably brown/red rice, small portion)",
        "Add fresh salad",
      ];

  const recommendedTitle = language === "bn" ? "সুপারিশকৃত খাবার" : "Recommended Foods";
  const recommendedFoods = language === "bn"
    ? [
        "সবুজ শাকসবজি (পালং শাক, মেথি শাক, লাউ শাক)",
        "প্রোটিন সমৃদ্ধ খাবার (ডিম, মাছ, ডাল, ছোলা)",
        "বাদাম ও বীজ (কাঠবাদাম, চিয়া বীজ, তিসি বীজ)",
        "গোটা শস্য (ওটস, বাদামী চাল, গমের রুটি)",
        "ফল (আপেল, পেয়ারা, কমলা - কম চিনিযুক্ত)",
        "স্বাস্থ্যকর চর্বি (জলপাই তেল, নারকেল তেল)",
      ]
    : [
        "Green leafy vegetables (spinach, fenugreek leaves, bottle gourd leaves)",
        "Protein-rich foods (eggs, fish, lentils, chickpeas)",
        "Nuts and seeds (almonds, chia seeds, flax seeds)",
        "Whole grains (oats, brown rice, wheat bread)",
        "Fruits (apple, guava, orange - low sugar)",
        "Healthy fats (olive oil, coconut oil)",
      ];

  const avoidTitle = language === "bn" ? "এড়িয়ে চলুন" : "Foods to Avoid";
  const foodsToAvoid = language === "bn"
    ? [
        "পরোটা, সাদা রুটি, বিস্কুট",
        "চিনিযুক্ত চা ও পানীয়",
        "ভাজা খাবার ও ফাস্ট ফুড",
        "অতিরিক্ত আলু",
        "কোমল পানীয় ও প্যাকেটজাত জুস",
        "মিষ্টি ও বেকারি আইটেম",
        "বিরিয়ানি ও ভারী ভাতের খাবার (রাতে)",
        "নুডলস ও প্রক্রিয়াজাত খাবার",
      ]
    : [
        "Paratha, white bread, biscuits",
        "Sugary tea and beverages",
        "Fried foods and fast food",
        "Too much potato",
        "Soft drinks and packaged juices",
        "Sweets and bakery items",
        "Biryani and heavy rice meals (at night)",
        "Noodles and processed foods",
      ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={true}
    >
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.headerSection}>
        <LinearGradient
          colors={isDark ? [theme.backgroundSecondary, theme.backgroundDefault] : [Colors.light.secondary + "15", Colors.light.primary + "10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.floatingIconsContainer}>
            <FloatingIcon icon="heart" color={Colors.light.primary} delay={0} />
            <FloatingIcon icon="award" color={Colors.light.secondary} delay={300} />
            <FloatingIcon icon="zap" color="#FFB347" delay={600} />
          </View>
          <Image
            source={require("../../assets/images/food-plate.png")}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </LinearGradient>
      </Animated.View>

      <FoodSection
        title={plateMethodTitle}
        items={plateMethodItems}
        icon="pie-chart"
        iconColor={Colors.light.secondary}
        delay={200}
      />

      <View style={{ height: Spacing.md }} />

      <FoodSection
        title={recommendedTitle}
        items={recommendedFoods}
        icon="check-circle"
        iconColor="#7CB87C"
        delay={350}
      />

      <View style={{ height: Spacing.md }} />

      <FoodSection
        title={avoidTitle}
        items={foodsToAvoid}
        icon="x-circle"
        iconColor={Colors.light.primary}
        delay={500}
      />
    </ScrollView>
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
  floatingIconsContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
    gap: Spacing.md,
  },
  floatingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionHeader: {
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
