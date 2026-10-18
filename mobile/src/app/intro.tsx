import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, HeartPulse, ShieldCheck, Video } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppIntroduction() {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Your health, connected',
      desc: 'Connect with certified specialists, manage biometrics, and track your mental well-being in one unified clinical ecosystem.',
      icon: <HeartPulse size={48} color="#0ea5e9" strokeWidth={1.75} />,
      badge: 'Integrated Care',
    },
    {
      title: 'Modern tele-consultations',
      desc: 'Encrypted HD video sessions, instant clinical messaging, and synchronized diagnostic workspaces for you and your psychiatrist.',
      icon: <Video size={48} color="#8b5cf6" strokeWidth={1.75} />,
      badge: 'Tele-Health',
    },
    {
      title: 'Private & secure by design',
      desc: 'ABHA-compliant infrastructure, end-to-end data encryption, and strict medical privacy protect every consultation.',
      icon: <ShieldCheck size={48} color="#10b981" strokeWidth={1.75} />,
      badge: 'HIPAA & ABHA',
    },
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header / Skip */}
      <View style={styles.topBar}>
        <Text style={styles.logoText}>ANSAEA</Text>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Slide Card */}
      <View style={styles.slideContainer}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{slides[step].badge}</Text>
        </View>

        <View style={styles.iconCircle}>{slides[step].icon}</View>

        <Text style={styles.title}>{slides[step].title}</Text>
        <Text style={styles.description}>{slides[step].desc}</Text>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === step ? styles.activeDot : null]} />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          {step > 0 ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(step - 1)}
              activeOpacity={0.7}
            >
              <ArrowLeft size={18} color="#94A3B8" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 80 }} />
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>
              {step === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoText: {
    color: '#0EA5E9',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  skipText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  slideContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  badgeContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 32,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  footer: {
    paddingBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#0EA5E9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 140,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
