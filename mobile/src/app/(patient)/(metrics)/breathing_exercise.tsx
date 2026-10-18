import { router } from 'expo-router';
import { ArrowLeft, Pause, Play, RotateCcw, Wind } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BreathingExercise() {
  const [pattern, setPattern] = useState<'box' | 'relax' | 'energize'>('box');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const patterns = {
    box: { name: 'Box (4-4-4-4)', inhale: 4, hold: 4, exhale: 4, rest: 4 },
    relax: { name: 'Relax (4-7-8)', inhale: 4, hold: 7, exhale: 8, rest: 0 },
    energize: { name: 'Energize (4-2-4)', inhale: 4, hold: 2, exhale: 4, rest: 0 },
  };

  useEffect(() => {
    let timer: any = null;
    if (isActive) {
      const cfg = patterns[pattern];
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phase
          if (phase === 'Inhale') {
            if (cfg.hold > 0) {
              setPhase('Hold');
              return cfg.hold;
            } else {
              setPhase('Exhale');
              return cfg.exhale;
            }
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return cfg.exhale;
          } else if (phase === 'Exhale') {
            if (cfg.rest > 0) {
              setPhase('Rest');
              return cfg.rest;
            } else {
              setCyclesCompleted((c) => c + 1);
              setPhase('Inhale');
              return cfg.inhale;
            }
          } else {
            setCyclesCompleted((c) => c + 1);
            setPhase('Inhale');
            return cfg.inhale;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase, pattern]);

  useEffect(() => {
    if (!isActive) {
      Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      return;
    }
    const cfg = patterns[pattern];
    if (phase === 'Inhale') {
      Animated.timing(scaleAnim, {
        toValue: 1.45,
        duration: cfg.inhale * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (phase === 'Exhale') {
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: cfg.exhale * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [phase, isActive]);

  const handleToggle = () => {
    if (!isActive) {
      setIsActive(true);
      setPhase('Inhale');
      setCountdown(patterns[pattern].inhale);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setCountdown(patterns[pattern].inhale);
    setCyclesCompleted(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Somatic Breathwork</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Preset Selector */}
        <View style={styles.patternRow}>
          {(['box', 'relax', 'energize'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.patternBtn, pattern === p && styles.patternBtnActive]}
              onPress={() => {
                setPattern(p);
                setIsActive(false);
                setPhase('Inhale');
                setCountdown(patterns[p].inhale);
              }}
            >
              <Text style={[styles.patternText, pattern === p && styles.patternTextActive]}>
                {patterns[p].name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Breath Circle Visualizer */}
        <View style={styles.visualizerContainer}>
          <Animated.View style={[styles.breathCircleOuter, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.breathCircleInner}>
              <Wind size={44} color="#0ea5e9" />
              <Text style={styles.phaseText}>{phase}</Text>
              <Text style={styles.countdownText}>{countdown}s</Text>
            </View>
          </Animated.View>
        </View>

        {/* Counter */}
        <Text style={styles.cyclesText}>Cycles Completed: {cyclesCompleted}</Text>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtnSecondary} onPress={handleReset}>
            <RotateCcw size={20} color="#94A3B8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtnPrimary} onPress={handleToggle}>
            {isActive ? <Pause size={24} color="#fff" /> : <Play size={24} color="#fff" />}
            <Text style={styles.controlBtnText}>{isActive ? 'Pause' : 'Start Session'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'space-between' },
  patternRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  patternBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  patternBtnActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  patternText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  patternTextActive: { color: '#fff' },
  visualizerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  breathCircleOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathCircleInner: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  phaseText: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  countdownText: { color: '#0ea5e9', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  cyclesText: { color: '#94A3B8', fontSize: 14, marginBottom: 24 },
  controlsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  controlBtnSecondary: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  controlBtnPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  controlBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
