import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, PhoneCall, Pill, ShieldAlert } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors, Palette, Radius, Spacing } from '../../constants/theme';

export default function DrugInteractionWarning() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Drug Interaction Screening
          </Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Clinical pharmacology & contraindication checks
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Warning Alert Card */}
        <View
          style={[
            styles.alertCard,
            {
              backgroundColor: isDark ? 'rgba(224, 159, 62, 0.12)' : Palette.warningSubtle,
              borderColor: Palette.warning,
            },
          ]}
        >
          <View style={styles.alertHeader}>
            <ShieldAlert size={24} color={Palette.warning} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: isDark ? '#FCD34D' : '#854D0E' }]}>
                Moderate Interaction Detected
              </Text>
              <Text
                style={[styles.alertText, { color: isDark ? Palette.textDarkPrimary : '#713F12' }]}
              >
                Combining <Text style={{ fontWeight: '700' }}>Aspirin</Text> with{' '}
                <Text style={{ fontWeight: '700' }}>Warfarin</Text> significantly elevates systemic
                bleeding risks due to synergistic anti-platelet and anticoagulant actions.
              </Text>
            </View>
          </View>
        </View>

        {/* Clinical Guidance Card */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Clinical Guidance & Recommendations
          </Text>

          <View style={styles.guidanceItem}>
            <View
              style={[
                styles.guidanceIconBox,
                { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
              ]}
            >
              <Pill size={18} color={isDark ? Palette.sageLuminous : Palette.sagePrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.guidanceHeading, { color: theme.text }]}>
                Action Required Prior to Dispensing
              </Text>
              <Text style={[styles.guidanceDesc, { color: theme.textSecondary }]}>
                Consult the prescribing physician to determine whether INR monitoring should be
                intensified or if an alternative non-interacting analgesia (e.g., Acetaminophen) is
                appropriate.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.guidanceItem,
              {
                borderTopWidth: 1,
                borderTopColor: theme.border,
                paddingTop: Spacing.four,
                marginTop: Spacing.four,
              },
            ]}
          >
            <View
              style={[
                styles.guidanceIconBox,
                { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.2)' : Palette.sageSubtle },
              ]}
            >
              <CheckCircle2 size={18} color={Palette.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.guidanceHeading, { color: theme.text }]}>
                Patient Counseling Advisory
              </Text>
              <Text style={[styles.guidanceDesc, { color: theme.textSecondary }]}>
                Advise the patient to monitor for unusual bruising, bleeding gums, or dark stools,
                and to report any adverse events immediately.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: Palette.sagePrimary }]}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Acknowledge & Record In Chart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => alert('Opening clinician direct consult directory...')}
            activeOpacity={0.8}
          >
            <PhoneCall size={18} color={theme.text} style={{ marginRight: 8 }} />
            <Text style={[styles.secondaryBtnText, { color: theme.text }]}>Consult Prescriber</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: 56,
    paddingBottom: Spacing.four,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 2 },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  alertCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderLeftWidth: 4,
    marginBottom: Spacing.four,
  },
  alertHeader: { flexDirection: 'row', gap: Spacing.three },
  alertTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  alertText: { fontSize: 14, lineHeight: 20 },
  card: {
    padding: Spacing.five,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.five,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.four },
  guidanceItem: { flexDirection: 'row', gap: Spacing.three },
  guidanceIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidanceHeading: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  guidanceDesc: { fontSize: 13, lineHeight: 19 },
  actions: { gap: Spacing.three },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontWeight: '600', fontSize: 14 },
});
