import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DrugInteractionWarning() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Drug Interaction Warnings</Text>
            <View style={styles.alertBox}>
                <Text style={styles.alertTitle}>⚠️ Potential Interaction Detected</Text>
                <Text style={styles.alertText}>Taking Aspirin with Warfarin increases the risk of bleeding. Please consult your doctor before combining these medications.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    alertBox: { backgroundColor: '#fff3cd', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ffeeba' },
    alertTitle: { fontWeight: 'bold', color: '#856404', marginBottom: 8, fontSize: 16 },
    alertText: { color: '#856404', fontSize: 14 }
});
