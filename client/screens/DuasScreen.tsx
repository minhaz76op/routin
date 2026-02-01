import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Audio, AVPlaybackStatus } from "expo-av";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
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
  icon: keyof typeof Feather.glyphMap;
  color: string;
  category: string;
  audioUrl?: string;
}

const duas: Dua[] = [
  {
    id: "1",
    titleKey: "wakeUpDua",
    title: { en: "Dua After Waking Up", bn: "ঘুম থেকে উঠার পর দোয়া" },
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
    meaning: {
      en: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের মৃত্যুর পর জীবিত করেছেন এবং তাঁর কাছেই পুনরুত্থান।"
    },
    icon: "sunrise",
    color: "#FFB347",
    category: "morning",
    audioUrl: "https://www.islamcan.com/audio/duas/wake-up.mp3",
  },
  {
    id: "2",
    titleKey: "morningDua",
    title: { en: "Morning Dua", bn: "সকালের দোয়া" },
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّশُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
    meaning: {
      en: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
      bn: "হে আল্লাহ, আপনার অনুমতিতে আমরা সকালে উঠেছি এবং আপনার অনুমতিতে সন্ধ্যায় পৌঁছেছি, আপনার অনুমতিতে আমরা বাঁচি ও মরি এবং আপনার কাছেই আমাদের পুনরুত্থান।"
    },
    icon: "sun",
    color: "#F4D03F",
    category: "morning",
    audioUrl: "https://www.islamcan.com/audio/duas/morning-dua.mp3",
  },
  {
    id: "3",
    titleKey: "eveningDua",
    title: { en: "Evening Dua", bn: "সন্ধ্যার দোয়া" },
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَবِكَ নَحْيَا وَবِكَ নَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
    meaning: {
      en: "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.",
      bn: "হে আল্লাহ, আপনার অনুমতিতে আমরা সন্ধ্যায় পৌঁছেছি এবং আপনার অনুমতিতে সকালে উঠেছি, আপনার অনুমতিতে আমরা বাঁচি ও মরি এবং আপনার কাছেই আমাদের প্রত্যাবর্তন।"
    },
    icon: "sunset",
    color: "#E67E22",
    category: "evening",
    audioUrl: "https://www.islamcan.com/audio/duas/evening-dua.mp3",
  },
  {
    id: "4",
    titleKey: "healthDua",
    title: { en: "Dua for Good Health", bn: "সুস্বাস্থ্যের জন্য দোয়া" },
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ",
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa anta",
    meaning: {
      en: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is no god but You.",
      bn: "হে আল্লাহ, আমার শরীরে সুস্থতা দান করুন। হে আল্লাহ, আমার শ্রবণে সুস্থতা দান করুন। হে আল্লাহ, আমার দৃষ্টিতে সুস্থতা দান করুন। আপনি ছাড়া কোন ইলাহ নেই।"
    },
    icon: "heart",
    color: "#E8A5A5",
    category: "health",
  },
  {
    id: "5",
    titleKey: "moodDua",
    title: { en: "Dua for Peace of Mind", bn: "মনের শান্তির জন্য দোয়া" },
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَসَلِ وَالْبُখ্লি وَالْجُব্নি وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani wal-'ajzi wal-kasali wal-bukhli wal-jubni wa dala'id-dayni wa ghalabatir-rijal",
    meaning: {
      en: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
      bn: "হে আল্লাহ, আমি আপনার কাছে দুশ্চিন্তা ও দুঃখ, দুর্বলতা ও অলসতা, কৃপণতা ও কাপুরুষতা, ঋণের বোঝা এবং মানুষের প্রভাব থেকে আশ্রয় চাই।"
    },
    icon: "smile",
    color: "#A8D5A8",
    category: "mood",
  },
  {
    id: "6",
    titleKey: "stressDua",
    title: { en: "Dua When Stressed", bn: "মানসিক চাপে দোয়া" },
    arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ الْعَظِيمُ الْحَلِيمُ، لاَ إِلَهَ إِلاَّ اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لاَ إِلَهَ إِلاَّ اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    transliteration: "La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim",
    meaning: {
      en: "There is no god but Allah, the Mighty, the Forbearing. There is no god but Allah, Lord of the Magnificent Throne. There is no god but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
      bn: "আল্লাহ ছাড়া কোন ইলাহ নেই, যিনি মহান ও সহনশীল। আল্লাহ ছাড়া কোন ইলাহ নেই, মহান আরশের রব। আল্লাহ ছাড়া কোন ইলাহ নেই, আসমান ও জমিনের রব, সম্মানিত আরশের রব।"
    },
    icon: "shield",
    color: "#3498DB",
    category: "mood",
  },
  {
    id: "7",
    titleKey: "sadnessDua",
    title: { en: "Dua When Sad", bn: "দুঃখের সময় দোয়া" },
    arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ",
    transliteration: "Allahumma inni 'abduka, ibnu 'abdika, ibnu amatika, nasiyati biyadika, madin fiyya hukmuka, 'adlun fiyya qada'uka",
    meaning: {
      en: "O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand. Your command over me is forever executed and Your decree over me is just.",
      bn: "হে আল্লাহ, আমি আপনার বান্দা, আপনার বান্দার সন্তান, আপনার বাঁদির সন্তান। আমার কপাল আপনার হাতে। আমার উপর আপনার হুকুম কার্যকর এবং আমার উপর আপনার ফয়সালা ন্যায়সঙ্গত।"
    },
    icon: "cloud-rain",
    color: "#9B59B6",
    category: "mood",
  },
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
    icon: "coffee",
    color: "#85C1E9",
    category: "eating",
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
    icon: "check-circle",
    color: "#7CB87C",
    category: "eating",
  },
];

