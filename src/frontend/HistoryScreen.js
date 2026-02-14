import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const HistoryScreen = ({ onSelectItem, user }) => {
  const { isDarkMode, colors } = useTheme();
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user?.users_id) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/history/${user.users_id}`);
      const json = await response.json();
      if (json.success) {
        console.log('History Data:', JSON.stringify(json.data, null, 2)); // Debug: Check actual data structure

        const mappedHistory = json.data.map((order, index) => {
          // Safe date formatting
          let dateStr = 'Unknown Date';
          let timeStr = '';
          try {
            if (order.created_at) {
              const dateObj = new Date(order.created_at);
              dateStr = dateObj.getDate() + ' ' + dateObj.toLocaleString('default', { month: 'short' }) + ' ' + dateObj.getFullYear();
              timeStr = dateObj.getHours().toString().padStart(2, '0') + ':' + dateObj.getMinutes().toString().padStart(2, '0');
            }
          } catch (e) {
            console.log('Date parse error', e);
          }

          // Safe product name access
          let prodName = 'Unknown Product';
          if (order.products_id === 1001) prodName = 'Standard Plan';
          else if (order.products_id === 1002) prodName = 'Premium Plan';
          else if (order.products_id === 1003) prodName = 'Platinum Plan';
          else if (order.products) {
            if (Array.isArray(order.products)) {
              prodName = order.products[0]?.name || 'Unknown Product';
            } else {
              prodName = order.products.name || 'Unknown Product';
            }
          }

          // Safe ID handling
          const safeId = order.id ? order.id.toString() : `temp-${index}`;

          return {
            id: safeId,
            productName: prodName,
            coinsUsed: order.total_price || 0,
            date: timeStr ? `${dateStr}, ${timeStr}` : dateStr,
            status: order.status || 'pending',
            trackingId: order.tracking_number || '-'
          };
        });
        setHistory(mappedHistory);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="History" />
      <ScrollView contentContainerStyle={styles.listContainer}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.text }}>Loading...</Text>
        ) : history.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.text }}>No history found.</Text>
        ) : (
          history.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelectItem(item)}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.productName, { color: colors.text }]}>{item.productName}</Text>
                <View style={[
                  styles.statusBadge,
                  item.status === 'completed'
                    ? (isDarkMode ? styles.statusSuccessDark : styles.statusSuccess)
                    : (isDarkMode ? styles.statusPendingDark : styles.statusPending)
                ]}>
                  <Text style={[styles.statusText, item.status === 'completed' ? styles.textSuccess : styles.textPending]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.dateContainer}>
                  <Clock size={14} color={colors.subText} />
                  <Text style={[styles.dateText, { color: colors.subText }]}>{item.date}</Text>
                </View>
                <Text style={styles.coinsText}>-{item.coinsUsed} coins</Text>
              </View>
            </TouchableOpacity>
          )))}
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
  statusSuccessDark: {
    backgroundColor: '#064e3b',
  },
  statusPending: {
    backgroundColor: '#fff7ed', // orange-50
  },
  statusPendingDark: {
    backgroundColor: '#7c2d12',
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