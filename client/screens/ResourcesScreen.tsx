import React from "react";
import { View, StyleSheet, Pressable, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { ResourcesStackParamList } from "@/navigation/ResourcesStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FloatingLeaf({ delay, size }: { delay: number; size: number }) {
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  React.useEffect(() => {
    setTimeout(() => {
      rotation.value = withRepeat(
        withSequence(
          withTiming(15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-15, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }, delay);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { translateY: translateY.value },
    ],
  }));
  
  return (
    <Animated.View style={[styles.floatingLeaf, animatedStyle]}>
      <Feather name="feather" size={size} color={Colors.light.secondary} />
    </Animated.View>
  );
}

interface ResourceCardProps {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  imageSource?: any;
  gradientColors: string[];
  iconColor: string;
  onPress: () => void;
  index: number;
  viewDetailsText: string;
  compact?: boolean;
}

function ResourceCard({ title, description, icon, imageSource, gradientColors, iconColor, onPress, index, viewDetailsText, compact }: ResourceCardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (compact) {
    return (
      <Animated.View entering={FadeInDown.delay(150 + index * 100).springify()}>
        <AnimatedPressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.compactCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            animatedStyle,
          ]}
        >
          <LinearGradient
            colors={isDark ? [theme.backgroundSecondary + "50", "transparent"] : gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          />
          <View style={[styles.compactIconBadge, { backgroundColor: iconColor + "20" }]}>
            <Feather name={icon} size={24} color={iconColor} />
          </View>
          <View style={styles.compactContent}>
            <ThemedText type="body" style={{ fontFamily: "Nunito_600SemiBold" }}>
              {title}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary, fontFamily: "Nunito_400Regular" }}>
              {description}
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </AnimatedPressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(150 + index * 150).springify()}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
          animatedStyle,
        ]}
      >
        {imageSource ? (
          <View style={styles.cardImageContainer}>
            <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
            <LinearGradient
              colors={["transparent", theme.backgroundDefault]}
              style={styles.imageOverlay}
            />
          </View>
        ) : null}
        <LinearGradient
          colors={isDark ? [theme.backgroundSecondary + "50", "transparent"] : gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        />
        <View style={[styles.cardContent, !imageSource && { paddingTop: Spacing.xl }]}>
          <View style={[styles.iconBadge, { backgroundColor: iconColor + "20" }, !imageSource && { position: "relative", top: 0, left: 0, marginBottom: Spacing.md }]}>
            <Feather name={icon} size={22} color={iconColor} />
          </View>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_700Bold", marginTop: imageSource ? Spacing.md : 0 }}>
            {title}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
            {description}
          </ThemedText>
          <View style={styles.cardFooter}>
            <View style={[styles.viewButton, { backgroundColor: iconColor + "15" }]}>
              <ThemedText type="small" style={{ color: iconColor, fontFamily: "Nunito_600SemiBold" }}>
                {viewDetailsText}
              </ThemedText>
              <Feather name="arrow-right" size={14} color={iconColor} style={{ marginLeft: Spacing.xs }} />
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { t, language } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<ResourcesStackParamList>>();

  const viewDetailsText = language === "bn" ? "বিস্তারিত দেখুন" : "View Details";
  const headerSubtitle = language === "bn" ? "আপনার স্বাস্থ্যকর জীবনযাপনের গাইড" : "Your guide to healthy living";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: tabBarHeight }}
      showsVerticalScrollIndicator={true}
    >
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.headerSection}>
        <LinearGradient
          colors={isDark ? [theme.backgroundSecondary, theme.backgroundDefault] : [Colors.light.secondary + "20", Colors.light.primary + "10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.leafContainer}>
            <FloatingLeaf delay={0} size={24} />
            <FloatingLeaf delay={500} size={18} />
            <FloatingLeaf delay={1000} size={20} />
          </View>
          <Feather name="book-open" size={40} color={Colors.light.secondary} />
          <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold", textAlign: "center", marginTop: Spacing.md }}>
            {t("resources")}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
            {headerSubtitle}
          </ThemedText>
        </LinearGradient>
      </Animated.View>

      <ResourceCard
        title={t("foodChart")}
        description={t("viewFoodRecommendations")}
        icon="book-open"
        imageSource={require("../../assets/images/food-plate.png")}
        gradientColors={[Colors.light.secondary + "10", "transparent"]}
        iconColor={Colors.light.secondary}
        onPress={() => navigation.navigate("FoodChart")}
        index={0}
        viewDetailsText={viewDetailsText}
      />
      <View style={{ height: Spacing.lg }} />
      
      <ResourceCard
        title={t("dailyExercise")}
        description={t("viewExerciseRoutine")}
        icon="activity"
        imageSource={require("../../assets/images/exercise-illustration.png")}
        gradientColors={[Colors.light.primary + "10", "transparent"]}
        iconColor={Colors.light.primary}
        onPress={() => navigation.navigate("Exercise")}
        index={1}
        viewDetailsText={viewDetailsText}
      />
      <View style={{ height: Spacing.lg }} />

      <ResourceCard
        title={t("duas")}
        description={t("viewDuas")}
        icon="book"
        gradientColors={["#7C7CD9" + "10", "transparent"]}
        iconColor="#7C7CD9"
        onPress={() => navigation.navigate("Duas")}
        index={2}
        viewDetailsText={viewDetailsText}
        compact
      />
      <View style={{ height: Spacing.md }} />

      <ResourceCard
        title={t("reminders")}
        description={t("reminderSubtitle")}
        icon="bell"
        gradientColors={["#FFB347" + "10", "transparent"]}
        iconColor="#FFB347"
        onPress={() => navigation.navigate("Reminders")}
        index={3}
        viewDetailsText={viewDetailsText}
        compact
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
    padding: Spacing.xl,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  leafContainer: {
    position: "absolute",
    top: 10,
    right: 20,
    flexDirection: "row",
    gap: Spacing.md,
  },
  floatingLeaf: {
    opacity: 0.6,
  },
  card: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
  },
  compactCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  compactIconBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  compactContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    padding: Spacing.lg,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -24,
    left: Spacing.lg,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
});
