import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

type Language = "en" | "bn";
type ThemeMode = "light" | "dark";

interface Reminder {
  id: string;
  time: string;
  title: string;
  enabled: boolean;
}

interface CompletedRoutines {
  [date: string]: string[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  t: (key: string) => string;
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  toggleReminder: (id: string) => void;
  updateReminderTime: (id: string, time: string) => Promise<void>;
  hasNotificationPermission: boolean;
  requestNotificationPermission: () => Promise<boolean>;
  completedRoutines: CompletedRoutines;
  toggleRoutineComplete: (routineId: string) => void;
  isRoutineCompleted: (routineId: string) => boolean;
  getTodayCompletedCount: () => number;
  stats: { 
    daily: number, 
    weekly: number, 
    monthly: number, 
    breakdown: Record<string, number>,
    weeklyHistory: { date: string, percentage: number }[]
  };
  fetchStats: () => Promise<void>;
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
    reminders: "Reminders",
    tapToSetAlarm: "Tap any reminder to set alarm",
    reminderSubtitle: "Set daily reminders for your routine",
    enableNotifications: "Enable Notifications",
    notificationPermissionNeeded: "Permission needed to send reminders",
    earlyMorningReminder: "Early Morning Time",
    breakfastReminder: "Breakfast Time",
    midMorningSnackReminder: "Mid-Morning Snack Time",
    lunchReminder: "Lunch Time",
    eveningSnackReminder: "Evening Snack Time",
    dinnerReminder: "Dinner Time",
    beforeBedReminder: "Before Bed Time",
    exerciseReminder: "Exercise Time",
    waterReminder: "Water Reminder",
    sleepReminder: "Bedtime Reminder",
    fajrReminder: "Fajr Prayer",
    dhuhrReminder: "Dhuhr Prayer",
    asrReminder: "Asr Prayer",
    maghribReminder: "Maghrib Prayer",
    ishaReminder: "Isha Prayer",
    morningDuaReminder: "Morning Dua",
    eveningDuaReminder: "Evening Dua",
    sleepDuaReminder: "Dua Before Sleep",
    reminderEnabled: "Reminder enabled",
    reminderDisabled: "Reminder disabled",
    tapToEnable: "Tap to enable",
    goodMorning: "Good Morning, Juhi!",
    goodNoon: "Good Noon, Juhi!",
    goodAfternoon: "Good Afternoon, Juhi!",
    goodEvening: "Good Evening, Juhi!",
    goodNight: "Good Night, Juhi!",
    stayHealthy: "Stay healthy and beautiful today",
    dashboard: "Dashboard",
    duas: "Duas",
    duasSubtitle: "Daily prayers for health and peace",
    morningDua: "Morning Dua",
    eveningDua: "Evening Dua",
    healthDua: "Dua for Good Health",
    moodDua: "Dua for Peace of Mind",
    eatingDua: "Dua Before Eating",
    afterEatingDua: "Dua After Eating",
    sleepDua: "Dua Before Sleep",
    wakeUpDua: "Dua After Waking Up",
    completed: "Completed",
    remaining: "Remaining",
    todayProgress: "Today's Progress",
    keepGoing: "Keep going, you're doing great!",
    viewDuas: "View daily duas and prayers",
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
    reminders: "রিমাইন্ডার",
    tapToSetAlarm: "এলার্ম সেট করতে রিমাইন্ডারে ট্যাপ করুন",
    reminderSubtitle: "আপনার রুটিনের জন্য দৈনিক রিমাইন্ডার সেট করুন",
    enableNotifications: "নোটিফিকেশন চালু করুন",
    notificationPermissionNeeded: "রিমাইন্ডার পাঠাতে অনুমতি প্রয়োজন",
    earlyMorningReminder: "ভোরবেলার খাবারের সময়",
    breakfastReminder: "নাস্তার সময়",
    midMorningSnackReminder: "মধ্য-সকালের নাস্তার সময়",
    lunchReminder: "দুপুরের খাবারের সময়",
    eveningSnackReminder: "বিকেলের নাস্তার সময়",
    dinnerReminder: "রাতের খাবারের সময়",
    beforeBedReminder: "ঘুমানোর আগের খাবারের সময়",
    exerciseReminder: "ব্যায়ামের সময়",
    waterReminder: "পানি পানের রিমাইন্ডার",
    sleepReminder: "ঘুমানোর সময়",
    fajrReminder: "ফজরের নামাজ",
    dhuhrReminder: "যোহরের নামাজ",
    asrReminder: "আসরের নামাজ",
    maghribReminder: "মাগরিবের নামাজ",
    ishaReminder: "এশার নামাজ",
    morningDuaReminder: "সকালের দোয়া",
    eveningDuaReminder: "সন্ধ্যার দোয়া",
    sleepDuaReminder: "ঘুমানোর দোয়া",
    reminderEnabled: "রিমাইন্ডার চালু",
    reminderDisabled: "রিমাইন্ডার বন্ধ",
    tapToEnable: "চালু করতে ট্যাপ করুন",
    goodMorning: "সুপ্রভাত, জুহি!",
    goodNoon: "শুভ দুপুর, জুহি!",
    goodAfternoon: "শুভ বিকাল, জুহি!",
    goodEvening: "শুভ সন্ধ্যা, জুহি!",
    goodNight: "শুভ রাত্রি, জুহি!",
    stayHealthy: "আজ সুস্থ ও সুন্দর থাকুন",
    dashboard: "ড্যাশবোর্ড",
    duas: "দোয়া",
    duasSubtitle: "স্বাস্থ্য ও শান্তির জন্য দৈনিক দোয়া",
    morningDua: "সকালের দোয়া",
    eveningDua: "সন্ধ্যার দোয়া",
    healthDua: "সুস্বাস্থ্যের জন্য দোয়া",
    moodDua: "মনের শান্তির জন্য দোয়া",
    eatingDua: "খাওয়ার আগে দোয়া",
    afterEatingDua: "খাওয়ার পরে দোয়া",
    sleepDua: "ঘুমানোর আগে দোয়া",
    wakeUpDua: "ঘুম থেকে উঠার পর দোয়া",
    completed: "সম্পন্ন",
    remaining: "বাকি আছে",
    todayProgress: "আজকের অগ্রগতি",
    keepGoing: "চালিয়ে যান, আপনি দারুণ করছেন!",
    viewDuas: "দৈনিক দোয়া দেখুন",
  },
};

