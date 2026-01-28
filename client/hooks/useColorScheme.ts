import { useColorScheme as useRNColorScheme } from "react-native";
import { useApp } from "@/context/AppContext";

export function useColorScheme(): "light" | "dark" {
  const systemScheme = useRNColorScheme();
  
  try {
    const { themeMode } = useApp();
    
    if (themeMode === "system") {
      return systemScheme ?? "light";
    }
    return themeMode;
  } catch {
    return systemScheme ?? "light";
  }
}
