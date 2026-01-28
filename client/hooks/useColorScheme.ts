import { useApp } from "@/context/AppContext";

export function useColorScheme(): "light" | "dark" {
  const { themeMode } = useApp();
  return themeMode;
}
