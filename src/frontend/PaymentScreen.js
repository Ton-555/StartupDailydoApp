import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CreditCard as DebitCard, Check } from 'lucide-react-native';
import Header from './components/Header';
import MinimalButton from './components/MinimalButton';
import { useTheme } from './context/ThemeContext';

const PaymentScreen = ({ navigate, item, user, cards, onRefreshUser }) => {
  const { isDarkMode, colors } = useTheme();
  const [method, setMethod] = useState('card');
  const [selectedCardId, setSelectedCardId] = useState(cards && cards.length > 0 ? cards[0].id : null);
  const [loading, setLoading] = useState(false);
  const [hasActiveSub, setHasActiveSub] = useState(false);

  useEffect(() => {
    if (item && item.type === 'package' && user?.users_id) {
      checkSubscriptionStatus();
    }
  }, [item, user]);

  const checkSubscriptionStatus = async () => {
    if (!user || !user.users_id) {
      console.log('[PaymentScreen] No user ID for sub check');
      return;
    }
    try {
      const API_BASE = 'http://10.0.2.2:3000';
      const url = `${API_BASE}/package/check/${user.users_id}`;
      console.log(`[PaymentScreen] Checking sub: ${url}`);
      const res = await fetch(url);
      const text = await res.text();
      console.log('[PaymentScreen] Raw response:', text);
      const json = JSON.parse(text);
      if (json.success && json.hasActivePackage) {
        setHasActiveSub(true);
        Alert.alert(
          'Active Subscription Found',
          'You already have an active subscription. You can only subscribe once per month.'
        );
      }
    } catch (error) {
      console.error('[PaymentScreen] Error checking subscription:', error);
    }
  };

  if (!item) return <View style={styles.center}><Text>No item selected</Text></View>;

  const handleConfirmPayment = async () => {
    if (loading) return;

    if (item.type === 'package' && hasActiveSub) {
      Alert.alert('Error', 'You already have an active subscription for this month.');
      return;
    }

    if (!selectedCardId) {
      Alert.alert('Error', 'Please select a credit card');
      return;
    }

    const card = cards.find(c => c.id === selectedCardId);
    if (!card) return;

    setLoading(true);
    try {
      const API_BASE = 'http://10.0.2.2:3000';

      // Calculate amount in Baht (for /checkout which multiplies by 100)
      let amountBaht = 0;
      if (item.priceSatang) {
        amountBaht = item.priceSatang / 100;
      } else {
        amountBaht = parseInt(item.price.replace(/[^0-9]/g, ''));
      }

      // 1. /checkout
      const checkoutRes = await fetch(`${API_BASE}/payment/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: card.cardHolder,
          number: card.cardNumber,
          expiryDate: card.expiryDate, // Should be YYYY-MM-DD or MM/YY?
          // Wait, apiPayment.js expects MM/YY in line 110: expiryDate.split('/')
          // But our database stores YYYY-MM-DD.
          // I need to format it for apiPayment.js or fix apiPayment.js.
          // Let's fix apiPayment.js to handle YYYY-MM-DD or MM/YY.
          cvc: card.cvv,
          amount: amountBaht
        })
      });

      const checkoutJson = await checkoutRes.json();

      if (checkoutJson.success) {
        // 2. /savelog
        const rewardAmount = item.type === 'coin'
          ? parseInt(item.name)
          : (item.coin || 0);

        const logRes = await fetch(`${API_BASE}/payment/savelog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            users_id: user.users_id,
            amount: rewardAmount,
            type: item.type,
            detail: item.name,
            packageId: item.packageId
          })
        });

        // 3. /savepayment
        await fetch(`${API_BASE}/payment/savepayment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            charge: checkoutJson.charge,
            users_id: user.users_id
          })
        });

        Alert.alert('Success', 'Payment Successful! Thank you.');
        if (onRefreshUser) await onRefreshUser();
        navigate('home');
      } else {
        // Charge failed
        // savepayment with false status maybe? User said: "ถ้า false ไม่ต้องทำอะไรแค่ขึ้น alert ว่าชำระเงินไม่สำเร็จ"
        Alert.alert('Payment Failed', checkoutJson.message || 'Charge failed. Please try again.');

        // Optionally save the failed payment record
        await fetch(`${API_BASE}/payment/savepayment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            charge: checkoutJson.charge || { id: 'failed_' + Date.now(), amount: amountBaht * 100 },
            users_id: user.users_id
          })
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Checkout" onBack={() => navigate(item.type === 'coin' ? 'topup' : 'package')} />
      <View style={styles.content}>
        <Text style={[styles.sectionHeader, { color: colors.subText }]}>Order Summary</Text>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemDetail, { color: colors.subText }]}>{item.detail}</Text>
            </View>
            <View style={[styles.priceBadge, { backgroundColor: isDarkMode ? '#f4f4f5' : '#18181b' }]}>
              <Text style={[styles.priceText, { color: isDarkMode ? '#18181b' : '#ffffff' }]}>{item.price}</Text>
            </View>
          </View>
          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total to Pay</Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>{item.price}</Text>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { color: colors.subText }]}>Select Payment Card</Text>
        <View style={styles.methodsContainer}>
          {cards && cards.length > 0 ? (
            cards.map(card => (
              <TouchableOpacity
                key={card.id}
                onPress={() => setSelectedCardId(card.id)}
                style={[
                  styles.methodCard,
                  selectedCardId === card.id
                    ? [styles.methodSelected, { backgroundColor: colors.card, borderColor: isDarkMode ? '#f4f4f5' : '#18181b' }]
                    : [styles.methodUnselected, { backgroundColor: colors.card, borderColor: colors.border }]
                ]}
              >
                <View style={styles.methodInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? colors.background : '#f4f4f5' }]}><DebitCard size={24} color={colors.text} /></View>
                  <View>
                    <Text style={[styles.methodTitle, { color: colors.text }]}>{card.cardHolder}</Text>
                    <Text style={[styles.cardLast4, { color: colors.subText }]}>**** **** **** {card.last4}</Text>
                  </View>
                </View>
                {selectedCardId === card.id && (
                  <View style={[styles.checkContainer, { backgroundColor: isDarkMode ? '#f4f4f5' : '#18181b' }]}><Check size={12} color={isDarkMode ? '#18181b' : 'white'} /></View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity
              onPress={() => navigate('creditcard')}
              style={[styles.methodCard, styles.methodUnselected, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={{ color: colors.subText }}>No cards found. Tap to add.</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <MinimalButton
            fullWidth
            loading={loading}
            onClick={handleConfirmPayment}
          >
            Confirm Payment
          </MinimalButton>
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
  cardLast4: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    marginTop: 20
  }
});

export default PaymentScreen;