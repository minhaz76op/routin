import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { ResourcesStackParamList } from "@/navigation/ResourcesStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ResourceCardProps {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  imageSource: any;
  onPress: () => void;
  index: number;
}

function ResourceCard({ title, description, icon, imageSource, onPress, index }: ResourceCardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 120).springify()}>
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
        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <View style={[styles.iconBadge, { backgroundColor: isDark ? theme.backgroundTertiary : Colors.light.primary + "20" }]}>
            <Feather name={icon} size={20} color={theme.primary} />
          </View>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_700Bold", marginTop: Spacing.md }}>
            {title}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
            {description}
          </ThemedText>
          <View style={styles.cardFooter}>
            <ThemedText type="small" style={{ color: theme.primary, fontFamily: "Nunito_600SemiBold" }}>
              View Details
            </ThemedText>
            <Feather name="arrow-right" size={16} color={theme.primary} />
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
  const { theme } = useTheme();
  const { t } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<ResourcesStackParamList>>();

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <ResourceCard
        title={t("foodChart")}
        description={t("viewFoodRecommendations")}
        icon="book-open"
        imageSource={require("../../assets/images/food-plate.png")}
        onPress={() => navigation.navigate("FoodChart")}
        index={0}
      />
      <View style={{ height: Spacing.lg }} />
      <ResourceCard
        title={t("dailyExercise")}
        description={t("viewExerciseRoutine")}
        icon="activity"
        imageSource={require("../../assets/images/exercise-illustration.png")}
        onPress={() => navigation.navigate("Exercise")}
        index={1}
      />
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: Spacing.lg,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -22,
    left: Spacing.lg,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
});