function DuaCard({ item, index }: { item: Dua; index: number }) {
  const { theme } = useTheme();
  const { language } = useApp();
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const scale = useSharedValue(1);

  async function playSound() {
    if (!item.audioUrl) {
      alert("Audio not available for this Dua");
      return;
    }
    
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      setPlaying(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: item.audioUrl },
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, 100);
  };

  const getText = (textItem: { en: string; bn: string }) => language === "bn" ? textItem.bn : textItem.en;

  return (
    <Animated.View entering={FadeInUp.delay(100 + index * 50).springify()}>
      <Pressable onPress={handlePress}>
        <Animated.View style={[styles.card, { backgroundColor: theme.backgroundDefault }, animatedStyle]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
              <Feather name={item.icon} size={22} color={item.color} />
            </View>
            <ThemedText type="h4" style={{ flex: 1, marginLeft: Spacing.md, fontFamily: "Nunito_600SemiBold" }}>
              {getText(item.title)}
            </ThemedText>
            <Pressable 
              onPress={playSound}
              style={[styles.audioButton, { backgroundColor: item.color + "20" }]}
            >
              {playing ? (
                <ActivityIndicator size="small" color={item.color} />
              ) : (
                <Feather name="play" size={18} color={item.color} />
              )}
            </Pressable>
          </View>
          
          <View style={styles.cardContent}>
            <ThemedText style={styles.arabicText}>{item.arabic}</ThemedText>
            <ThemedText style={[styles.transliteration, { color: theme.textSecondary }]}>{item.transliteration}</ThemedText>
            <View style={styles.meaningContainer}>
              <Feather name="info" size={14} color={item.color} style={{ marginTop: 3, marginRight: 8 }} />
              <ThemedText type="body" style={{ flex: 1, color: theme.text, fontFamily: "Nunito_400Regular" }}>
                {getText(item.meaning)}
              </ThemedText>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function DuasScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t } = useApp();

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.headerSection}>
        <LinearGradient
          colors={[Colors.light.primary + "20", Colors.light.secondary + "15"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Feather name="book-open" size={40} color={Colors.light.primary} />
          <ThemedText type="h2" style={{ marginTop: Spacing.md, fontFamily: "Nunito_700Bold" }}>
            {t("duas")}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs }}>
            {t("duasSubtitle")}
          </ThemedText>
        </LinearGradient>
      </Animated.View>

      {duas.map((dua, index) => (
        <DuaCard key={dua.id} item={dua} index={index} />
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
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    marginTop: Spacing.xs,
  },
  arabicText: {
    fontSize: 22,
    textAlign: "right",
    lineHeight: 40,
    marginBottom: Spacing.md,
    fontFamily: "Nunito_700Bold",
  },
  transliteration: {
    fontStyle: "italic",
    marginBottom: Spacing.md,
    fontFamily: "Nunito_400Regular",
  },
  meaningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(0,0,0,0.02)",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
});
