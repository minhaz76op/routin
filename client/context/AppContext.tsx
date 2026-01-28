import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Language = "en" | "bn";
type ThemeMode = "light" | "dark" | "system";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: "Routine For Juhi",
    todaysRoutine: "Today's Routine",
    resources: "Resources",
    profile: "Profile",
    settings: "Settings",
    darkMode: "Dark Mode",
    language: "Language",
    messageForYou: "Message for You",
    foodChart: "Food Chart",
    dailyExercise: "Daily Exercise",
    earlyMorning: "Early Morning",
    breakfast: "Breakfast",
    midMorningSnack: "Mid-Morning Snack",
    lunch: "Lunch",
    eveningSnack: "Evening Snack",
    dinner: "Dinner",
    beforeBed: "Before Bed",
    lifestyleTips: "Lifestyle Tips",
    benefits: "Benefits",
    avoid: "Avoid",
    option: "Option",
    or: "or",
    english: "English",
    bangla: "Bangla",
    close: "Close",
    loveMessage: "Love you, dear. This App is only for you. Take care of yourself",
    afterWakingUp: "After Waking Up",
    mostImportantMeal: "Most Important Meal",
    around11AM: "Around 11 AM",
    plateMethod: "Use the plate method",
    eatBefore8PM: "Eat before 8 PM",
    ifFeelingWeak: "If feeling weak",
    exercise: "Exercise",
    sleep: "Sleep",
    hydration: "Hydration",
    avoidSugarProcessed: "Avoid Sugar & Processed Foods",
    stressManagement: "Stress Management",
    seeDoctor: "See a Doctor If",
    walking: "30 minutes walking daily",
    lightCardio: "Light cardio, skipping, or yoga",
    sleepHours: "7-8 hours",
    sleepBefore: "Sleep before 11 PM",
    waterIntake: "2.5-3 liters of water daily",
    softDrinks: "Soft drinks",
    sweets: "Sweets",
    bakeryItems: "Bakery items",
    packagedJuices: "Packaged juices",
    deepBreathing: "Deep breathing, prayer/meditation, music, light walks",
    periodsStop: "Periods stop for 2-3 months",
    excessiveHairFall: "Excessive hair fall",
    severeAcne: "Severe acne",
    suddenWeightGain: "Sudden weight gain",
    viewFoodRecommendations: "View detailed food recommendations",
    viewExerciseRoutine: "View your daily exercise routine",
    halfPlate: "Half plate: Vegetables",
    quarterProtein: "One quarter: Protein",
    quarterRice: "One quarter: Rice",
    addFreshSalad: "Add fresh salad",
    lightMeal: "Light Meal",
    warmMilk: "1 glass warm milk",
    dateAlmonds: "1 date + 2 almonds",
  },
  bn: {
    appName: "জুহির রুটিন",
    todaysRoutine: "আজকের রুটিন",
    resources: "রিসোর্স",
    profile: "প্রোফাইল",
    settings: "সেটিংস",
    darkMode: "ডার্ক মোড",
    language: "ভাষা",
    messageForYou: "তোমার জন্য বার্তা",
    foodChart: "খাদ্য তালিকা",
    dailyExercise: "দৈনিক ব্যায়াম",
    earlyMorning: "ভোরবেলা",
    breakfast: "সকালের নাস্তা",
    midMorningSnack: "মধ্য-সকালের নাস্তা",
    lunch: "দুপুরের খাবার",
    eveningSnack: "বিকেলের নাস্তা",
    dinner: "রাতের খাবার",
    beforeBed: "ঘুমানোর আগে",
    lifestyleTips: "স্বাস্থ্যকর জীবনযাপনের টিপস",
    benefits: "উপকারিতা",
    avoid: "এড়িয়ে চলুন",
    option: "অপশন",
    or: "অথবা",
    english: "ইংরেজি",
    bangla: "বাংলা",
    close: "বন্ধ করুন",
    loveMessage: "ভালোবাসি তোমাকে, প্রিয়। এই অ্যাপটি শুধুমাত্র তোমার জন্য। নিজের যত্ন নাও",
    afterWakingUp: "ঘুম থেকে উঠার পর",
    mostImportantMeal: "সবচেয়ে গুরুত্বপূর্ণ খাবার",
    around11AM: "সকাল ১১টার দিকে",
    plateMethod: "প্লেট মেথড ব্যবহার করুন",
    eatBefore8PM: "রাত ৮টার আগে খান",
    ifFeelingWeak: "দুর্বল লাগলে",
    exercise: "ব্যায়াম",
    sleep: "ঘুম",
    hydration: "পানি পান",
    avoidSugarProcessed: "চিনি ও প্রক্রিয়াজাত খাবার এড়িয়ে চলুন",
    stressManagement: "মানসিক চাপ নিয়ন্ত্রণ",
    seeDoctor: "ডাক্তার দেখান যদি",
    walking: "প্রতিদিন ৩০ মিনিট হাঁটা",
    lightCardio: "হালকা কার্ডিও, স্কিপিং, বা যোগব্যায়াম",
    sleepHours: "৭-৮ ঘণ্টা",
    sleepBefore: "রাত ১১টার আগে ঘুমান",
    waterIntake: "প্রতিদিন ২.৫-৩ লিটার পানি",
    softDrinks: "কোমল পানীয়",
    sweets: "মিষ্টি",
    bakeryItems: "বেকারি আইটেম",
    packagedJuices: "প্যাকেটজাত জুস",
    deepBreathing: "গভীর শ্বাস, প্রার্থনা/ধ্যান, সঙ্গীত, হালকা হাঁটা",
    periodsStop: "পিরিয়ড ২-৩ মাস বন্ধ থাকলে",
    excessiveHairFall: "অতিরিক্ত চুল পড়লে",
    severeAcne: "তীব্র ব্রণ হলে",
    suddenWeightGain: "হঠাৎ ওজন বাড়লে",
    viewFoodRecommendations: "বিস্তারিত খাদ্য সুপারিশ দেখুন",
    viewExerciseRoutine: "আপনার দৈনিক ব্যায়ামের রুটিন দেখুন",
    halfPlate: "অর্ধেক প্লেট: সবজি",
    quarterProtein: "এক চতুর্থাংশ: প্রোটিন",
    quarterRice: "এক চতুর্থাংশ: ভাত",
    addFreshSalad: "তাজা সালাদ যোগ করুন",
    lightMeal: "হালকা খাবার",
    warmMilk: "১ গ্লাস গরম দুধ",
    dateAlmonds: "১টি খেজুর + ২টি বাদাম",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      const savedTheme = await AsyncStorage.getItem("themeMode");
      if (savedLanguage) setLanguageState(savedLanguage as Language);
      if (savedTheme) setThemeModeState(savedTheme as ThemeMode);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem("language", lang);
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem("themeMode", mode);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, themeMode, setThemeMode, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
