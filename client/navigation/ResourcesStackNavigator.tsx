import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ResourcesScreen from "@/screens/ResourcesScreen";
import FoodChartScreen from "@/screens/FoodChartScreen";
import ExerciseScreen from "@/screens/ExerciseScreen";
import DuasScreen from "@/screens/DuasScreen";
import RemindersScreen from "@/screens/RemindersScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useApp } from "@/context/AppContext";

export type ResourcesStackParamList = {
  Resources: undefined;
  FoodChart: undefined;
  Exercise: undefined;
  Duas: undefined;
  Reminders: undefined;
};

const Stack = createNativeStackNavigator<ResourcesStackParamList>();

export default function ResourcesStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t, language } = useApp();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          headerTitle: t("resources"),
        }}
      />
      <Stack.Screen
        name="FoodChart"
        component={FoodChartScreen}
        options={{
          headerTitle: t("foodChart"),
        }}
      />
      <Stack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{
          headerTitle: t("dailyExercise"),
        }}
      />
      <Stack.Screen
        name="Duas"
        component={DuasScreen}
        options={{
          headerTitle: language === "bn" ? "দোয়া" : "Duas",
        }}
      />
      <Stack.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          headerTitle: t("reminders"),
        }}
      />
    </Stack.Navigator>
  );
}
