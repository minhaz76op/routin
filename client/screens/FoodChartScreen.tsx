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

interface FoodSectionProps {
  title: string;
  items: string[];
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  delay: number;
}

function FoodSection({ title, items, icon, iconColor, delay }: FoodSectionProps) {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
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

export default function FoodChartScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, language } = useApp();

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
          source={require("../../assets/images/food-plate.png")}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </Animated.View>

      <FoodSection
        title={language === "bn" ? "প্লেট মেথড" : "The Plate Method"}
        items={plateMethodItems}
        icon="pie-chart"
        iconColor={Colors.light.secondary}
        delay={200}
      />

      <View style={{ height: Spacing.md }} />

      <FoodSection
        title={language === "bn" ? "সুপারিশকৃত খাবার" : "Recommended Foods"}
        items={recommendedFoods}
        icon="check-circle"
        iconColor={Colors.light.success}
        delay={300}
      />

      <View style={{ height: Spacing.md }} />

      <FoodSection
        title={language === "bn" ? "এড়িয়ে চলুন" : "Foods to Avoid"}
        items={foodsToAvoid}
        icon="x-circle"
        iconColor={Colors.light.primary}
        delay={400}
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
  section: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  sectionHeader: {
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
