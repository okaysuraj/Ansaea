import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Switch } from 'react-native';
import { router } from 'expo-router';
import { Video, Phone, MapPin, Info, ArrowLeft } from 'lucide-react-native';

export default function ConsultationSetup() {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [inPersonEnabled, setInPersonEnabled] = useState(true);

  const [activeDuration, setActiveDuration] = useState('15');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn}>
            <ArrowLeft size={24} color="#0ea5e9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ansaea</Text>
        </View>
        <Text style={styles.stepText}>Step 5 of 6</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.progressBox}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Consultation Setup</Text>
            <Text style={styles.subtitle}>Define your service types and professional fees.</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '83%' }]} />
          </View>
        </View>

        <View style={[styles.card, !videoEnabled && styles.cardInactive]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(14, 165, 233, 0.2)' }]}>
                <Video size={24} color="#0ea5e9" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Video Consultations</Text>
                <Text style={styles.cardSub}>Encrypted high-def telehealth.</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.cardControls}>
            <View style={styles.feeBox}>
              <Text style={styles.label}>Fee (USD)</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="0.00" 
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  defaultValue="150"
                  editable={videoEnabled}
                />
              </View>
            </View>
            <Switch 
              value={videoEnabled}
              onValueChange={setVideoEnabled}
              trackColor={{ false: '#334155', true: '#0ea5e9' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={[styles.card, !audioEnabled && styles.cardInactive]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <Phone size={24} color="#8b5cf6" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Audio Consultations</Text>
                <Text style={styles.cardSub}>Secure voice-only check-ins.</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.cardControls}>
            <View style={styles.feeBox}>
              <Text style={styles.label}>Fee (USD)</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="0.00" 
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  editable={audioEnabled}
                />
              </View>
            </View>
            <Switch 
              value={audioEnabled}
              onValueChange={setAudioEnabled}
              trackColor={{ false: '#334155', true: '#0ea5e9' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={[styles.card, !inPersonEnabled && styles.cardInactive]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <MapPin size={24} color="#ef4444" />
              </View>
              <View>
                <Text style={styles.cardTitle}>In-Person Visits</Text>
                <Text style={styles.cardSub}>Physical appointments at clinic.</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.cardControls}>
            <View style={styles.feeBox}>
              <Text style={styles.label}>Fee (USD)</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="0.00" 
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  defaultValue="200"
                  editable={inPersonEnabled}
                />
              </View>
            </View>
            <Switch 
              value={inPersonEnabled}
              onValueChange={setInPersonEnabled}
              trackColor={{ false: '#334155', true: '#0ea5e9' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={styles.durationCard}>
          <Text style={styles.durationTitle}>Typical Consultation Duration</Text>
          <Text style={styles.durationSub}>This will be used to auto-generate your booking slots.</Text>
          
          <View style={styles.durationRow}>
            {['15', '30', '45', '60'].map(min => (
              <TouchableOpacity 
                key={min} 
                style={[styles.durationBtn, activeDuration === min && styles.durationBtnActive]}
                onPress={() => setActiveDuration(min)}
              >
                <Text style={[styles.durationText, activeDuration === min && styles.durationTextActive]}>{min} Mins</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Info size={24} color="#0ea5e9" />
          <Text style={styles.infoText}>You can always adjust these fees and durations per patient or per visit later in your Clinical Dashboard.</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnBack}>
          <Text style={styles.btnBackText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnNext}>
          <Text style={styles.btnNextText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 64, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F172A' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0ea5e9', marginLeft: 8 },
  stepText: { fontSize: 14, color: '#94A3B8', fontWeight: 'bold' },
  
  scroll: { padding: 16, paddingBottom: 100 },
  
  progressBox: { marginBottom: 32 },
  titleSection: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94A3B8' },
  progressBarBg: { height: 4, backgroundColor: '#1E293B', borderRadius: 2 },
  progressBarFill: { height: '100%', backgroundColor: '#0ea5e9', borderRadius: 2 },

  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardInactive: { opacity: 0.6 },
  cardHeader: { marginBottom: 16 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 2 },
  cardSub: { fontSize: 12, color: '#94A3B8' },
  
  cardControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  feeBox: { flex: 1, marginRight: 16 },
  label: { fontSize: 12, color: '#94A3B8', fontWeight: 'bold', marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 8, borderWidth: 1, borderColor: '#334155', height: 44, paddingHorizontal: 12 },
  currencySymbol: { color: '#94A3B8', fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },

  durationCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155', marginTop: 8 },
  durationTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  durationSub: { fontSize: 12, color: '#94A3B8', marginBottom: 16 },
  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  durationBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155' },
  durationBtnActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  durationText: { color: '#94A3B8', fontWeight: 'bold', fontSize: 13 },
  durationTextActive: { color: '#FFF' },

  infoBox: { flexDirection: 'row', backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#0ea5e9', marginTop: 8 },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#F8FAFC', lineHeight: 20 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#1E293B', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  btnBack: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: '#334155' },
  btnBackText: { color: '#94A3B8', fontWeight: 'bold', fontSize: 16 },
  btnNext: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24, backgroundColor: '#0ea5e9' },
  btnNextText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
