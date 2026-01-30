import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Platform, ActivityIndicator } from "react-native";
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
import { getApiUrl } from "@/lib/query-client";

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
  },
  {
    id: "2",
    titleKey: "morningDua",
    title: { en: "Morning Dua", bn: "সকালের দোয়া" },
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
    meaning: {
      en: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
      bn: "হে আল্লাহ, আপনার অনুমতিতে আমরা সকালে উঠেছি এবং আপনার অনুমতিতে সন্ধ্যায় পৌঁছেছি, আপনার অনুমতিতে আমরা বাঁচি ও মরি এবং আপনার কাছেই আমাদের পুনরুত্থান।"
    },
    icon: "sun",
    color: "#F4D03F",
    category: "morning",
  },
  {
    id: "3",
    titleKey: "eveningDua",
    title: { en: "Evening Dua", bn: "সন্ধ্যার দোয়া" },
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
    meaning: {
      en: "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.",
      bn: "হে আল্লাহ, আপনার অনুমতিতে আমরা সন্ধ্যায় পৌঁছেছি এবং আপনার অনুমতিতে সকালে উঠেছি, আপনার অনুমতিতে আমরা বাঁচি ও মরি এবং আপনার কাছেই আমাদের প্রত্যাবর্তন।"
    },
    icon: "sunset",
    color: "#E67E22",
    category: "evening",
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
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
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
  {
    id: "10",
    titleKey: "drinkingDua",
    title: { en: "Dua Before Drinking Water", bn: "পানি পানের আগে দোয়া" },
    arabic: "بِسْمِ اللهِ",
    transliteration: "Bismillah",
    meaning: {
      en: "In the name of Allah.",
      bn: "আল্লাহর নামে।"
    },
    icon: "droplet",
    color: "#5DADE2",
    category: "eating",
  },
  {
    id: "11",
    titleKey: "afterDrinkingDua",
    title: { en: "Dua After Drinking Water", bn: "পানি পানের পরে দোয়া" },
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي سَقَانَا عَذْبًا فُرَاتًا بِرَحْمَتِهِ وَلَمْ يَجْعَلْهُ مِلْحًا أُجَاجًا بِذُنُوبِنَا",
    transliteration: "Alhamdulillahil-ladhi saqana 'adhban furatan birahmatih, wa lam yaj'alhu milhan ujajan bidhunubina",
    meaning: {
      en: "All praise is for Allah who gave us sweet, fresh water by His mercy and did not make it salty and bitter because of our sins.",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি তাঁর রহমতে আমাদের মিষ্টি, সুপেয় পানি দিয়েছেন এবং আমাদের পাপের কারণে তা লবণাক্ত ও তিক্ত করেননি।"
    },
    icon: "droplet",
    color: "#2980B9",
    category: "eating",
  },
  {
    id: "12",
    titleKey: "sleepDua",
    title: { en: "Dua Before Sleep", bn: "ঘুমানোর আগে দোয়া" },
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    meaning: {
      en: "In Your name O Allah, I die and I live.",
      bn: "হে আল্লাহ, আপনার নামে আমি মৃত্যুবরণ করি এবং জীবিত হই।"
    },
    icon: "moon",
    color: "#7C7CD9",
    category: "sleep",
  },
  {
    id: "13",
    titleKey: "sleepDua2",
    title: { en: "Dua for Peaceful Sleep", bn: "শান্তির ঘুমের জন্য দোয়া" },
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    meaning: {
      en: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
      bn: "হে আল্লাহ, যেদিন আপনি আপনার বান্দাদের পুনরুত্থিত করবেন সেদিন আমাকে আপনার শাস্তি থেকে রক্ষা করুন।"
    },
    icon: "star",
    color: "#8E44AD",
    category: "sleep",
  },
  {
    id: "14",
    titleKey: "exerciseDua",
    title: { en: "Dua for Strength", bn: "শক্তির জন্য দোয়া" },
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الصِّحَّةَ وَالْعَافِيَةَ وَالأَمَانَةَ وَحُسْنَ الْخُلُقِ وَالرِّضَا بِالْقَدَرِ",
    transliteration: "Allahumma inni as'alukas-sihhata wal-'afiyata wal-amanata wa husnal-khuluqi war-rida bil-qadar",
    meaning: {
      en: "O Allah, I ask You for health, wellness, trustworthiness, good character, and acceptance of destiny.",
      bn: "হে আল্লাহ, আমি আপনার কাছে সুস্বাস্থ্য, সুস্থতা, বিশ্বস্ততা, সুন্দর চরিত্র এবং তাকদিরের প্রতি সন্তুষ্টি চাই।"
    },
    icon: "activity",
    color: "#E74C3C",
    category: "health",
  },
  {
    id: "15",
    titleKey: "healingDua",
    title: { en: "Dua for Healing", bn: "সুস্থতার জন্য দোয়া" },
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ، شِفَاءً لاَ يُغَادِرُ سَقَماً",
    transliteration: "Allahumma Rabban-nas, adhhibil-ba's, ishfi antash-Shafi, la shifa'a illa shifa'uka, shifa'an la yughadiru saqama",
    meaning: {
      en: "O Allah, Lord of mankind, remove the illness, cure the disease. You are the One who cures. There is no cure except Your cure. Grant a cure that leaves no illness behind.",
      bn: "হে আল্লাহ, মানবজাতির রব, কষ্ট দূর করুন, রোগ নিরাময় করুন। আপনিই একমাত্র আরোগ্যদাতা। আপনার আরোগ্য ছাড়া কোন আরোগ্য নেই। এমন আরোগ্য দান করুন যা কোন রোগ রেখে যায় না।"
    },
    icon: "plus-circle",
    color: "#1ABC9C",
    category: "health",
  },
  {
    id: "16",
    titleKey: "thankfulDua",
    title: { en: "Dua of Gratitude", bn: "শুকরিয়ার দোয়া" },
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
    transliteration: "Alhamdulillahil-ladhi bini'matihi tatimmus-salihat",
    meaning: {
      en: "All praise is for Allah by whose blessings all good things are perfected.",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যাঁর নেয়ামতে সকল ভালো কাজ সম্পন্ন হয়।"
    },
    icon: "gift",
    color: "#F39C12",
    category: "daily",
  },
  {
    id: "17",
    titleKey: "protectionDua",
    title: { en: "Dua for Protection", bn: "সুরক্ষার জন্য দোয়া" },
    arabic: "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim",
    meaning: {
      en: "In the name of Allah, with whose name nothing in the earth or sky can cause harm, and He is the All-Hearing, All-Knowing.",
      bn: "আল্লাহর নামে, যাঁর নামের সাথে আসমান ও জমিনে কোন কিছুই ক্ষতি করতে পারে না এবং তিনি সর্বশ্রোতা, সর্বজ্ঞ।"
    },
    icon: "shield",
    color: "#16A085",
    category: "daily",
  },
  {
    id: "18",
    titleKey: "leavingHomeDua",
    title: { en: "Dua When Leaving Home", bn: "ঘর থেকে বের হওয়ার দোয়া" },
    arabic: "بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللهِ",
    transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah",
    meaning: {
      en: "In the name of Allah, I place my trust in Allah, and there is no might or power except with Allah.",
      bn: "আল্লাহর নামে, আমি আল্লাহর উপর ভরসা করছি, আর আল্লাহ ছাড়া কোন শক্তি ও ক্ষমতা নেই।"
    },
    icon: "home",
    color: "#27AE60",
    category: "daily",
  },
  {
    id: "19",
    titleKey: "enteringHomeDua",
    title: { en: "Dua When Entering Home", bn: "ঘরে প্রবেশের দোয়া" },
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Allahumma inni as'aluka khayral-mawliji wa khayral-makhraji, bismillahi walajna, wa bismillahi kharajna, wa 'alallahi Rabbina tawakkalna",
    meaning: {
      en: "O Allah, I ask You for the best entry and the best exit. In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.",
      bn: "হে আল্লাহ, আমি আপনার কাছে উত্তম প্রবেশ ও উত্তম বের হওয়া চাই। আল্লাহর নামে আমরা প্রবেশ করি, আল্লাহর নামে আমরা বের হই এবং আমাদের রব আল্লাহর উপর আমরা ভরসা করি।"
    },
    icon: "log-in",
    color: "#2ECC71",
    category: "daily",
  },
  {
    id: "20",
    titleKey: "mirrorDua",
    title: { en: "Dua When Looking in Mirror", bn: "আয়নায় দেখার সময় দোয়া" },
    arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
    transliteration: "Allahumma anta hassanta khalqi fahassin khuluqi",
    meaning: {
      en: "O Allah, You have made my physical form beautiful, so beautify my character as well.",
      bn: "হে আল্লাহ, আপনি আমার আকৃতি সুন্দর করেছেন, তাই আমার চরিত্রও সুন্দর করে দিন।"
    },
    icon: "eye",
    color: "#E8A5A5",
    category: "daily",
  },
  {
    id: "21",
    titleKey: "dressingDua",
    title: { en: "Dua When Wearing Clothes", bn: "পোশাক পরার সময় দোয়া" },
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
    transliteration: "Alhamdulillahil-ladhi kasani hadha-th-thawba wa razaqanihi min ghayri hawlin minni wa la quwwah",
    meaning: {
      en: "All praise is for Allah who has clothed me with this garment and provided it for me without any power or might from myself.",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাকে এই পোশাক পরিয়েছেন এবং আমার কোন শক্তি বা সামর্থ্য ছাড়াই এটা আমাকে দান করেছেন।"
    },
    icon: "award",
    color: "#9B59B6",
    category: "daily",
  },
  {
    id: "22",
    titleKey: "difficultyDua",
    title: { en: "Dua in Difficult Times", bn: "কঠিন সময়ে দোয়া" },
    arabic: "حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal-wakil",
    meaning: {
      en: "Allah is sufficient for us and He is the best disposer of affairs.",
      bn: "আল্লাহই আমাদের জন্য যথেষ্ট এবং তিনি সর্বোত্তম কর্মবিধায়ক।"
    },
    icon: "anchor",
    color: "#34495E",
    category: "mood",
  },
  {
    id: "23",
    titleKey: "forgivingDua",
    title: { en: "Dua for Forgiveness", bn: "ক্ষমার জন্য দোয়া" },
    arabic: "أَسْتَغْفِرُ اللهَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha-lladhi la ilaha illa huwal-Hayyul-Qayyumu wa atubu ilayh",
    meaning: {
      en: "I seek forgiveness from Allah, there is no god but He, the Ever-Living, the Self-Subsisting, and I repent to Him.",
      bn: "আমি আল্লাহর কাছে ক্ষমা চাই, তিনি ছাড়া কোন ইলাহ নেই, তিনি চিরঞ্জীব, স্বয়ংসম্পূর্ণ এবং আমি তাঁর কাছে তওবা করছি।"
    },
    icon: "refresh-cw",
    color: "#1ABC9C",
    category: "daily",
  },
  {
    id: "24",
    titleKey: "parentsDua",
    title: { en: "Dua for Parents", bn: "পিতামাতার জন্য দোয়া" },
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbighfir li wa liwalidayya warhamhuma kama rabbayani saghira",
    meaning: {
      en: "My Lord, forgive me and my parents, and have mercy upon them as they brought me up when I was small.",
      bn: "হে আমার রব, আমাকে ও আমার পিতামাতাকে ক্ষমা করুন এবং তাঁদের প্রতি রহম করুন যেমন তাঁরা আমাকে ছোটবেলায় লালন-পালন করেছেন।"
    },
    icon: "users",
    color: "#E8A5A5",
    category: "daily",
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PlayButton({ dua, isPlaying, isLoading, onPress }: { dua: Dua; isPlaying: boolean; isLoading: boolean; onPress: () => void }) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={isLoading}
      style={[
        styles.playButton,
        { backgroundColor: dua.color + "20", borderColor: dua.color },
        animatedStyle,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={dua.color} />
      ) : (
        <Feather name={isPlaying ? "pause" : "volume-2"} size={20} color={dua.color} />
      )}
    </AnimatedPressable>
  );
}

