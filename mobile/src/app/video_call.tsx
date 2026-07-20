import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Daily, { DailyCall } from '@daily-co/react-native-daily-js';
// Note: Actual rendering requires @daily-co/react-native-webrtc DailyMediaView
// For this audit implementation, we set up the call state and layout.

export default function VideoCallScreen() {
    const { url } = useLocalSearchParams();
    const router = useRouter();
    const callObject = useRef<DailyCall | null>(null);
    const [callState, setCallState] = useState('idle');
    const [participants, setParticipants] = useState<any>({});

    useEffect(() => {
        if (!url || typeof url !== 'string') {
            alert('Invalid meeting URL');
            router.back();
            return;
        }

        const initCall = async () => {
            callObject.current = Daily.createCallObject();
            
            callObject.current.on('joining-meeting', () => setCallState('joining'));
            callObject.current.on('joined-meeting', (event) => {
                setCallState('joined');
                setParticipants(event?.participants || {});
            });
            callObject.current.on('participant-joined', (event) => {
                setParticipants((prev: any) => ({ ...prev, [event.participant.session_id]: event.participant }));
            });
            callObject.current.on('participant-updated', (event) => {
                setParticipants((prev: any) => ({ ...prev, [event.participant.session_id]: event.participant }));
            });
            callObject.current.on('participant-left', (event) => {
                setParticipants((prev: any) => {
                    const next = { ...prev };
                    delete next[event.participant.session_id];
                    return next;
                });
            });
            callObject.current.on('error', (event) => {
                console.error('Daily error:', event?.errorMsg);
                alert('Call error: ' + event?.errorMsg);
                leaveCall();
            });

            await callObject.current.join({ url });
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
        }
    };

    const toggleVideo = () => {
        if (callObject.current) {
            const current = callObject.current.localVideo();
            callObject.current.setLocalVideo(!current);
        }
    };

    return (
        <View style={styles.container}>
            {callState !== 'joined' ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.statusText}>{callState === 'joining' ? 'Joining meeting...' : 'Initializing...'}</Text>
                </View>
            ) : (
                <View style={styles.callContainer}>
                    <Text style={styles.participantCount}>Participants: {Object.keys(participants).length}</Text>
                    {/* In a real app, render DailyMediaView here for each participant */}
                    <View style={styles.videoPlaceholder}>
                        <Text style={styles.placeholderText}>Video Grid (Requires DailyMediaView)</Text>
                    </View>
                    
                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.controlButton} onPress={toggleAudio}>
                            <Text style={styles.controlText}>Audio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton} onPress={toggleVideo}>
                            <Text style={styles.controlText}>Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.controlButton, styles.leaveButton]} onPress={leaveCall}>
                            <Text style={styles.controlText}>End Call</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    statusText: { color: '#fff', marginTop: 16, fontSize: 16 },
    callContainer: { flex: 1, padding: 16 },
    participantCount: { color: '#fff', fontSize: 16, textAlign: 'center', marginVertical: 8 },
    videoPlaceholder: { flex: 1, backgroundColor: '#333', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginVertical: 16 },
    placeholderText: { color: '#888' },
    controls: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16 },
    controlButton: { backgroundColor: '#444', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30 },
    leaveButton: { backgroundColor: '#e53e3e' },
    controlText: { color: '#fff', fontWeight: 'bold' }
});
