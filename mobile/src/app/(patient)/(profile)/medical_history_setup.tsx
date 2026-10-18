import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Palette, Radius, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/useAuth';

export default function MedicalHistorySetup() {
  const { authenticatedFetch } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const stepTitles: Record<number, string> = {
    1: 'Chronic Conditions',
    2: 'Past Surgeries',
    3: 'Known Allergies',
  };

  const [conditions, setConditions] = useState<string[]>([]);
  const [surgeries, setSurgeries] = useState([{ name: '', year: '' }]);
  const [allergies, setAllergies] = useState([{ name: 'Penicillin', severity: 'Mild' }]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/medical-history');
        if (res.ok) {
          const data = await res.json();
          if (data.chronic_conditions) setConditions(data.chronic_conditions);
          if (data.past_surgeries && data.past_surgeries.length > 0)
            setSurgeries(data.past_surgeries);
          if (data.allergies && data.allergies.length > 0) setAllergies(data.allergies);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [authenticatedFetch]);

  const conditionOptions = [
    { name: 'Hypertension', desc: 'High blood pressure management' },
    { name: 'Diabetes', desc: 'Type 1 or Type 2 blood sugar regulation' },
    { name: 'Asthma / COPD', desc: 'Chronic respiratory & bronchial condition' },
    { name: 'Thyroid Disorder', desc: 'Hypo or hyperthyroidism medication' },
    { name: 'Arthritis', desc: 'Joint inflammation & musculoskeletal pain' },
  ];

  const toggleCondition = (name: string) => {
    if (conditions.includes(name)) {
      setConditions(conditions.filter((c) => c !== name));
    } else {
      setConditions([...conditions, name]);
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        const res = await authenticatedFetch('/api/patients/medical-history', {
          method: 'PUT',
          body: JSON.stringify({
            chronic_conditions: conditions,
            past_surgeries: surgeries.filter((s) => s.name.trim() !== ''),
            allergies: allergies.filter((a) => a.name.trim() !== ''),
          }),
        });
        if (res.ok) {
          Alert.alert('Complete', 'Medical history updated in clinical chart.');
          router.replace('/(patient)/dashboard' as any);
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Notice', 'Error saving medical history');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const addSurgery = () => setSurgeries([...surgeries, { name: '', year: '' }]);
  const removeSurgery = (index: number) => setSurgeries(surgeries.filter((_, i) => i !== index));

  const addAllergy = () => setAllergies([...allergies, { name: '', severity: 'Mild' }]);
  const updateAllergySeverity = (idx: number, sev: string) => {
    const newA = [...allergies];
    newA[idx].severity = sev;
    setAllergies(newA);
  };

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={handlePrev} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Medical History Setup</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.stepText, { color: accentColor }]}>
                STEP {currentStep} OF {totalSteps}
              </Text>
              <Text style={[styles.stepTitle, { color: theme.text }]}>
                {stepTitles[currentStep]}
              </Text>
            </View>
            <View
              style={[
                styles.progressBarBg,
                { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: accentColor },
                ]}
              />
            </View>
          </View>

          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            {/* Step 1: Conditions */}
            {currentStep === 1 && (
              <View>
                <Text style={[styles.desc, { color: theme.textSecondary }]}>
                  Select any diagnosed chronic conditions you are currently managing.
                </Text>
                <View style={styles.grid}>
                  {conditionOptions.map((cond, idx) => {
                    const isSelected = conditions.includes(cond.name);
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.conditionCard,
                          {
                            borderColor: theme.border,
                            backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                          },
                          isSelected && {
                            borderColor: accentColor,
                            backgroundColor: isDark ? 'rgba(45, 106, 79, 0.2)' : Palette.sageSubtle,
                          },
                        ]}
                        onPress={() => toggleCondition(cond.name)}
                        activeOpacity={0.8}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.conditionTitle, { color: theme.text }]}>
                            {cond.name}
                          </Text>
                          <Text style={[styles.conditionDesc, { color: theme.textSecondary }]}>
                            {cond.desc}
                          </Text>
                        </View>
                        {isSelected && <CheckCircle size={20} color={accentColor} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Step 2: Surgeries */}
            {currentStep === 2 && (
              <View>
                <Text style={[styles.desc, { color: theme.textSecondary }]}>
                  List significant past surgical procedures, implants, or hospitalizations.
                </Text>
                {surgeries.map((surg, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.surgeryCard,
                      {
                        backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: theme.textSecondary }]}>
                        Procedure Name
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: theme.surface,
                            color: theme.text,
                            borderColor: theme.border,
                          },
                        ]}
                        placeholder="e.g. Appendectomy, Knee Arthroscopy"
                        placeholderTextColor={theme.textTertiary}
                        value={surg.name}
                        onChangeText={(t) => {
                          const s = [...surgeries];
                          s[idx].name = t;
                          setSurgeries(s);
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Year</Text>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.surface,
                              color: theme.text,
                              borderColor: theme.border,
                            },
                          ]}
                          placeholder="YYYY"
                          placeholderTextColor={theme.textTertiary}
                          keyboardType="number-pad"
                          value={surg.year}
                          onChangeText={(t) => {
                            const s = [...surgeries];
                            s[idx].year = t;
                            setSurgeries(s);
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => removeSurgery(idx)}
                        activeOpacity={0.8}
                      >
                        <Trash2 size={18} color={Palette.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.textLink} onPress={addSurgery} activeOpacity={0.8}>
                  <Plus size={18} color={accentColor} />
                  <Text style={[styles.textLinkText, { color: accentColor }]}>
                    Add another surgery
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Allergies */}
            {currentStep === 3 && (
              <View>
                <Text style={[styles.desc, { color: theme.textSecondary }]}>
                  Identify any known drug or substance allergies and their clinical severity.
                </Text>
                {allergies.map((allergy, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.allergyCard,
                      {
                        backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: theme.textSecondary }]}>
                        Allergen / Substance
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: theme.surface,
                            color: theme.text,
                            borderColor: theme.border,
                          },
                        ]}
                        value={allergy.name}
                        placeholder="e.g. Penicillin, NSAIDs, Sulfa"
                        placeholderTextColor={theme.textTertiary}
                        onChangeText={(t) => {
                          const a = [...allergies];
                          a[idx].name = t;
                          setAllergies(a);
                        }}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: theme.textSecondary }]}>
                        Severity Level
                      </Text>
                      <View style={styles.severityRow}>
                        {['Mild', 'Moderate', 'Severe'].map((sev) => {
                          const isSelected = allergy.severity === sev;
                          return (
                            <TouchableOpacity
                              key={sev}
                              style={[
                                styles.severityBtn,
                                { borderColor: theme.border, backgroundColor: theme.surface },
                                isSelected && {
                                  borderColor: sev === 'Severe' ? Palette.danger : accentColor,
                                  backgroundColor:
                                    sev === 'Severe'
                                      ? isDark
                                        ? 'rgba(193, 41, 46, 0.15)'
                                        : Palette.dangerSubtle
                                      : isDark
                                        ? 'rgba(45, 106, 79, 0.2)'
                                        : Palette.sageSubtle,
                                },
                              ]}
                              onPress={() => updateAllergySeverity(idx, sev)}
                              activeOpacity={0.8}
                            >
                              <Text
                                style={[
                                  styles.severityText,
                                  { color: theme.textSecondary },
                                  isSelected && {
                                    color: sev === 'Severe' ? Palette.danger : accentColor,
                                    fontWeight: '700',
                                  },
                                ]}
                              >
                                {sev}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.outlineBtn, { borderColor: theme.border }]}
                  onPress={addAllergy}
                  activeOpacity={0.8}
                >
                  <Plus size={18} color={theme.textSecondary} />
                  <Text style={[styles.outlineBtnText, { color: theme.textSecondary }]}>
                    Add Another Known Allergy
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer Navigation */}
      <View
        style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}
      >
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.replace('/(patient)/dashboard' as any)}
        >
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip for Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: Palette.sagePrimary }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>
            {currentStep === totalSteps ? 'Complete History' : 'Continue'}
          </Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  progressContainer: { marginBottom: Spacing.four },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  stepTitle: { fontSize: 18, fontWeight: '700' },
  progressBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  card: { padding: Spacing.four, borderRadius: Radius.lg, borderWidth: 1 },
  desc: { fontSize: 14, marginBottom: Spacing.four, lineHeight: 20 },
  grid: { gap: Spacing.two },
  conditionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  conditionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  conditionDesc: { fontSize: 12 },
  surgeryCard: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  inputGroup: { marginBottom: Spacing.two },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  input: {
    height: 46,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 1,
  },
  deleteBtn: {
    height: 46,
    width: 46,
    backgroundColor: 'rgba(193, 41, 46, 0.1)',
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  textLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  textLinkText: { fontWeight: '700', fontSize: 14 },
  allergyCard: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  severityRow: { flexDirection: 'row', gap: 8 },
  severityBtn: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  severityText: { fontSize: 13, fontWeight: '600' },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    marginTop: 8,
  },
  outlineBtnText: { fontWeight: '600', fontSize: 13 },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtn: { paddingVertical: 12, paddingHorizontal: Spacing.three },
  skipText: { fontWeight: '600', fontSize: 14 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: Radius.md,
    gap: 6,
  },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