function DuaCard({ dua, index }: { dua: Dua; index: number }) {
  const { theme } = useTheme();
  const { language } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playAudio = async () => {
    if (isPlaying && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      return;
    }

    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(new URL("/api/tts", apiUrl).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: dua.arabic, voice: "shimmer" }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const data = await response.json();
      const audioUri = `data:audio/mp3;base64,${data.audio}`;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <Animated.View entering={FadeInUp.delay(100 + index * 50).springify()}>
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
            {language === "bn" ? dua.title.bn : dua.title.en}
          </ThemedText>
          <PlayButton dua={dua} isPlaying={isPlaying} isLoading={isLoading} onPress={playAudio} />
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
  const { language } = useApp();

  const headerTitle = language === "bn" ? "দৈনিক দোয়া সংকলন" : "Daily Duas Collection";
  const headerSubtitle = language === "bn" ? "২৪টি দোয়া - স্বাস্থ্য, মন ও দৈনন্দিন জীবনের জন্য" : "24 Duas - For health, peace of mind & daily life";
  const tapToPlayText = language === "bn" ? "শুনতে প্লে বাটন ট্যাপ করুন" : "Tap play button to listen";

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
          <View style={[styles.tipBadge, { backgroundColor: Colors.light.secondary + "20" }]}>
            <Feather name="volume-2" size={14} color={Colors.light.secondary} />
            <ThemedText type="small" style={{ color: Colors.light.secondary, marginLeft: Spacing.xs, fontFamily: "Nunito_500Medium" }}>
              {tapToPlayText}
            </ThemedText>
          </View>
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
  tipBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
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
  playButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  arabicContainer: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 38,
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
