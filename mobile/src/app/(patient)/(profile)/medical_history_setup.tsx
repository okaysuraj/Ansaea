import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../../context/AuthContext';

export default function MedicalHistorySetup() {
  const { authenticatedFetch } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const stepTitles: Record<number, string> = {
    1: "Chronic Conditions",
    2: "Past Surgeries",
    3: "Known Allergies"
  };

  const [conditions, setConditions] = useState<string[]>([]);
  const [surgeries, setSurgeries] = useState([{ name: '', year: '' }]);
  const [allergies, setAllergies] = useState([{ name: 'Penicillin', severity: 'Mild' }]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/medical-history');
        if (res.ok) {
          const data = await res.json();
          if (data.chronic_conditions) setConditions(data.chronic_conditions);
          if (data.past_surgeries && data.past_surgeries.length > 0) setSurgeries(data.past_surgeries);
          if (data.allergies && data.allergies.length > 0) setAllergies(data.allergies);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [authenticatedFetch]);

  const conditionOptions = [
    { name: 'Hypertension', desc: 'High blood pressure' },
    { name: 'Diabetes', desc: 'Type 1 or Type 2' },
    { name: 'Asthma', desc: 'Respiratory condition' },
    { name: 'Thyroid Disorder', desc: 'Hypo/Hyperthyroidism' },
    { name: 'Arthritis', desc: 'Joint inflammation' },
  ];

  const toggleCondition = (name: string) => {
    if (conditions.includes(name)) {
      setConditions(conditions.filter(c => c !== name));
    } else {
      setConditions([...conditions, name]);
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        const res = await authenticatedFetch('/api/patients/medical-history', {
          method: 'PUT',
          body: JSON.stringify({
            chronic_conditions: conditions,
            past_surgeries: surgeries.filter(s => s.name.trim() !== ''),
            allergies: allergies.filter(a => a.name.trim() !== '')
          })
        });
        if (res.ok) {
          alert("Medical History Profile Complete!");
          router.replace('/(patient)/dashboard');
        }
      } catch (err) {
        console.error(err);
        alert("Error saving medical history");
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrev} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Medical History</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.stepText}>STEP {currentStep} OF {totalSteps}</Text>
              <Text style={styles.stepTitle}>{stepTitles[currentStep]}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
            </View>
          </View>

          <View style={styles.card}>
            {/* Step 1: Conditions */}
            {currentStep === 1 && (
              <View>
                <Text style={styles.desc}>Select any long-term health conditions you are currently managing.</Text>
                <View style={styles.grid}>
                  {conditionOptions.map((cond, idx) => {
                    const isSelected = conditions.includes(cond.name);
                    return (
                      <TouchableOpacity 
                        key={idx} 
                        style={[styles.conditionCard, isSelected && styles.conditionCardSelected]}
                        onPress={() => toggleCondition(cond.name)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.conditionTitle}>{cond.name}</Text>
                          <Text style={styles.conditionDesc}>{cond.desc}</Text>
                        </View>
                        {isSelected && <CheckCircle size={20} color="#0ea5e9" />}
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity style={styles.addBtn}>
                    <Plus size={20} color="#0ea5e9" style={{ marginBottom: 4 }} />
                    <Text style={styles.addBtnText}>Other Condition</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 2: Surgeries */}
            {currentStep === 2 && (
              <View>
                <Text style={styles.desc}>List major surgical procedures in the past decade.</Text>
                {surgeries.map((surg, idx) => (
                  <View key={idx} style={styles.surgeryCard}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Procedure Name</Text>
                      <TextInput 
                        style={styles.input} 
                        placeholder="e.g. Appendectomy" 
                        placeholderTextColor="#64748b"
                        value={surg.name} 
                        onChangeText={(t) => { const s = [...surgeries]; s[idx].name = t; setSurgeries(s); }}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Year</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="YYYY" 
                          placeholderTextColor="#64748b"
                          keyboardType="number-pad"
                          value={surg.year} 
                          onChangeText={(t) => { const s = [...surgeries]; s[idx].year = t; setSurgeries(s); }}
                        />
                      </View>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => removeSurgery(idx)}>
                        <Trash2 size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.textLink} onPress={addSurgery}>
                  <Plus size={20} color="#0ea5e9" />
                  <Text style={styles.textLinkText}>Add another surgery</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Allergies */}
            {currentStep === 3 && (
              <View>
                <Text style={styles.desc}>Identify any known allergies and their severity.</Text>
                {allergies.map((allergy, idx) => (
                  <View key={idx} style={styles.allergyCard}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Allergen / Substance</Text>
                      <TextInput 
                        style={styles.input} 
                        value={allergy.name} 
                        placeholderTextColor="#64748b"
                        onChangeText={(t) => { const a = [...allergies]; a[idx].name = t; setAllergies(a); }}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Severity Level</Text>
                      <View style={styles.severityRow}>
                        {['Mild', 'Moderate', 'Severe'].map(sev => {
                          const isSelected = allergy.severity === sev;
                          return (
                            <TouchableOpacity 
                              key={sev}
                              style={[styles.severityBtn, isSelected && styles.severityBtnSelected]}
                              onPress={() => updateAllergySeverity(idx, sev)}
                            >
                              <Text style={[styles.severityText, isSelected && styles.severityTextSelected]}>{sev}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.outlineBtn} onPress={addAllergy}>
                  <Plus size={20} color="#94A3B8" />
                  <Text style={styles.outlineBtnText}>Add New Allergy</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>{currentStep === totalSteps ? 'Complete Setup' : 'Next Step'}</Text>
          {currentStep < totalSteps && <ArrowRight size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 40 },
  progressContainer: { marginBottom: 24 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stepText: { fontSize: 12, fontWeight: 'bold', color: '#0ea5e9' },
  stepTitle: { fontSize: 20, fontWeight: 'bold', color: '#F8FAFC' },
  progressBarBg: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0ea5e9' },
  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  desc: { fontSize: 14, color: '#94A3B8', marginBottom: 20, lineHeight: 20 },
  grid: { gap: 12 },
  conditionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 2, borderColor: '#334155', borderRadius: 12, backgroundColor: 'transparent' },
  conditionCardSelected: { borderColor: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)' },
  conditionTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  conditionDesc: { fontSize: 12, color: '#94A3B8' },
  addBtn: { alignItems: 'center', justifyContent: 'center', padding: 16, borderWidth: 2, borderColor: '#334155', borderRadius: 12, borderStyle: 'dashed' },
  addBtnText: { color: '#0ea5e9', fontWeight: 'bold' },
  surgeryCard: { padding: 16, backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 },
  input: { height: 48, backgroundColor: '#1E293B', borderRadius: 8, paddingHorizontal: 12, color: '#F8FAFC' },
  deleteBtn: { height: 48, width: 48, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
  textLink: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textLinkText: { color: '#0ea5e9', fontWeight: 'bold' },
  allergyCard: { padding: 16, backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  severityRow: { flexDirection: 'row', gap: 8 },
  severityBtn: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  severityBtnSelected: { borderColor: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)' },
  severityText: { fontSize: 13, fontWeight: 'bold', color: '#94A3B8' },
  severityTextSelected: { color: '#0ea5e9' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderWidth: 2, borderColor: '#334155', borderRadius: 12, borderStyle: 'dashed' },
  outlineBtnText: { color: '#94A3B8', fontWeight: 'bold' },
  footer: { padding: 16, backgroundColor: '#1E293B', borderTopWidth: 1, borderTopColor: '#334155', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skipBtn: { paddingVertical: 12, paddingHorizontal: 20 },
  skipText: { color: '#94A3B8', fontWeight: 'bold' },
  nextBtn: { backgroundColor: '#0ea5e9', flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, gap: 8 },
  nextText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
