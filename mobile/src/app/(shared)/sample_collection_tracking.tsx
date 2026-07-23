import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SampleCollectionTracking() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sample Collection Tracking</Text>
            <View style={styles.statusBox}>
                <Text style={styles.statusLabel}>Current Status:</Text>
                <Text style={styles.statusValue}>Agent En Route</Text>
                <Text style={styles.details}>Estimated Arrival: 2:45 PM</Text>
                <Text style={styles.details}>Agent: John Doe (+1 234 567 8900)</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    statusBox: { padding: 16, backgroundColor: '#e6fffa', borderRadius: 8, borderWidth: 1, borderColor: '#b2f5ea' },
    statusLabel: { fontSize: 14, color: '#319795', marginBottom: 4 },
    statusValue: { fontSize: 20, fontWeight: 'bold', color: '#2c7a7b', marginBottom: 12 },
    details: { fontSize: 14, color: '#4a5568', marginTop: 4 }
});
