import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../../theme/colors';

export function GuideScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Foydalanish qo'llanmasi</Text>
        <Text style={styles.muted}>
          Bu bo'lim web kabinetdagi yo'riqnomaning qisqa mobil ko'rinishi.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>1) Fanlar</Text>
        <Text style={styles.muted}>- "Mening fanlarim" sahifasiga kiring</Text>
        <Text style={styles.muted}>- Yangi fan qo'shing</Text>
        <Text style={styles.muted}>- O'qituvchilarni fanga biriktiring</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>2) Guruhlar</Text>
        <Text style={styles.muted}>- "Guruhlar" sahifasiga kiring</Text>
        <Text style={styles.muted}>- Yangi guruh yarating</Text>
        <Text style={styles.muted}>- Fan, o'qituvchi, jadval va o'quvchilarni tanlang</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>3) To'lovlar</Text>
        <Text style={styles.muted}>- "To'lovlar" sahifasida oylik jadvalni ko'ring</Text>
        <Text style={styles.muted}>- Yangi to'lov yarating yoki to'lov kiriting</Text>
        <Text style={styles.muted}>- Qarzdorlarga eslatma yuboring</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 6,
  },
  section: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 6,
  },
  muted: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
});
