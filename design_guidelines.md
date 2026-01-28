# Design Guidelines: Routine For Juhi - PCOS Wellness App

## Brand Identity

**Purpose**: A personal wellness companion for managing PCOS through diet and lifestyle, designed specifically for Juhi. The app provides structured daily routines, meal plans, and gentle encouragement.

**Tone**: Soft, nurturing, and supportive - like a caring friend. Use warm colors, gentle curves, and approachable typography. The aesthetic should feel calming and personal, not clinical or intimidating.

**Memorable Element**: The personal message feature and the dedicated, named experience ("For Juhi") makes this feel like a thoughtful gift rather than a generic health app.

## Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
- **Home** (Daily Routine) - Default tab showing today's schedule
- **Resources** - Food chart and exercise guide
- **Profile** - Settings and personal information

All screens use a custom header with Settings icon (gear) in top-right corner.

## Screen-by-Screen Specifications

### 1. Home Screen (Daily Routine)
**Purpose**: View and follow today's meal and lifestyle plan

**Layout**:
- Header: Custom, transparent background
  - Title: "Today's Routine" (left-aligned)
  - Settings icon (top-right)
- Content: Scrollable list grouped by time of day
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl

**Components**:
- Time-based cards for each meal/activity (Early Morning, Breakfast, Mid-Morning, Lunch, Evening, Dinner, Before Bed)
- Each card shows: Time label, meal options (expandable), checkmark to mark as complete
- Floating action button: "View Exercise Tips" (bottom-right, above tab bar)
- Empty state: Show encouraging message if no routine loaded

### 2. Resources Screen
**Purpose**: Access food chart and exercise guides

**Layout**:
- Header: Custom, transparent
  - Title: "Resources"
  - Settings icon (top-right)
- Content: Two large cards
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl

**Components**:
- "Food Chart" card - tappable, navigates to Food Chart detail screen
- "Daily Exercise" card - tappable, navigates to Exercise detail screen
- Each card has icon, title, and brief description

### 3. Profile Screen
**Purpose**: Display profile information and app settings

**Layout**:
- Header: Custom, transparent
  - Title: "Profile"
  - Settings icon (top-right)
- Content: Scrollable
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl

**Components**:
- Profile avatar (centered, large circular image)
- Name: "Israt Jahan Juhi" (centered, below avatar)
- Settings list:
  - Dark Mode toggle (switch component)
  - Language selector (Bangla/English, radio options)
  - "Message for You" row (tappable, opens modal)

### 4. Settings Modal (accessed from top-right icon)
**Purpose**: Quick access to all settings options

**Layout**: Native modal (slides up from bottom)
- Header: "Settings" with close button
- Content: Same settings list as Profile screen

### 5. Message Modal
**Purpose**: Display personal encouragement message

**Layout**: Alert-style modal (centered)
- Displays: "Love you, dear. This App is only for you. Take care of yourself"
- Single "Close" button

### 6. Food Chart Screen
**Purpose**: Show detailed food recommendations and plate method

**Layout**:
- Header: Back button, title "Food Chart"
- Content: Scrollable with sections for each meal type and the plate method illustration

### 7. Exercise Screen
**Purpose**: Display daily exercise routine with examples

**Layout**:
- Header: Back button, title "Daily Exercise"
- Content: Scrollable list of exercises (walking, yoga, cardio) with duration and benefits

## Color Palette

**Primary**: #E8A5A5 (Soft rose - gentle, nurturing, feminine)
**Primary Dark**: #D48989
**Secondary**: #A8D5A8 (Soft sage - healing, natural, calming)
**Background (Light)**: #FFF9F5 (Warm off-white)
**Background (Dark)**: #1C1816 (Warm charcoal)
**Surface (Light)**: #FFFFFF
**Surface (Dark)**: #2D2926
**Text Primary (Light)**: #2D2520
**Text Primary (Dark)**: #F5F1ED
**Text Secondary**: #7A736D
**Success**: #81C784 (for checkmarks)
**Border**: #E8E3DF

## Typography

**Primary Font**: Nunito (Google Font - friendly, approachable, readable)
- Display: Nunito Bold, 28sp
- Title: Nunito SemiBold, 20sp
- Body: Nunito Regular, 16sp
- Caption: Nunito Regular, 14sp

**Secondary Font**: System default for Bangla language support

## Visual Design

- Card components: 16dp rounded corners, subtle elevation (4dp)
- Touchable feedback: Slight opacity change (0.7) on press
- Floating action button shadow:
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2
- Icons: Material Icons or Feather icons from @expo/vector-icons
- Spacing scale: xs(4), sm(8), md(12), lg(16), xl(24), xxl(32)

## Assets to Generate

**Required:**
1. **icon.png** - App icon featuring a soft lotus or leaf symbol in rose/sage gradient (device home screen)
2. **splash-icon.png** - Same logo for launch screen
3. **profile-avatar.png** - Gentle illustration of a woman with long dark hair in warm tones (Profile screen)
4. **empty-routine.png** - Soft illustration of a calendar or clock with plants (Home screen empty state)
5. **food-plate-illustration.png** - Diagram showing the plate method (half vegetables, quarter protein, quarter grains) (Food Chart screen)
6. **exercise-illustration.png** - Simple illustration of a woman walking or doing yoga (Exercise screen header)

**Style**: All illustrations should be minimal, warm, hand-drawn feeling with soft colors matching the palette. Avoid harsh lines or clinical medical imagery.