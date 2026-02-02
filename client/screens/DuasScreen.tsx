import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Audio, AVPlaybackStatus } from "expo-av";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface Dua {
  id: string;
  titleKey: string;
  title: { en: string; bn: string };
  arabic: string;
  transliteration: string;
  meaning: { en: string; bn: string };
  audioUrl?: string;
}

interface DuaCategory {
  id: string;
  title: { en: string; bn: string };
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  duas: Dua[];
}

const duaCategories: DuaCategory[] = [
  {
    id: "morning-evening",
    title: { en: "Morning & Evening", bn: "সকাল ও সন্ধ্যা" },
    icon: "sunrise",
    iconColor: "#FFB347",
    duas: [
      {
        id: "1",
        titleKey: "wakeUpDua",
        title: { en: "Dua After Waking Up", bn: "ঘুম থেকে উঠার পর দোয়া" },
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
        meaning: {
          en: "All praise is for Allah who gave us life after having taken it from us.",
          bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের মৃত্যুর পর জীবিত করেছেন।"
        },
        audioUrl: "https://www.islamcan.com/audio/duas/wake-up.mp3",
      },
      {
        id: "2",
        titleKey: "morningDua",
        title: { en: "Morning Dua", bn: "সকালের দোয়া" },
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ",
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu",
        meaning: {
          en: "O Allah, by Your leave we have reached the morning, by Your leave we live and die.",
          bn: "হে আল্লাহ, আপনার অনুমতিতে আমরা সকালে উঠেছি, আপনার অনুমতিতে আমরা বাঁচি ও মরি।"
        },
        audioUrl: "https://www.islamcan.com/audio/duas/morning-dua.mp3",
      },
      {
        id: "3",
        titleKey: "eveningDua",
        title: { en: "Evening Dua", bn: "সন্ধ্যার দোয়া" },
        arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ",
        transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu",
        meaning: {
          en: "O Allah, by Your leave we have reached the evening, by Your leave we live and die.",
          bn: "হে আল্লাহ, আপনার অনুমতিতে আমরা সন্ধ্যায় পৌঁছেছি, আপনার অনুমতিতে আমরা বাঁচি ও মরি।"
        },
        audioUrl: "https://www.islamcan.com/audio/duas/evening-dua.mp3",
      },
    ],
  },
  {
    id: "health-wellbeing",
    title: { en: "Health & Wellbeing", bn: "স্বাস্থ্য ও মঙ্গল" },
    icon: "heart",
    iconColor: "#E8A5A5",
    duas: [
      {
        id: "4",
        titleKey: "healthDua",
        title: { en: "Dua for Good Health", bn: "সুস্বাস্থ্যের জন্য দোয়া" },
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
        transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari",
        meaning: {
          en: "O Allah, grant me health in my body, hearing, and sight.",
          bn: "হে আল্লাহ, আমার শরীরে, শ্রবণে ও দৃষ্টিতে সুস্থতা দান করুন।"
        },
      },
    ],
  },
  {
    id: "peace-of-mind",
    title: { en: "Peace of Mind", bn: "মনের শান্তি" },
    icon: "smile",
    iconColor: "#A8D5A8",
    duas: [
      {
        id: "5",
        titleKey: "moodDua",
        title: { en: "Dua for Peace of Mind", bn: "মনের শান্তির জন্য দোয়া" },
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ",
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani wal-'ajzi wal-kasali",
        meaning: {
          en: "O Allah, I seek refuge in You from anxiety, sorrow, weakness, and laziness.",
          bn: "হে আল্লাহ, আমি আপনার কাছে দুশ্চিন্তা, দুঃখ, দুর্বলতা ও অলসতা থেকে আশ্রয় চাই।"
        },
      },
      {
        id: "6",
        titleKey: "stressDua",
        title: { en: "Dua When Stressed", bn: "মানসিক চাপে দোয়া" },
        arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ الْعَظِيمُ الْحَلِيمُ، لاَ إِلَهَ إِلاَّ اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ",
        transliteration: "La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim",
        meaning: {
          en: "There is no god but Allah, the Mighty, the Forbearing. There is no god but Allah, Lord of the Magnificent Throne.",
          bn: "আল্লাহ ছাড়া কোন ইলাহ নেই, যিনি মহান ও সহনশীল। আল্লাহ ছাড়া কোন ইলাহ নেই, মহান আরশের রব।"
        },
      },
      {
        id: "7",
        titleKey: "sadnessDua",
        title: { en: "Dua When Sad", bn: "দুঃখের সময় দোয়া" },
        arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ",
        transliteration: "Allahumma inni 'abduka, ibnu 'abdika, ibnu amatika, nasiyati biyadika",
        meaning: {
          en: "O Allah, I am Your servant, son of Your servant. My forelock is in Your hand.",
          bn: "হে আল্লাহ, আমি আপনার বান্দা, আপনার বান্দার সন্তান। আমার কপাল আপনার হাতে।"
        },
      },
    ],
  },
  {
    id: "eating",
    title: { en: "Before & After Eating", bn: "খাওয়ার আগে ও পরে" },
    icon: "coffee",
    iconColor: "#85C1E9",
    duas: [
      {
        id: "8",
        titleKey: "eatingDua",
        title: { en: "Dua Before Eating", bn: "খাওয়ার আগে দোয়া" },
        arabic: "بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ",
        transliteration: "Bismillahi wa 'ala barakatillah",
        meaning: {
          en: "In the name of Allah and with the blessings of Allah.",
          bn: "আল্লাহর নামে এবং আল্লাহর বরকতে।"
        },
      },
      {
        id: "9",
        titleKey: "afterEatingDua",
        title: { en: "Dua After Eating", bn: "খাওয়ার পরে দোয়া" },
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
        meaning: {
          en: "All praise is for Allah who has given us food and drink and made us Muslims.",
          bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের খাদ্য ও পানীয় দিয়েছেন এবং আমাদের মুসলিম বানিয়েছেন।"
        },
      },
    ],
  },
];

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

