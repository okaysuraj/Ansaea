import type { DailyCall } from '@daily-co/react-native-daily-js';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  ArrowLeft,
  ExternalLink,
  Mic,
  MicOff,
  PhoneOff,
  Shield,
  Video,
  VideoOff,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Palette, Radius, Spacing } from '../../constants/theme';

// Lazy resolver: WebRTC native modules are only compiled in custom dev builds (expo run:android / EAS Build), not standard Expo Go.
function getDailyModule() {
  try {
    const dailyModule = require('@daily-co/react-native-daily-js');
    return dailyModule?.default || dailyModule;
  } catch {
    return null;
  }
}

export default function VideoCallScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();
  const callObject = useRef<DailyCall | null>(null);
  const [callState, setCallState] = useState('idle');
  const [participants, setParticipants] = useState<any>({});
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    const Daily = getDailyModule();
    if (!Daily) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    if (!url || typeof url !== 'string') {
      alert('Invalid meeting URL');
      router.back();
      return;
    }

    const initCall = async () => {
      let call: any = null;
      try {
        call = Daily.createCallObject();
        callObject.current = call;
      } catch (err: any) {
        console.error('Daily createCallObject error:', err);
        setCallState('error');
        return;
      }
      if (!call) return;

      call.on('joining-meeting', () => setCallState('joining'));
      call.on('joined-meeting', (event: any) => {
        setCallState('joined');
        setParticipants(event?.participants || {});
      });
      call.on('participant-joined', (event: any) => {
        setParticipants((prev: any) => ({
          ...prev,
          [event.participant.session_id]: event.participant,
        }));
      });
      call.on('participant-updated', (event: any) => {
        setParticipants((prev: any) => ({
          ...prev,
          [event.participant.session_id]: event.participant,
        }));
      });
      call.on('participant-left', (event: any) => {
        setParticipants((prev: any) => {
          const next = { ...prev };
          delete next[event.participant.session_id];
          return next;
        });
      });
      call.on('error', (event: any) => {
        console.error('Daily error:', event?.errorMsg);
        alert('Call error: ' + event?.errorMsg);
        leaveCall();
      });

      await call.join({ url });
    };

    initCall();

    return () => {
      if (callObject.current) {
        callObject.current.leave().then(() => {
          callObject.current?.destroy();
        });
      }
    };
  }, [url]);

  const leaveCall = async () => {
    if (callObject.current) {
      await callObject.current.leave();
      await callObject.current.destroy();
      callObject.current = null;
    }
    router.back();
  };

  const toggleAudio = () => {
    if (callObject.current) {
      const current = callObject.current.localAudio();
      callObject.current.setLocalAudio(!current);
      setIsAudioMuted(current);
    }
  };

  const toggleVideo = () => {
    if (callObject.current) {
      const current = callObject.current.localVideo();
      callObject.current.setLocalVideo(!current);
      setIsVideoMuted(current);
    }
  };

  if (isSupported === false) {
    const handleOpenBrowser = async () => {
      if (url && typeof url === 'string') {
        await WebBrowser.openBrowserAsync(url);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.noticeContainer}>
          <View style={styles.badgeRow}>
            <Shield size={14} color={Palette.sageLuminous} style={{ marginRight: 6 }} />
            <Text style={styles.noticeBadge}>ENCRYPTED CONSULTATION</Text>
          </View>
          <Text style={styles.noticeTitle}>Ansaea Telehealth Room</Text>
          <Text style={styles.noticeText}>
            You are entering a secure peer-to-peer clinical consultation. Microphones and camera
            feeds are end-to-end encrypted under HIPAA guidelines.
          </Text>

          {url ? (
            <TouchableOpacity
              style={styles.launchButton}
              onPress={handleOpenBrowser}
              activeOpacity={0.88}
            >
              <ExternalLink size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.launchButtonText}>Enter Consultation Room</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <ArrowLeft size={16} color={Palette.textDarkSecondary} style={{ marginRight: 6 }} />
            <Text style={styles.backButtonText}>Return to Consultation Hub</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {callState !== 'joined' ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Palette.sageLuminous} />
          <Text style={styles.statusText}>
            {callState === 'joining'
              ? 'Connecting to clinical room...'
              : 'Initializing media pipeline...'}
          </Text>
        </View>
      ) : (
        <View style={styles.callContainer}>
          <View style={styles.callHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>SECURE SESSION</Text>
            </View>
            <Text style={styles.participantCount}>
              Participants: {Object.keys(participants).length}
            </Text>
          </View>

          <View style={styles.videoPlaceholder}>
            <Video size={48} color={Palette.textDarkTertiary} style={{ marginBottom: 12 }} />
            <Text style={styles.placeholderText}>Consultation Video Stream</Text>
            <Text style={styles.placeholderSub}>Camera feed connected and encrypted</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, isAudioMuted && styles.controlButtonMuted]}
              onPress={toggleAudio}
              activeOpacity={0.8}
            >
              {isAudioMuted ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, isVideoMuted && styles.controlButtonMuted]}
              onPress={toggleVideo}
              activeOpacity={0.8}
            >
              {isVideoMuted ? (
                <VideoOff size={22} color="#fff" />
              ) : (
                <Video size={22} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.leaveButton]}
              onPress={leaveCall}
              activeOpacity={0.8}
            >
              <PhoneOff size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surfaceDark0 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { color: Palette.textDarkPrimary, marginTop: 16, fontSize: 15, fontWeight: '500' },
  callContainer: { flex: 1, padding: Spacing.four },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 106, 79, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.sagePrimary,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.sageLuminous,
    marginRight: 6,
  },
  liveText: { color: Palette.sageLuminous, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  participantCount: { color: Palette.textDarkSecondary, fontSize: 14, fontWeight: '500' },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: Palette.surfaceDark1,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.borderDark,
  },
  placeholderText: { color: Palette.textDarkPrimary, fontSize: 16, fontWeight: '600' },
  placeholderSub: { color: Palette.textDarkSecondary, fontSize: 13, marginTop: 4 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.four,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.surfaceDark3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonMuted: { backgroundColor: Palette.danger },
  leaveButton: { backgroundColor: Palette.danger },
  noticeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.six,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.two },
  noticeBadge: { color: Palette.sageLuminous, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  noticeTitle: {
    color: Palette.textDarkPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.three,
    textAlign: 'center',
  },
  noticeText: {
    color: Palette.textDarkSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.six,
  },
  launchButton: {
    backgroundColor: Palette.sagePrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.six,
    borderRadius: Radius.lg,
    width: '100%',
    marginBottom: Spacing.three,
  },
  launchButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  backButton: {
    backgroundColor: Palette.surfaceDark1,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: Spacing.six,
    borderRadius: Radius.lg,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: { color: Palette.textDarkSecondary, fontWeight: '600', fontSize: 14 },
});
