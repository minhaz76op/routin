import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInRight, FadeInLeft } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

export default function PrescriptionScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <Animated.View entering={FadeInUp.springify()} style={[styles.container, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        {/* Prescription Header */}
        <View style={styles.header}>
          <View style={styles.patientInfo}>
            <Animated.View entering={FadeInLeft.delay(200)}>
              <ThemedText style={styles.infoLabel}>Patient: <ThemedText style={styles.infoValue}>Miss Jui</ThemedText></ThemedText>
              <ThemedText style={styles.infoLabel}>Age: <ThemedText style={styles.infoValue}>20 years</ThemedText></ThemedText>
              <ThemedText style={styles.infoLabel}>Date: <ThemedText style={styles.infoValue}>23 January 2025</ThemedText></ThemedText>
            </Animated.View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.complaintsContainer}>
             <ThemedText style={styles.sectionTitle}>C/O (Complaints)</ThemedText>
             <View style={styles.list}>
                {["PCOD", "Hirsutism", "Irregular menstruation", "Acne", "Amenorrhoea – 2 months"].map((item, i) => (
                  <View key={i} style={styles.listItem}>
                    <View style={[styles.bullet, { backgroundColor: Colors.light.secondary }]} />
                    <ThemedText style={styles.listText}>{item}</ThemedText>
                  </View>
                ))}
             </View>
          </View>

          <View style={styles.section}>
             <ThemedText style={styles.sectionTitle}>O/E</ThemedText>
             <ThemedText style={styles.infoLabel}>Weight: <ThemedText style={styles.infoValue}>47.5 kg</ThemedText></ThemedText>
             <ThemedText style={styles.infoLabel}>BP: <ThemedText style={styles.infoValue}>130/90 mmHg</ThemedText></ThemedText>
             <ThemedText style={styles.infoLabel}>P/A: <ThemedText style={styles.infoValue}>NAD</ThemedText></ThemedText>
          </View>

          <View style={styles.section}>
             <ThemedText style={styles.sectionTitle}>Advice / Investigations</ThemedText>
             <View style={styles.list}>
                {["FBS", "S. TSH", "USG of lower abdomen", "(On 2nd day of menstruation)"].map((item, i) => (
                  <View key={i} style={styles.listItem}>
                    <View style={[styles.bullet, { backgroundColor: Colors.light.primary }]} />
                    <ThemedText style={styles.listText}>{item}</ThemedText>
                  </View>
                ))}
             </View>
          </View>
        </View>

        {/* Medicines Side */}
        <View style={[styles.medicinesSide, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }]}>
          <Animated.View entering={FadeInRight.delay(400)}>
            <ThemedText style={styles.rxHeader}>Rx (Medicines)</ThemedText>
            
            <MedicineItem 
              num="1" 
              name="Tab Gynova 35 / Cleo 35" 
              dose="০–০–১ (রাতে ১টা)" 
              duration="২১ দিন (এক প্যাক শেষ করতে হবে)" 
            />
            <MedicineItem 
              num="2" 
              name="Tab Megest Plus" 
              dose="০–১–০ (দুপুরে ১টা)" 
              duration="১০ দিন" 
            />
            <MedicineItem 
              num="3" 
              name="Tab Comet (Metformin)" 
              dose="০–০–১ (রাতে ১টা)" 
              duration="২ মাস" 
            />
            <MedicineItem 
              num="4" 
              name="Tab Femvit" 
              dose="০–০–১ (রাতে ১টা)" 
              duration="২ মাস" 
            />
          </Animated.View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function MedicineItem({ num, name, dose, duration }: { num: string; name: string; dose: string; duration: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.medItem}>
      <View style={styles.medHeader}>
        <View style={styles.medNumber}>
          <ThemedText style={styles.medNumberText}>{num}</ThemedText>
        </View>
        <ThemedText style={styles.medName}>{name}</ThemedText>
      </View>
      <View style={styles.medDetails}>
        <View style={styles.medRow}>
          <Feather name="clock" size={14} color={Colors.light.primary} />
          <ThemedText style={[styles.medDose, { color: theme.textSecondary }]}>{dose}</ThemedText>
        </View>
        <View style={styles.medRow}>
          <Feather name="calendar" size={14} color={Colors.light.secondary} />
          <ThemedText style={[styles.medDuration, { color: theme.textSecondary }]}>{duration}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    minHeight: 600,
  },
  header: {
    flex: 1,
    padding: Spacing.lg,
  },
  patientInfo: {
    marginBottom: Spacing.lg,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#888",
    marginBottom: 2,
  },
  infoValue: {
    color: "#000",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    marginBottom: Spacing.xs,
    color: Colors.light.primary,
  },
  complaintsContainer: {
    marginBottom: Spacing.lg,
  },
  list: {
    paddingLeft: Spacing.xs,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  listText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
  },
  medicinesSide: {
    flex: 1.5,
    padding: Spacing.lg,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.05)",
  },
  rxHeader: {
    fontSize: 24,
    fontFamily: "Nunito_800ExtraBold",
    color: Colors.light.primary,
    marginBottom: Spacing.xl,
  },
  medItem: {
    marginBottom: Spacing.xl,
  },
  medHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  medNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  medNumberText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
  },
  medName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    flex: 1,
  },
  medDetails: {
    paddingLeft: 32,
  },
  medRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  medDose: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: "Nunito_600SemiBold",
  },
  medDuration: {
    fontSize: 13,
    marginLeft: 8,
    fontFamily: "Nunito_400Regular",
  },
});
