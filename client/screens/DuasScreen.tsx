import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface Dua {
  id: string;
  titleKey: string;
  arabic: string;
  transliteration: string;
  meaning: { en: string; bn: string };
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

const duas: Dua[] = [
  {
    id: "1",
    titleKey: "wakeUpDua",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
    meaning: {
      en: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের মৃত্যুর পর জীবিত করেছেন এবং তাঁর কাছেই পুনরুত্থান।"
    },
    icon: "sunrise",
    color: "#FFB347",
  },
  {
    id: "2",
    titleKey: "morningDua",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
    meaning: {
      en: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
      bn: "হে আল্লাহ, আপনার অনুমতিতে আমরা সকালে উঠেছি এবং আপনার অনুমতিতে সন্ধ্যায় পৌঁছেছি, আপনার অনুমতিতে আমরা বাঁচি ও মরি এবং আপনার কাছেই আমাদের পুনরুত্থান।"
    },
    icon: "sun",
    color: "#F4D03F",
  },
  {
    id: "3",
    titleKey: "eveningDua",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
    meaning: {
      en: "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.",
      bn: "হে আল্লাহ, আপনার অনুমতিতে আমরা সন্ধ্যায় পৌঁছেছি এবং আপনার অনুমতিতে সকালে উঠেছি, আপনার অনুমতিতে আমরা বাঁচি ও মরি এবং আপনার কাছেই আমাদের প্রত্যাবর্তন।"
    },
    icon: "sunset",
    color: "#E67E22",
  },
  {
    id: "4",
    titleKey: "healthDua",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari",
    meaning: {
      en: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.",
      bn: "হে আল্লাহ, আমার শরীরে সুস্থতা দান করুন। হে আল্লাহ, আমার শ্রবণে সুস্থতা দান করুন। হে আল্লাহ, আমার দৃষ্টিতে সুস্থতা দান করুন।"
    },
    icon: "heart",
    color: "#E8A5A5",
  },
  {
    id: "5",
    titleKey: "moodDua",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani wal-'ajzi wal-kasali",
    meaning: {
      en: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness.",
      bn: "হে আল্লাহ, আমি আপনার কাছে দুশ্চিন্তা ও দুঃখ, দুর্বলতা ও অলসতা থেকে আশ্রয় চাই।"
    },
    icon: "smile",
    color: "#A8D5A8",
  },
  {
    id: "6",
    titleKey: "eatingDua",
    arabic: "بِسْمِ اللهِ",
    transliteration: "Bismillah",
    meaning: {
      en: "In the name of Allah.",
      bn: "আল্লাহর নামে।"
    },
    icon: "coffee",
    color: "#85C1E9",
  },
  {
    id: "7",
    titleKey: "afterEatingDua",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
    meaning: {
      en: "All praise is for Allah who has given us food and drink and made us Muslims.",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের খাদ্য ও পানীয় দিয়েছেন এবং আমাদের মুসলিম বানিয়েছেন।"
    },
    icon: "check-circle",
    color: "#7CB87C",
  },
  {
    id: "8",
    titleKey: "sleepDua",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    meaning: {
      en: "In Your name O Allah, I die and I live.",
      bn: "হে আল্লাহ, আপনার নামে আমি মৃত্যুবরণ করি এবং জীবিত হই।"
    },
    icon: "moon",
    color: "#7C7CD9",
  },
];

function DuaCard({ dua, index }: { dua: Dua; index: number }) {
  const { theme } = useTheme();
  const { t, language } = useApp();

  return (
    <Animated.View entering={FadeInUp.delay(150 + index * 100).springify()}>
      <View style={[styles.duaCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <LinearGradient
          colors={[dua.color + "10", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.duaHeader}>
          <View style={[styles.iconContainer, { backgroundColor: dua.color + "20" }]}>
            <Feather name={dua.icon} size={22} color={dua.color} />
          </View>
          <ThemedText type="h4" style={{ fontFamily: "Nunito_600SemiBold", flex: 1 }}>
            {t(dua.titleKey)}
          </ThemedText>
        </View>
        
        <View style={styles.arabicContainer}>
          <ThemedText style={styles.arabicText}>
            {dua.arabic}
          </ThemedText>
        </View>
        
        <View style={[styles.transliterationContainer, { backgroundColor: dua.color + "10" }]}>
          <ThemedText type="small" style={{ fontStyle: "italic", fontFamily: "Nunito_400Regular" }}>
            {dua.transliteration}
          </ThemedText>
        </View>
        
        <View style={styles.meaningContainer}>
          <Feather name="book-open" size={16} color={theme.textSecondary} />
          <ThemedText type="body" style={{ flex: 1, marginLeft: Spacing.sm, color: theme.textSecondary, fontFamily: "Nunito_400Regular" }}>
            {language === "bn" ? dua.meaning.bn : dua.meaning.en}
          </ThemedText>
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

  const headerTitle = language === "bn" ? "দৈনিক দোয়া" : "Daily Duas";
  const headerSubtitle = language === "bn" ? "স্বাস্থ্য ও মনের শান্তির জন্য" : "For health and peace of mind";

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
          <Feather name="book" size={48} color={Colors.light.secondary} />
          <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold", textAlign: "center", marginTop: Spacing.md }}>
            {headerTitle}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs, fontFamily: "Nunito_400Regular" }}>
            {headerSubtitle}
          </ThemedText>
        </LinearGradient>
      </Animated.View>

      {duas.map((dua, index) => (
        <View key={dua.id} style={{ marginBottom: Spacing.md }}>
          <DuaCard dua={dua} index={index} />
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
  duaCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  duaHeader: {
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
  arabicContainer: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: "center",
    fontFamily: "Nunito_400Regular",
  },
  transliterationContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  meaningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
