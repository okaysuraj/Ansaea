import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/useAuth';

export default function DisputeResolution() {
  const { authenticatedFetch } = useAuth();
  const [subject, setSubject] = useState('');
  const [disputeText, setDisputeText] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await authenticatedFetch('/api/support/tickets');
      if (res.ok) setTickets(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [authenticatedFetch]);

  const handleSubmit = async () => {
    if (!subject || !disputeText) {
      Alert.alert('Error', 'Please enter a subject and description.');
      return;
    }
    try {
      const res = await authenticatedFetch('/api/support/tickets', {
        method: 'POST',
        body: JSON.stringify({
          subject,
          description: disputeText,
          category: 'other',
          priority: 'medium',
        }),
      });
      if (res.ok) {
        Alert.alert('Dispute Submitted', 'Our support team will contact you shortly.');
        setSubject('');
        setDisputeText('');
        fetchTickets();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to submit dispute.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support & Dispute Resolution</Text>

      <View style={styles.formCard}>
        <Text style={styles.subtitle}>Create a new ticket:</Text>
        <TextInput
          style={styles.input}
          placeholder="Subject..."
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Describe the issue..."
          value={disputeText}
          onChangeText={setDisputeText}
        />
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Submit Ticket</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { marginTop: 20 }]}>Your Tickets</Text>
      {loading ? (
        <ActivityIndicator color="#0ea5e9" />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.ticketCard}>
              <Text style={styles.ticketSubject}>{item.subject}</Text>
              <Text style={styles.ticketStatus}>Status: {item.status}</Text>
              <Text style={styles.ticketDate}>{item.created_at}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No tickets found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, marginBottom: 12, color: '#555' },
  formCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  btn: { backgroundColor: '#0ea5e9', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  ticketCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginTop: 8, elevation: 1 },
  ticketSubject: { fontWeight: 'bold', fontSize: 16 },
  ticketStatus: { color: '#0ea5e9', marginTop: 4 },
  ticketDate: { color: '#999', fontSize: 12, marginTop: 4 },
});
