import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Gift } from 'lucide-react-native';
import Header from './components/Header';

const ShopScreen = ({ onSelectProduct }) => {
  const [category, setCategory] = useState('consumer'); // 'consumer' | 'consumable'
  // Mock description
  const desc = "This premium item is carefully selected for your daily needs. High quality, durable, and worth every coin.";
  const products = {
    consumer: [
      { id: 1, name: 'แปรงสีฟัน', price: 550, icon: '🪥', description: desc, category: 'consumer' },
      { id: 2, name: 'ยาสีฟัน', price: 850, icon: '🦷', description: desc, category: 'consumer' },
      { id: 3, name: 'มีดโกนหนวด', price: 1200, icon: '🪒', description: desc, category: 'consumer' },
      { id: 4, name: 'ยาสระผม', price: 1590, icon: '🧴', description: desc, category: 'consumer' },
      { id: 5, name: 'ทิชชู่', price: 450, icon: '🧻', description: desc, category: 'consumer' },
      { id: 6, name: 'สบู่', price: 350, icon: '🧼', description: desc, category: 'consumer' },
      { id: 7, name: 'น้ำยาซักผ้า', price: 1290, icon: '🧺', description: desc, category: 'consumer' },
      { id: 8, name: 'น้ำยาล้างจาน', price: 490, icon: '🍽️', description: desc, category: 'consumer' }
    ],
    consumable: [
      { id: 9, name: 'ข้าวสาร (5kg)', price: 2500, icon: '🍚', description: desc, category: 'consumable' },
      { id: 10, name: 'บะหมี่กึ่งสำเร็จรูป', price: 150, icon: '🍜', description: desc, category: 'consumable' },
      { id: 11, name: 'อาหารกระป๋อง', price: 350, icon: '🥫', description: desc, category: 'consumable' },
      { id: 12, name: 'อาหารแห้ง', price: 650, icon: '🥜', description: desc, category: 'consumable' },
      { id: 13, name: 'ซีเรียล', price: 1800, icon: '🥣', description: desc, category: 'consumable' },
      { id: 14, name: 'คุกกี้', price: 450, icon: '🍪', description: desc, category: 'consumable' },
      { id: 15, name: 'เวเฟอร์', price: 250, icon: '🧇', description: desc, category: 'consumable' },
      { id: 16, name: 'หมากฝรั่ง', price: 100, icon: '🍬', description: desc, category: 'consumable' },
      { id: 17, name: 'กาแฟผง', price: 1200, icon: '☕', description: desc, category: 'consumable' },
      { id: 18, name: 'น้ำดื่ม', price: 120, icon: '💧', description: desc, category: 'consumable' }
    ]
  };

  return (
    <View style={styles.container}>
      <Header title="Redeem Shop" />
      <View style={styles.tabContainer}>
        <View style={styles.tabsWrapper}>
          <TouchableOpacity
            onPress={() => setCategory('consumer')}
            style={[styles.tab, category === 'consumer' ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={[styles.tabText, category === 'consumer' ? styles.tabTextActive : styles.tabTextInactive]}>สินค้าอุปโภค</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCategory('consumable')}
            style={[styles.tab, category === 'consumable' ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={[styles.tabText, category === 'consumable' ? styles.tabTextActive : styles.tabTextInactive]}>สินค้าบริโภค</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.productList}>
        {products[category].map((item) => (
          <TouchableOpacity key={item.id} onPress={() => onSelectProduct(item)} style={styles.productCard}>
            <View style={styles.productInfo}>
              <View style={styles.productIconContainer}>
                <Text style={styles.productIcon}>{item.icon}</Text>
              </View>
              <View>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Gift size={14} color="#f59e0b" />
                  <Text style={styles.priceText}>{item.price.toLocaleString()} Coins</Text>
                </View>
              </View>
            </View>
            <View style={styles.redeemButton}>
              <Text style={styles.redeemText}>Redeem</Text>
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
  tabContainer: {
    padding: 16,
    backgroundColor: 'rgba(250, 250, 250, 0.95)',
    zIndex: 10,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#18181b', // zinc-900
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabTextInactive: {
    color: '#71717a',
  },
  productList: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  productCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  productIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productIcon: {
    fontSize: 32,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b', // amber-500
  },
  redeemButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#18181b',
  },
  redeemText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default ShopScreen;
