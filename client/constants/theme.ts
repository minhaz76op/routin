import { Platform } from "react-native";

const primaryLight = "#E8A5A5";
const primaryDark = "#D48989";
const secondary = "#A8D5A8";

export const Colors = {
  light: {
    text: "#2D2520",
    textSecondary: "#7A736D",
    buttonText: "#FFFFFF",
    tabIconDefault: "#7A736D",
    tabIconSelected: primaryLight,
    link: primaryLight,
    primary: primaryLight,
    primaryDark: primaryDark,
    secondary: secondary,
    success: "#81C784",
    border: "#E8E3DF",
    backgroundRoot: "#FFF9F5",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#FFF5F0",
    backgroundTertiary: "#FFEDE5",
  },
  dark: {
    text: "#F5F1ED",
    textSecondary: "#A09A94",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryDark,
    link: primaryDark,
    primary: primaryDark,
    primaryDark: primaryLight,
    secondary: "#7CB87C",
    success: "#81C784",
    border: "#3D3835",
    backgroundRoot: "#1C1816",
    backgroundDefault: "#2D2926",
    backgroundSecondary: "#3D3835",
    backgroundTertiary: "#4D4845",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
