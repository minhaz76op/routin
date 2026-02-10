import React from "react";
import { View, StyleSheet, Pressable, Switch, Platform, Linking, ScrollView, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring, withRepeat, withSequence } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

const reminderIcons: Record<string, keyof typeof Feather.glyphMap> = {
  fajr: "sunrise",
  dhuhr: "sun",
  asr: "cloud",
  maghrib: "sunset",
  isha: "moon",
  earlyMorning: "sunrise",
  breakfast: "coffee",
  midMorningSnack: "sun",
  lunch: "disc",
  eveningSnack: "cloud",
  dinner: "moon",
  beforeBed: "star",
  morningDua: "book",
  eveningDua: "book-open",
  sleepDua: "star",
};

const reminderColors: Record<string, string> = {
  fajr: "#FFB347",
  dhuhr: "#F4D03F",
  asr: "#85C1E9",
  maghrib: "#E67E22",
  isha: "#7C7CD9",
  earlyMorning: "#FFB347",
  breakfast: "#E8A5A5",
  midMorningSnack: "#F4D03F",
  lunch: "#A8D5A8",
  eveningSnack: "#85C1E9",
  dinner: "#7C7CD9",
  beforeBed: "#9B59B6",
  morningDua: "#9B59B6",
  eveningDua: "#E67E22",
  sleepDua: "#7C7CD9",
};

const reminderTitlesBn: Record<string, string> = {
  fajrReminder: "ফজরের নামাজ",
  dhuhrReminder: "যোহরের নামাজ",
  asrReminder: "আসরের নামাজ",
  maghribReminder: "মাগরিবের নামাজ",
  ishaReminder: "এশার নামাজ",
  earlyMorningReminder: "ভোরবেলার খাবার",
  breakfastReminder: "সকালের নাস্তা",
  midMorningSnackReminder: "মধ্য-সকালের নাস্তা",
  lunchReminder: "দুপুরের খাবার",
  eveningSnackReminder: "বিকেলের নাস্তা",
  dinnerReminder: "রাতের খাবার",
  beforeBedReminder: "ঘুমানোর আগে",
  morningDuaReminder: "সকালের দোয়া",
  eveningDuaReminder: "সন্ধ্যার দোয়া",
  sleepDuaReminder: "ঘুমানোর দোয়া",
};

const reminderTitlesEn: Record<string, string> = {
  fajrReminder: "Fajr Prayer",
  dhuhrReminder: "Dhuhr Prayer",
  asrReminder: "Asr Prayer",
  maghribReminder: "Maghrib Prayer",
  ishaReminder: "Isha Prayer",
  earlyMorningReminder: "Early Morning",
  breakfastReminder: "Breakfast",
  midMorningSnackReminder: "Mid-Morning Snack",
  lunchReminder: "Lunch",
  eveningSnackReminder: "Evening Snack",
  dinnerReminder: "Dinner",
  beforeBedReminder: "Before Bed",
  morningDuaReminder: "Morning Dua",
  eveningDuaReminder: "Evening Dua",
  sleepDuaReminder: "Dua Before Sleep",
};

const categories = [
  {
    id: "salah",
    titleEn: "Salah Reminders",
    titleBn: "নামাজের রিমাইন্ডার",
    icon: "sun" as keyof typeof Feather.glyphMap,
    color: "#F4D03F",
    reminders: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
  },
  {
    id: "food",
    titleEn: "Food Reminders",
    titleBn: "খাবারের রিমাইন্ডার",
    icon: "coffee" as keyof typeof Feather.glyphMap,
    color: "#A8D5A8",
    reminders: [
      "earlyMorning",
      "breakfast",
      "midMorningSnack",
      "lunch",
      "eveningSnack",
      "dinner",
      "beforeBed",
    ],
  },
  {
    id: "duas",
    titleEn: "Dua Reminders",
    titleBn: "দোয়ার রিমাইন্ডার",
    icon: "book" as keyof typeof Feather.glyphMap,
    color: "#9B59B6",
    reminders: ["morningDua", "eveningDua", "sleepDua"],
  },
];

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

interface ReminderCategoryProps {
  category: typeof categories[0];
  index: number;
}

