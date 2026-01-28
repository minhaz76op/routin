import React, { useState } from "react";
import { View, StyleSheet, Pressable, Switch, Image, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, useSharedValue, withSpring, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FloatingSparkle({ delay, left }: { delay: number; left: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(0.5);
  
  React.useEffect(() => {
    setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0.5, { duration: 1200 })
        ),
        -1,
        true
      );
    }, delay);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={[styles.sparkle, { left }, animatedStyle]}>
      <Feather name="star" size={12} color={Colors.light.primary} />
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { t, language, setLanguage, themeMode, setThemeMode } = useApp();
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  
  const avatarScale = useSharedValue(1);
  
  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));
  
  React.useEffect(() => {
    avatarScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const handleDarkModeToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeMode(value ? "dark" : "light");
  };

  const handleLanguageChange = (lang: "en" | "bn") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(lang);
  };

  const openMessageModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMessageModalVisible(true);
  };

  return (
    <>
      <KeyboardAwareScrollViewCompat
        style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
          alignItems: "center",
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.avatarSection}>
          <LinearGradient
            colors={isDark ? [theme.backgroundSecondary, theme.backgroundDefault] : [Colors.light.primary + "20", Colors.light.secondary + "15"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <View style={styles.sparklesContainer}>
              <FloatingSparkle delay={0} left={20} />
              <FloatingSparkle delay={300} left={60} />
              <FloatingSparkle delay={600} left={100} />
              <FloatingSparkle delay={900} left={140} />
            </View>
            <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
              <Image
                source={require("../../assets/images/profile-avatar.png")}
                style={[styles.avatar, { borderColor: theme.primary }]}
              />
            </Animated.View>
            <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold", textAlign: "center", marginTop: Spacing.lg }}>
              Israt Jahan Juhi
            </ThemedText>
            <View style={styles.statusBadge}>
              <Feather name="heart" size={12} color={Colors.light.primary} />
              <ThemedText type="small" style={{ color: Colors.light.primary, marginLeft: Spacing.xs, fontFamily: "Nunito_600SemiBold" }}>
                {language === "bn" ? "সুস্থ থাকুন" : "Stay Healthy"}
              </ThemedText>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.settingsContainer}>
          <View style={[styles.settingCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
            <View style={styles.settingRow}>
              <View style={[styles.settingIconContainer, { backgroundColor: "#7C7CD9" + "20" }]}>
                <Feather name="moon" size={20} color="#7C7CD9" />
              </View>
              <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_600SemiBold" }}>
                {t("darkMode")}
              </ThemedText>
              <Switch
                value={themeMode === "dark"}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: theme.border, true: "#7C7CD9" + "80" }}
                thumbColor={themeMode === "dark" ? "#7C7CD9" : "#fff"}
              />
            </View>
          </View>

          <View style={[styles.settingCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
            <View style={styles.settingHeader}>
              <View style={[styles.settingIconContainer, { backgroundColor: Colors.light.secondary + "20" }]}>
                <Feather name="globe" size={20} color={Colors.light.secondary} />
              </View>
              <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_600SemiBold" }}>
                {t("language")}
              </ThemedText>
            </View>
            <View style={styles.languageOptions}>
              <Pressable
                onPress={() => handleLanguageChange("en")}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor: language === "en" ? theme.primary : "transparent",
                    borderColor: language === "en" ? theme.primary : theme.border,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: language === "en" ? "#fff" : theme.text,
                    fontFamily: "Nunito_600SemiBold",
                  }}
                >
                  {t("english")}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => handleLanguageChange("bn")}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor: language === "bn" ? theme.primary : "transparent",
                    borderColor: language === "bn" ? theme.primary : theme.border,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: language === "bn" ? "#fff" : theme.text,
                    fontFamily: "Nunito_600SemiBold",
                  }}
                >
                  {t("bangla")}
                </ThemedText>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() => navigation.navigate("Reminders")}
            style={[styles.settingCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
          >
            <View style={styles.settingRow}>
              <View style={[styles.settingIconContainer, { backgroundColor: "#FFB347" + "20" }]}>
                <Feather name="bell" size={20} color="#FFB347" />
              </View>
              <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_600SemiBold" }}>
                {t("reminders")}
              </ThemedText>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </View>
          </Pressable>

          <Pressable
            onPress={openMessageModal}
            style={[styles.settingCard, styles.messageCard, { backgroundColor: Colors.light.primary + "10", borderColor: Colors.light.primary + "30" }]}
          >
            <LinearGradient
              colors={[Colors.light.primary + "05", Colors.light.primary + "15"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.settingRow}>
              <View style={[styles.settingIconContainer, { backgroundColor: Colors.light.primary + "30" }]}>
                <Feather name="heart" size={20} color={Colors.light.primary} />
              </View>
              <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_600SemiBold" }}>
                {t("messageForYou")}
              </ThemedText>
              <Feather name="chevron-right" size={20} color={Colors.light.primary} />
            </View>
          </Pressable>
        </Animated.View>
      </KeyboardAwareScrollViewCompat>

      <Modal
        visible={messageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMessageModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMessageModalVisible(false)}>
          <Animated.View entering={FadeIn.duration(200)} style={[styles.messageModal, { backgroundColor: theme.backgroundDefault }]}>
            <LinearGradient
              colors={[Colors.light.primary + "10", Colors.light.secondary + "10"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heartIconContainer}>
              <Feather name="heart" size={36} color={Colors.light.primary} />
            </View>
            <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold", textAlign: "center", marginTop: Spacing.xl }}>
              {t("messageForYou")}
            </ThemedText>
            <ThemedText
              type="body"
              style={{ fontFamily: "Nunito_400Regular", textAlign: "center", marginTop: Spacing.lg, lineHeight: 28, paddingHorizontal: Spacing.md }}
            >
              {t("loveMessage")}
            </ThemedText>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMessageModalVisible(false);
              }}
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
            >
              <Feather name="heart" size={16} color="#fff" style={{ marginRight: Spacing.xs }} />
              <ThemedText type="body" style={{ color: "#fff", fontFamily: "Nunito_600SemiBold" }}>
                {t("close")}
              </ThemedText>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    width: "100%",
    marginBottom: Spacing.xl,
  },
  avatarGradient: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  sparklesContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    height: 40,
  },
  sparkle: {
    position: "absolute",
    top: 0,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary + "15",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  settingsContainer: {
    width: "100%",
    gap: Spacing.md,
  },
  settingCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  languageOptions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  languageOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  messageCard: {
    marginTop: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  messageModal: {
    width: "100%",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["3xl"],
    alignItems: "center",
    overflow: "hidden",
  },
  heartIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    marginTop: Spacing["2xl"],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing["3xl"],
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    alignItems: "center",
  },
});
