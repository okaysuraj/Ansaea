import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Patients() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Directory</Text>
      </View>
      <View style={styles.content}>
        <Users size={64} color="#334155" />
        <Text style={styles.emptyText}>No patients assigned.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94A3B8', marginTop: 16, fontSize: 16 }
});
