import React, { useState } from "react";
import { View, StyleSheet, Pressable, Switch, Image, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { t, language, setLanguage, themeMode, setThemeMode } = useApp();
  const [messageModalVisible, setMessageModalVisible] = useState(false);

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
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.avatarContainer}>
          <Image
            source={require("../../assets/images/profile-avatar.png")}
            style={[styles.avatar, { borderColor: theme.primary }]}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold", textAlign: "center", marginTop: Spacing.lg }}>
            Israt Jahan Juhi
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.settingsContainer}>
          <View style={[styles.settingCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
            <View style={styles.settingRow}>
              <View style={[styles.settingIconContainer, { backgroundColor: isDark ? theme.backgroundTertiary : Colors.light.primary + "20" }]}>
                <Feather name="moon" size={20} color={theme.primary} />
              </View>
              <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_600SemiBold" }}>
                {t("darkMode")}
              </ThemedText>
              <Switch
                value={themeMode === "dark"}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: theme.border, true: Colors.light.secondary }}
                thumbColor={themeMode === "dark" ? "#fff" : "#fff"}
              />
            </View>
          </View>

          <View style={[styles.settingCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
            <View style={styles.settingHeader}>
              <View style={[styles.settingIconContainer, { backgroundColor: isDark ? theme.backgroundTertiary : Colors.light.secondary + "20" }]}>
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
            onPress={openMessageModal}
            style={[styles.settingCard, styles.messageCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
          >
            <View style={styles.settingRow}>
              <View style={[styles.settingIconContainer, { backgroundColor: Colors.light.primary + "30" }]}>
                <Feather name="heart" size={20} color={Colors.light.primary} />
              </View>
              <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_600SemiBold" }}>
                {t("messageForYou")}
              </ThemedText>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
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
            <View style={styles.heartIconContainer}>
              <Feather name="heart" size={32} color={Colors.light.primary} />
            </View>
            <ThemedText type="h4" style={{ fontFamily: "Nunito_700Bold", textAlign: "center", marginTop: Spacing.lg }}>
              {t("messageForYou")}
            </ThemedText>
            <ThemedText
              type="body"
              style={{ fontFamily: "Nunito_400Regular", textAlign: "center", marginTop: Spacing.md, lineHeight: 26 }}
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
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  settingsContainer: {
    width: "100%",
    marginTop: Spacing["3xl"],
    gap: Spacing.md,
  },
  settingCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
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
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    alignItems: "center",
  },
  heartIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    marginTop: Spacing["2xl"],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing["3xl"],
    borderRadius: BorderRadius.full,
  },
});
