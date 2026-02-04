# Routine For Juhi

## Overview

A personal wellness companion mobile app designed specifically for Juhi, a 21-22 year old female with PCOS (Polycystic Ovary Syndrome). The app provides structured daily routines, meal plans, exercise guides, and gentle encouragement to help manage PCOS through diet and lifestyle changes. Built with React Native and Expo for cross-platform mobile development (iOS, Android, and web), with an Express.js backend server.

The app features a warm, nurturing aesthetic with soft colors, gentle curves, and approachable typography - designed to feel like a caring friend rather than a clinical health app.

## Recent Changes

- [2026-02-04] Migrated DuasScreen design to match user-provided card layout with image placeholder, badge, and "View Details" button.
- [2026-02-04] Reinstalled OpenAI integration to fix missing environment variables.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation with a tab-based layout (3 tabs: Home, Resources, Profile)
- **State Management**: React Context API for app-wide state (theme, language, reminders, completed routines)
- **Data Fetching**: TanStack React Query for server state management
- **Styling**: React Native StyleSheet with a custom theme system supporting light/dark modes
- **Animations**: React Native Reanimated for smooth, performant animations
- **Storage**: AsyncStorage for local persistence of user preferences and progress

### Backend Architecture
- **Framework**: Express.js v5
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration
- **Storage Pattern**: Repository pattern with IStorage interface (currently using in-memory storage, designed for easy PostgreSQL migration)

### Key Design Decisions

1. **Monorepo Structure**: Client code in `/client`, server code in `/server`, shared types/schemas in `/shared`
2. **Path Aliases**: `@/` maps to `/client`, `@shared/` maps to `/shared` for clean imports
3. **Bilingual Support**: English and Bengali translations built into the app context
4. **Custom Theme System**: Warm, PCOS-wellness focused color palette (soft pinks, sage greens) with full dark mode support
5. **Offline-First Design**: Local storage for routine completion tracking, reminders, and preferences

### App Screens
- **Home**: Daily routine view with time-based meal cards and completion tracking
- **Resources**: Access to food charts, exercise guides, and duas (prayers)
- **Profile**: Settings for language, theme, and notification reminders

## External Dependencies

### Mobile/Expo Packages
- `expo-notifications`: Push notification support for meal reminders
- `expo-haptics`: Tactile feedback on interactions
- `expo-blur` / `expo-glass-effect`: Visual effects for navigation elements
- `expo-linear-gradient`: Gradient backgrounds for cards
- `expo-image`: Optimized image loading
- `@expo-google-fonts/nunito`: Custom font family

### Database
- **PostgreSQL**: Primary database (Drizzle ORM configured)
- **Drizzle Kit**: Database migrations and schema management
- Schema location: `/shared/schema.ts`
- Migrations output: `/migrations`

### Development
- **tsx**: TypeScript execution for server development
- **esbuild**: Server bundling for production
- Expo development proxy configured for Replit environment

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `REPLIT_DEV_DOMAIN`: Development domain for Expo proxy
- `EXPO_PUBLIC_DOMAIN`: Public API endpoint for mobile client