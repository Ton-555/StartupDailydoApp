import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';
import Header from './components/Header';

const HistoryScreen = ({ onSelectItem }) => {
  const history = [
    { id: '1', productName: 'Premium Headphones', coinsUsed: 2500, date: '24 Jan 2026, 10:30 AM', status: 'completed', trackingId: 'TH24018899X' },
    { id: '2', productName: 'Coffee Voucher', coinsUsed: 50, date: '23 Jan 2026, 02:15 PM', status: 'completed', trackingId: 'VOUCHER-DIGITAL' },
    { id: '3', productName: 'Discount Code', coinsUsed: 100, date: '20 Jan 2026, 09:00 AM', status: 'pending' },
  ];
  return (
    <View style={styles.container}>
      <Header title="History" />
      <ScrollView contentContainerStyle={styles.listContainer}>
        {history.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => onSelectItem(item)} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.productName}>{item.productName}</Text>
              <View style={[styles.statusBadge, item.status === 'completed' ? styles.statusSuccess : styles.statusPending]}>
                <Text style={[styles.statusText, item.status === 'completed' ? styles.textSuccess : styles.textPending]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.dateContainer}>
                <Clock size={14} color="#71717a" />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <Text style={styles.coinsText}>-{item.coinsUsed} coins</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18181b', // zinc-900
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusSuccess: {
    backgroundColor: '#ecfdf5', // green-50
  },
  statusPending: {
    backgroundColor: '#fff7ed', // orange-50
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  textSuccess: {
    color: '#059669', // green-600
  },
  textPending: {
    color: '#f97316', // orange-500
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#71717a', // zinc-500
  },
  coinsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444', // red-500
  }
});

export default HistoryScreen;