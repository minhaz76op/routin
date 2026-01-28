import React from "react";
import { View, StyleSheet, Pressable, Switch, Image, Platform, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring, withRepeat, withSequence } from "react-native-reanimated";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

const reminderIcons: Record<string, keyof typeof Feather.glyphMap> = {
  morning: "sunrise",
  breakfast: "coffee",
  lunch: "sun",
  exercise: "activity",
  dinner: "moon",
  water: "droplet",
  sleep: "star",
};

const reminderColors: Record<string, string> = {
  morning: "#FFB347",
  breakfast: "#E8A5A5",
  lunch: "#A8D5A8",
  exercise: "#7CB87C",
  dinner: "#7C7CD9",
  water: "#5DADE2",
  sleep: "#9B59B6",
};

function BellAnimation() {
  const rotation = useSharedValue(0);
  
  React.useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withSpring(15, { damping: 2, stiffness: 100 }),
        withSpring(-15, { damping: 2, stiffness: 100 }),
        withSpring(0, { damping: 5, stiffness: 100 })
      ),
      -1,
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <Feather name="bell" size={48} color={Colors.light.primary} />
    </Animated.View>
  );
}

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const { t, reminders, toggleReminder, hasNotificationPermission, requestNotificationPermission } = useApp();

  const handleToggle = async (id: string) => {
    if (!hasNotificationPermission) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        return;
      }
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleReminder(id);
  };

  const handleEnableNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const granted = await requestNotificationPermission();
    if (!granted && Platform.OS !== "web") {
      try {
        await Linking.openSettings();
      } catch (error) {
        console.log("Cannot open settings");
      }
    }
  };

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
        <Image
          source={require("../../assets/images/reminder-illustration.png")}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold", textAlign: "center", marginTop: Spacing.lg }}>
          {t("reminders")}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
          {t("reminderSubtitle")}
        </ThemedText>
      </Animated.View>

      {!hasNotificationPermission && Platform.OS !== "web" ? (
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Pressable
            onPress={handleEnableNotifications}
            style={[styles.permissionCard, { backgroundColor: Colors.light.primary + "15", borderColor: Colors.light.primary }]}
          >
            <View style={styles.permissionContent}>
              <BellAnimation />
              <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", marginTop: Spacing.md, textAlign: "center" }}>
                {t("enableNotifications")}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs, textAlign: "center", fontFamily: "Nunito_400Regular" }}>
                {t("notificationPermissionNeeded")}
              </ThemedText>
            </View>
          </Pressable>
        </Animated.View>
      ) : null}

      <View style={styles.remindersContainer}>
        {reminders.map((reminder, index) => (
          <Animated.View key={reminder.id} entering={FadeInUp.delay(300 + index * 80).springify()}>
            <Pressable
              onPress={() => handleToggle(reminder.id)}
              style={[
                styles.reminderCard,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: reminder.enabled ? reminderColors[reminder.id] : theme.border,
                  borderWidth: reminder.enabled ? 2 : 1,
                },
              ]}
            >
              <View style={[styles.reminderIcon, { backgroundColor: reminderColors[reminder.id] + "20" }]}>
                <Feather name={reminderIcons[reminder.id]} size={24} color={reminderColors[reminder.id]} />
              </View>
              <View style={styles.reminderInfo}>
                <ThemedText type="body" style={{ fontFamily: "Nunito_600SemiBold" }}>
                  {t(reminder.title)}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary, fontFamily: "Nunito_400Regular" }}>
                  {reminder.time}
                </ThemedText>
              </View>
              <Switch
                value={reminder.enabled}
                onValueChange={() => handleToggle(reminder.id)}
                trackColor={{ false: theme.border, true: reminderColors[reminder.id] + "80" }}
                thumbColor={reminder.enabled ? reminderColors[reminder.id] : "#fff"}
              />
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  headerImage: {
    width: 120,
    height: 120,
  },
  permissionCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderStyle: "dashed",
    marginBottom: Spacing.xl,
  },
  permissionContent: {
    alignItems: "center",
  },
  remindersContainer: {
    gap: Spacing.md,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
});
