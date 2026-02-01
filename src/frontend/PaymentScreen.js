import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { QrCode, CreditCard as DebitCard, Check } from 'lucide-react-native';
import Header from './components/Header';
import MinimalButton from './components/MinimalButton';

const PaymentScreen = ({ navigate, item }) => {
  const [method, setMethod] = useState('qrcode'); // 'qrcode' | 'card'

  if (!item) return <View style={styles.center}><Text>No item selected</Text></View>;

  return (
    <View style={styles.container}>
      <Header title="Checkout" onBack={() => navigate(item.type === 'coin' ? 'topup' : 'package')} />
      <View style={styles.content}>
        <Text style={styles.sectionHeader}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>{item.detail}</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <Text style={styles.totalAmount}>{item.price}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Payment Method</Text>
        <View style={styles.methodsContainer}>
          <TouchableOpacity
            onPress={() => setMethod('qrcode')}
            style={[styles.methodCard, method === 'qrcode' ? styles.methodSelected : styles.methodUnselected]}
          >
            <View style={styles.methodInfo}>
              <View style={styles.iconContainer}><QrCode size={24} color="#18181b" /></View>
              <Text style={styles.methodTitle}>QR Code PromptPay</Text>
            </View>
            {method === 'qrcode' && (
              <View style={styles.checkContainer}><Check size={12} color="white" /></View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMethod('card')}
            style={[styles.methodCard, method === 'card' ? styles.methodSelected : styles.methodUnselected]}
          >
            <View style={styles.methodInfo}>
              <View style={styles.iconContainer}><DebitCard size={24} color="#18181b" /></View>
              <Text style={styles.methodTitle}>Credit / Debit Card</Text>
            </View>
            {method === 'card' && (
              <View style={styles.checkContainer}><Check size={12} color="white" /></View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <MinimalButton fullWidth onClick={() => { Alert.alert('Success', 'Payment Successful! Thank you.'); navigate('home'); }}>Confirm Payment</MinimalButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#71717a', // zinc-500
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18181b',
  },
  itemDetail: {
    fontSize: 14,
    color: '#71717a',
    marginTop: 4,
  },
  priceBadge: {
    backgroundColor: '#18181b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    marginTop: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#18181b',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#18181b',
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  methodCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#18181b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodUnselected: {
    backgroundColor: '#ffffff',
    borderColor: '#e4e4e7',
    opacity: 0.8,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
  },
  methodTitle: {
    fontWeight: '500',
    color: '#18181b',
  },
  checkContainer: {
    width: 20,
    height: 20,
    backgroundColor: '#18181b',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 20
  }
});

export default PaymentScreen;
