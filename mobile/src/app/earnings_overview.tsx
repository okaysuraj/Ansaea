import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EarningsOverview() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Earnings Overview</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Total Earnings this Month</Text>
                <Text style={styles.amount}>$4,250.00</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Pending Payouts</Text>
                <Text style={styles.amount}>$320.00</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    label: { fontSize: 16, color: '#666', marginBottom: 8 },
    amount: { fontSize: 28, fontWeight: 'bold', color: '#2b6cb0' }
});