interface DuaItemProps {
  dua: Dua;
  iconColor: string;
  delay: number;
  language: string;
}

function DuaItem({ dua, iconColor, delay, language }: DuaItemProps) {
  const { theme } = useTheme();
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const getText = (textItem: { en: string; bn: string }) => language === "bn" ? textItem.bn : textItem.en;

  async function playSound() {
    if (!dua.audioUrl) {
      return;
    }
    
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      setPlaying(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: dua.audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      
      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error playing sound", error);
      setPlaying(false);
    }
  }

  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.duaItem}>
      <View style={styles.duaHeader}>
        <View style={[styles.bullet, { backgroundColor: iconColor }]} />
        <ThemedText type="body" style={{ flex: 1, fontFamily: "Nunito_600SemiBold" }}>
          {getText(dua.title)}
        </ThemedText>
        {dua.audioUrl && (
          <Pressable onPress={playSound} style={[styles.audioButton, { backgroundColor: iconColor + "20" }]}>
            {playing ? (
              <ActivityIndicator size="small" color={iconColor} />
            ) : (
              <Feather name="play" size={14} color={iconColor} />
            )}
          </Pressable>
        )}
      </View>
      <View style={styles.duaContent}>
        <ThemedText style={styles.arabicText}>{dua.arabic}</ThemedText>
        <ThemedText style={[styles.transliteration, { color: theme.textSecondary }]}>
          {dua.transliteration}
        </ThemedText>
        <View style={[styles.meaningContainer, { backgroundColor: iconColor + "08" }]}>
          <Feather name="info" size={12} color={iconColor} style={{ marginTop: 2, marginRight: 6 }} />
          <ThemedText type="small" style={{ flex: 1, color: theme.text, fontFamily: "Nunito_400Regular" }}>
            {getText(dua.meaning)}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

interface DuaSectionProps {
  category: DuaCategory;
  delay: number;
  language: string;
}

function DuaSection({ category, delay, language }: DuaSectionProps) {
  const { theme } = useTheme();
  const getText = (textItem: { en: string; bn: string }) => language === "bn" ? textItem.bn : textItem.en;

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <LinearGradient
          colors={[category.iconColor + "08", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, { backgroundColor: category.iconColor + "20" }]}>
            <Feather name={category.icon} size={22} color={category.iconColor} />
          </View>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", flex: 1 }}>
            {getText(category.title)}
          </ThemedText>
        </View>
        <View style={styles.duasList}>
          {category.duas.map((dua, index) => (
            <DuaItem
              key={dua.id}
              dua={dua}
              iconColor={category.iconColor}
              delay={delay + index * 50}
              language={language}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export default function DuasScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const { t, language } = useApp();

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
          colors={isDark ? [theme.backgroundSecondary, theme.backgroundDefault] : ["#7C7CD9" + "15", Colors.light.primary + "10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.floatingIconsContainer}>
            <FloatingIcon icon="book-open" color="#7C7CD9" delay={0} />
            <FloatingIcon icon="star" color={Colors.light.primary} delay={300} />
            <FloatingIcon icon="heart" color={Colors.light.secondary} delay={600} />
          </View>
          <View style={styles.headerContent}>
            <Feather name="book-open" size={48} color="#7C7CD9" />
            <ThemedText type="h2" style={{ marginTop: Spacing.md, fontFamily: "Nunito_700Bold", textAlign: "center" }}>
              {t("duas")}
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs }}>
              {t("duasSubtitle")}
            </ThemedText>
          </View>
        </LinearGradient>
      </Animated.View>

      {duaCategories.map((category, index) => (
        <React.Fragment key={category.id}>
          <DuaSection
            category={category}
            delay={200 + index * 150}
            language={language}
          />
          {index < duaCategories.length - 1 && <View style={{ height: Spacing.md }} />}
        </React.Fragment>
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
    overflow: "hidden",
    position: "relative",
  },
  headerContent: {
    paddingVertical: Spacing["2xl"],
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
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
  duasList: {
    gap: Spacing.lg,
  },
  duaItem: {
    paddingTop: Spacing.sm,
  },
  duaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  audioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  duaContent: {
    marginLeft: Spacing.md + 8,
  },
  arabicText: {
    fontSize: 18,
    textAlign: "right",
    lineHeight: 32,
    marginBottom: Spacing.sm,
    fontFamily: "Nunito_700Bold",
  },
  transliteration: {
    fontStyle: "italic",
    fontSize: 13,
    marginBottom: Spacing.sm,
    fontFamily: "Nunito_400Regular",
  },
  meaningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
});