function ReminderCategory({ category, index }: ReminderCategoryProps) {
  const { theme, isDark } = useTheme();
  const { language, reminders, toggleReminder, updateReminderTime, hasNotificationPermission, requestNotificationPermission } = useApp();

  const [timePickerVisible, setTimePickerVisible] = React.useState(false);
  const [selectedReminder, setSelectedReminder] = React.useState<string | null>(null);

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

  const openTimePicker = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedReminder(id);
    setTimePickerVisible(true);
  };

  const handleTimeChange = (event: any, date?: Date) => {
    setTimePickerVisible(Platform.OS === "ios");
    if (date && selectedReminder) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      updateReminderTime(selectedReminder, timeString);
    }
  };

  const getReminderTitle = (titleKey: string) => {
    if (language === "bn") {
      return reminderTitlesBn[titleKey] || titleKey;
    }
    return reminderTitlesEn[titleKey] || titleKey;
  };

  const categoryReminders = reminders.filter(r => category.reminders.includes(r.id));

  return (
    <Animated.View entering={FadeInUp.delay(200 + index * 100).springify()}>
      <View style={[styles.categoryCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <LinearGradient
          colors={[category.color + "10", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color + "20" }]}>
            <Feather name={category.icon} size={22} color={category.color} />
          </View>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", flex: 1 }}>
            {language === "bn" ? category.titleBn : category.titleEn}
          </ThemedText>
        </View>
        
        <View style={styles.remindersList}>
          {categoryReminders.map((reminder, idx) => (
            <View
              key={reminder.id}
              style={[
                styles.reminderRow,
                {
                  backgroundColor: reminder.enabled ? reminderColors[reminder.id] + "10" : "transparent",
                  borderColor: reminder.enabled ? reminderColors[reminder.id] : theme.border,
                },
              ]}
            >
              <Pressable 
                onPress={() => openTimePicker(reminder.id)}
                style={styles.reminderInfoPressable}
              >
                <View style={[styles.reminderIcon, { backgroundColor: reminderColors[reminder.id] + "20" }]}>
                  <Feather name={reminderIcons[reminder.id]} size={18} color={reminderColors[reminder.id]} />
                </View>
                <View style={styles.reminderInfo}>
                  <ThemedText type="body" style={{ fontFamily: "Nunito_500Medium" }}>
                    {getReminderTitle(reminder.title)}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary, fontFamily: "Nunito_400Regular" }}>
                    {(() => {
                      const [hours, minutes] = reminder.time.split(":").map(Number);
                      const ampm = hours >= 12 ? "PM" : "AM";
                      const h12 = hours % 12 || 12;
                      return `${h12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
                    })()}
                  </ThemedText>
                </View>
              </Pressable>
              <Switch
                value={reminder.enabled}
                onValueChange={() => handleToggle(reminder.id)}
                trackColor={{ false: theme.border, true: reminderColors[reminder.id] + "80" }}
                thumbColor={reminder.enabled ? reminderColors[reminder.id] : "#fff"}
              />
            </View>
          ))}
        </View>

        {timePickerVisible && (
          <DateTimePicker
            value={(() => {
              const r = reminders.find(rem => rem.id === selectedReminder);
              const d = new Date();
              if (r) {
                const [h, m] = r.time.split(":").map(Number);
                d.setHours(h, m, 0, 0);
              }
              return d;
            })()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
      </View>
    </Animated.View>
  );
}

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const { language, t, hasNotificationPermission, requestNotificationPermission } = useApp();

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

  const headerTitle = language === "bn" ? "রিমাইন্ডার সেটিংস" : "Reminder Settings";
  const headerSubtitle = language === "bn" ? "নামাজ, খাবার ও দোয়ার রিমাইন্ডার" : "Salah, Food & Dua Reminders";
  const enableNotificationsText = language === "bn" ? "নোটিফিকেশন চালু করুন" : "Enable Notifications";
  const permissionNeededText = language === "bn" ? "রিমাইন্ডার পাঠাতে অনুমতি প্রয়োজন" : "Permission needed to send reminders";

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
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.headerSection}>
        <LinearGradient
          colors={isDark ? [theme.backgroundSecondary, theme.backgroundDefault] : [Colors.light.secondary + "20", Colors.light.primary + "10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Feather name="bell" size={48} color={Colors.light.secondary} />
          <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold", textAlign: "center", marginTop: Spacing.md }}>
            {headerTitle}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
            {headerSubtitle}
          </ThemedText>
          
          <View style={styles.hintBadge}>
            <Feather name="info" size={14} color={Colors.light.primary} />
            <ThemedText type="small" style={{ color: Colors.light.primary, marginLeft: Spacing.xs, fontFamily: "Nunito_600SemiBold" }}>
              {t("tapToSetAlarm")}
            </ThemedText>
          </View>
        </LinearGradient>
      </Animated.View>

      {!hasNotificationPermission && Platform.OS !== "web" ? (
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Pressable
            onPress={handleEnableNotifications}
            style={[styles.permissionCard, { backgroundColor: Colors.light.primary + "15", borderColor: Colors.light.primary }]}
          >
            <View style={styles.permissionContent}>
              <BellAnimation />
              <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", marginTop: Spacing.md, textAlign: "center" }}>
                {enableNotificationsText}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs, textAlign: "center", fontFamily: "Nunito_400Regular" }}>
                {permissionNeededText}
              </ThemedText>
            </View>
          </Pressable>
        </Animated.View>
      ) : null}

      {categories.map((category, index) => (
        <View key={category.id} style={{ marginBottom: Spacing.md }}>
          <ReminderCategory category={category} index={index} />
        </View>
      ))}
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
  },
  hintBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary + "15",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
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
  categoryCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  remindersList: {
    gap: Spacing.sm,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  reminderIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  reminderInfoPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