const defaultReminders: Reminder[] = [
  { id: "morning", time: "06:00", title: "morningReminder", enabled: false },
  { id: "fajr", time: "05:15", title: "fajrReminder", enabled: false },
  { id: "dhuhr", time: "12:30", title: "dhuhrReminder", enabled: false },
  { id: "asr", time: "16:00", title: "asrReminder", enabled: false },
  { id: "maghrib", time: "18:00", title: "maghribReminder", enabled: false },
  { id: "isha", time: "19:30", title: "ishaReminder", enabled: false },
  { id: "earlyMorning", time: "06:30", title: "earlyMorningReminder", enabled: false },
  { id: "breakfast", time: "08:30", title: "breakfastReminder", enabled: false },
  { id: "midMorningSnack", time: "11:00", title: "midMorningSnackReminder", enabled: false },
  { id: "lunch", time: "13:30", title: "lunchReminder", enabled: false },
  { id: "eveningSnack", time: "17:00", title: "eveningSnackReminder", enabled: false },
  { id: "dinner", time: "20:00", title: "dinnerReminder", enabled: false },
  { id: "beforeBed", time: "22:00", title: "beforeBedReminder", enabled: false },
  { id: "exercise", time: "17:30", title: "exerciseReminder", enabled: false },
  { id: "water", time: "10:00", title: "waterReminder", enabled: false },
  { id: "sleep", time: "22:30", title: "sleepReminder", enabled: false },
  { id: "morningDua", time: "06:30", title: "morningDuaReminder", enabled: false },
  { id: "eveningDua", time: "17:30", title: "eveningDuaReminder", enabled: false },
  { id: "sleepDua", time: "22:15", title: "sleepDuaReminder", enabled: false },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [reminders, setRemindersState] = useState<Reminder[]>(defaultReminders);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [completedRoutines, setCompletedRoutines] = useState<CompletedRoutines>({});
  const [stats, setStats] = useState({ 
    daily: 0, 
    weekly: 0, 
    monthly: 0, 
    breakdown: {} as Record<string, number>,
    weeklyHistory: [] as { date: string, percentage: number }[]
  });

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_DOMAIN}/api/dashboard/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    checkNotificationPermission();
    fetchStats();
    setupNotificationChannel();
  }, []);

  const setupNotificationChannel = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alarm', {
        name: 'Alarms',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    }
  };

  const getTodayKey = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const bdTime = new Date(utc + (3600000 * 6));
    return `${bdTime.getFullYear()}-${bdTime.getMonth() + 1}-${bdTime.getDate()}`;
  };

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      const savedTheme = await AsyncStorage.getItem("themeMode");
      const savedReminders = await AsyncStorage.getItem("reminders");
      const savedCompleted = await AsyncStorage.getItem("completedRoutines");
      if (savedLanguage) setLanguageState(savedLanguage as Language);
      if (savedTheme) setThemeModeState(savedTheme as ThemeMode);
      if (savedReminders) setRemindersState(JSON.parse(savedReminders));
      if (savedCompleted) setCompletedRoutines(JSON.parse(savedCompleted));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasNotificationPermission(status === "granted");
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (Platform.OS === "web") {
      setHasNotificationPermission(true);
      return true;
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    const granted = finalStatus === "granted";
    setHasNotificationPermission(granted);
    return granted;
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem("language", lang);
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem("themeMode", mode);
  };

  const setReminders = async (newReminders: Reminder[]) => {
    setRemindersState(newReminders);
    await AsyncStorage.setItem("reminders", JSON.stringify(newReminders));
  };

  const scheduleAlarm = async (reminder: Reminder) => {
    const [hours, minutes] = reminder.time.split(":").map(Number);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: translations[language][reminder.title] || reminder.title,
        body: translations[language].stayHealthy,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        categoryIdentifier: "alarm",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
      identifier: reminder.id,
    });
  };

  const toggleReminder = useCallback(async (id: string) => {
    setRemindersState(prev => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      );
      AsyncStorage.setItem("reminders", JSON.stringify(updated));
      
      const reminder = updated.find((r) => r.id === id);
      if (reminder?.enabled && hasNotificationPermission) {
        scheduleAlarm(reminder);
      } else {
        Notifications.cancelScheduledNotificationAsync(id);
      }
      return updated;
    });
  }, [hasNotificationPermission, language]);

  const updateReminderTime = useCallback(async (id: string, time: string) => {
    setRemindersState(prev => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, time, enabled: true } : r
      );
      AsyncStorage.setItem("reminders", JSON.stringify(updated));
      
      const reminder = updated.find((r) => r.id === id);
      if (reminder && hasNotificationPermission) {
        scheduleAlarm(reminder);
      }
      return updated;
    });
  }, [hasNotificationPermission, language]);

  const toggleRoutineComplete = useCallback(async (routineId: string) => {
    const todayKey = getTodayKey();
    const todayCompleted = completedRoutines[todayKey] || [];
    let updated: string[];
    if (todayCompleted.includes(routineId)) {
      updated = todayCompleted.filter(id => id !== routineId);
    } else {
      updated = [...todayCompleted, routineId];
    }
    const newState = { ...completedRoutines, [todayKey]: updated };
    setCompletedRoutines(newState);
    await AsyncStorage.setItem("completedRoutines", JSON.stringify(newState));
    try {
      await fetch(`${process.env.EXPO_PUBLIC_DOMAIN}/api/checkins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routineId }),
      });
      fetchStats();
    } catch (error) {
      console.error("Error recording check-in:", error);
    }
  }, [completedRoutines, fetchStats]);

  const isRoutineCompleted = useCallback((routineId: string) => {
    const todayKey = getTodayKey();
    return (completedRoutines[todayKey] || []).includes(routineId);
  }, [completedRoutines]);

  const getTodayCompletedCount = useCallback(() => {
    const todayKey = getTodayKey();
    return (completedRoutines[todayKey] || []).length;
  }, [completedRoutines]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        themeMode,
        setThemeMode,
        t,
        reminders,
        setReminders,
        toggleReminder,
        updateReminderTime,
        hasNotificationPermission,
        requestNotificationPermission,
        completedRoutines,
        toggleRoutineComplete,
        isRoutineCompleted,
        getTodayCompletedCount,
        stats,
        fetchStats,
      }}
    >
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
