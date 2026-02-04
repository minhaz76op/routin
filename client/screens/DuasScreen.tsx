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
    id: "quran-protection",
    title: { en: "Protection from Quran", bn: "কুরআনের সুরক্ষা" },
    icon: "shield",
    iconColor: "#7C7CD9",
    duas: [
      {
        id: "ayatul-kursi",
        titleKey: "ayatulKursi",
        title: { en: "Ayatul Kursi", bn: "আয়াতুল কুরসি" },
        arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnihi? Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'im-min 'ilmihi illa bi-ma sha'. Wasi'a kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifdhuhuma wa Huwal-'Aliyyul-'Adhim.",
        meaning: {
          en: "Allah! There is no god but He, the Living, the Self-subsisting, Eternal. No slumber can seize Him nor sleep. His are all things in the heavens and on earth.",
          bn: "আল্লাহ ছাড়া অন্য কোন উপাস্য নেই, তিনি জীবিত ও সবকিছুর ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আসমান ও যমীনে যা কিছু আছে সব তাঁরই।"
        },
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/ayatul-kursi.ogg",
      },
      {
        id: "ikhlas",
        titleKey: "surahIkhlas",
        title: { en: "Surah Al-Ikhlas", bn: "সূরা আল-ইখলাস" },
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Qul huwallahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
        meaning: {
          en: "Say, 'He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'",
          bn: "বলুন, তিনি আল্লাহ, এক। আল্লাহ অমুখাপেক্ষী। তিনি কাউকে জন্ম দেননি এবং কেউ তাঁকে জন্ম দেয়নি এবং তাঁর সমতুল্য কেউ নেই।"
        },
      },
    ],
  },
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-after-waking-up-from-sleep.ogg",
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-at-the-time-of-sunrise.ogg",
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-at-the-time-of-sunset.ogg",
      },
      {
        id: "10",
        titleKey: "sleepDua",
        title: { en: "Dua Before Sleeping", bn: "ঘুমানোর আগে দোয়া" },
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya",
        meaning: {
          en: "In Your name, O Allah, I die and I live.",
          bn: "হে আল্লাহ, আপনার নামে আমি মৃত্যু বরণ করি এবং জীবিত হই।"
        },
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-before-sleeping.ogg",
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-to-be-recited-while-feeling-sick.ogg",
      },
      {
        id: "11",
        titleKey: "clothesDua",
        title: { en: "Dua After Wearing Clothes", bn: "কাপড় পরার পর দোয়া" },
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
        transliteration: "Alhamdulillahil-ladhi kasani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
        meaning: {
          en: "All praise is for Allah who has clothed me with this and provided it for me.",
          bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাকে এই কাপড় পরিয়েছেন।"
        },
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-after-wearing-clothes.ogg",
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-for-trouble.ogg",
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-to-get-rid-of-tiredness.ogg",
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-for-asking-forgiveness.ogg",
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-before-eating.ogg",
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
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-after-eating.ogg",
      },
      {
        id: "12",
        titleKey: "drinkingWaterDua",
        title: { en: "Dua After Drinking Water", bn: "পানি পানের পর দোয়া" },
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي سَقَانَا عَذْبًا فُرَاتًا بِরَحْمَتِهِ",
        transliteration: "Alhamdulillahil-ladhi saqana 'adhban furatan bi-rahmatihi",
        meaning: {
          en: "All praise is for Allah who gave us sweet water to drink by His mercy.",
          bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি তাঁর রহমতে আমাদের মিষ্টি পানি পান করিয়েছেন।"
        },
        audioUrl: "https://archive.org/download/islamic-dua-in-audio/dua-after-drinking-water.ogg",
      },
      {
        id: "13",
        titleKey: "milkDua",
        title: { en: "Dua After Drinking Milk", bn: "দুধ পানের পর দোয়া" },
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ",
        transliteration: "Allahumma barik lana fihi wa zidna minhu",
        meaning: {
          en: "O Allah, bless us in it and give us more of it.",
          bn: "হে আল্লাহ, এতে আমাদের বরকত দিন এবং আরও বৃদ্ধি করে দিন।"
        },
      },
    ],
  },
  {
    id: "success-knowledge",
    title: { en: "Success & Knowledge", bn: "সফলতা ও জ্ঞান" },
    icon: "book",
    iconColor: "#F4D03F",
    duas: [
      {
        id: "14",
        titleKey: "knowledgeDua",
        title: { en: "Dua for Knowledge", bn: "জ্ঞানের জন্য দোয়া" },
        arabic: "رَّبِّ زِدْنِي عِلْمًا",
        transliteration: "Rabbi zidni 'ilma",
        meaning: {
          en: "My Lord, increase me in knowledge.",
          bn: "হে আমার রব, আমার জ্ঞান বৃদ্ধি করে দিন।"
        },
      },
      {
        id: "15",
        titleKey: "easeDua",
        title: { en: "Dua for Ease in Tasks", bn: "কাজে সহজতার দোয়া" },
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
        transliteration: "Rabbi-shrah li sadri, wa yassir li amri",
        meaning: {
          en: "My Lord, expand for me my chest [with assurance] and ease for me my task.",
          bn: "হে আমার রব, আমার বক্ষ প্রশস্ত করে দিন এবং আমার কাজ সহজ করে দিন।"
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
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const getText = (textItem: { en: string; bn: string }) => language === "bn" ? textItem.bn : textItem.en;

  function encodeBase64Url(text: string): string {
    const bytes = new TextEncoder().encode(text);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    const base64 = btoa(binString);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  async function playSound() {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const apiUrl = process.env.EXPO_PUBLIC_DOMAIN || "";
      const hash = encodeBase64Url(dua.arabic);
      const audioUri = `${apiUrl}/api/tts/${hash}`;
      
      setPlaying(true);
      setLoading(false);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
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
      setLoading(false);
      setPlaying(false);
    }
  }

  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={[styles.duaItem, { backgroundColor: theme.backgroundSecondary }]}>
      <Pressable 
        onPress={playSound}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, flex: 1 }]}
      >
        <View style={styles.duaImageContainer}>
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.duaImageGradient}
          />
          <View style={[styles.duaIconBadge, { backgroundColor: iconColor + "40" }]}>
            <Feather name="activity" size={20} color="#fff" />
          </View>
        </View>
        
        <View style={styles.duaFooter}>
          <ThemedText type="h4" style={styles.duaTitle}>
            {getText(dua.title)}
          </ThemedText>
          <ThemedText style={[styles.duaSubtitle, { color: theme.textSecondary }]}>
            View your daily {getText(dua.title).toLowerCase()} routine
          </ThemedText>

          <View style={[styles.viewDetailsButton, { backgroundColor: iconColor + "20" }]}>
            <ThemedText style={[styles.viewDetailsText, { color: iconColor }]}>
              {loading ? "Loading..." : playing ? "Playing..." : "View Details →"}
            </ThemedText>
          </View>
        </View>
      </Pressable>
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
      <View style={styles.sectionHeader}>
        <ThemedText type="h3" style={{ fontFamily: "Nunito_700Bold" }}>
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
  duaItem: {
    borderRadius: 24,
    marginBottom: Spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  duaImageContainer: {
    height: 180,
    backgroundColor: "#e0d5c1", // Placeholder like the image background
    position: "relative",
  },
  duaImageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  duaIconBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  duaFooter: {
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  duaTitle: {
    color: "#fff",
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    marginBottom: 4,
  },
  duaSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    marginBottom: 20,
  },
  viewDetailsButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
  },
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
  sectionHeader: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  duasList: {
    gap: Spacing.md,
  },
});
