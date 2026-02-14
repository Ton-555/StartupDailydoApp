import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Gift } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const ShopScreen = ({ onSelectProduct }) => {
  const { isDarkMode, colors } = useTheme();
  const [category, setCategory] = useState('consumer'); // 'consumer' | 'consumable'
  const [products, setProducts] = useState({ consumer: [], consumable: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // เปลี่ยน URL ให้ตรงกับ backend จริง
  // สำหรับ Android Emulator ต้องใช้ 10.0.2.2 แทน localhost
  const API_URL = 'http://10.0.2.2:3000/products/all';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          // หมวดหมู่ใน backend เป็นภาษาไทย ต้อง map ให้ตรง
          const consumer = result.data.filter(p => p.category === 'อุปโภค');
          const consumable = result.data.filter(p => p.category === 'บริโภค');
          setProducts({ consumer, consumable });
        } else {
          setError('ไม่พบข้อมูลสินค้า');
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดสินค้า: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Redeem Shop" />
      <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? 'rgba(24, 24, 27, 0.95)' : 'rgba(250, 250, 250, 0.95)' }]}>
        <View style={[styles.tabsWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => setCategory('consumer')}
            style={[styles.tab, category === 'consumer' ? (isDarkMode ? styles.tabActiveDark : styles.tabActive) : styles.tabInactive]}
          >
            <Text style={[styles.tabText, category === 'consumer' ? styles.tabTextActive : (isDarkMode ? styles.tabTextInactiveDark : styles.tabTextInactive)]}>สินค้าอุปโภค</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCategory('consumable')}
            style={[styles.tab, category === 'consumable' ? (isDarkMode ? styles.tabActiveDark : styles.tabActive) : styles.tabInactive]}
          >
            <Text style={[styles.tabText, category === 'consumable' ? styles.tabTextActive : (isDarkMode ? styles.tabTextInactiveDark : styles.tabTextInactive)]}>สินค้าบริโภค</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ color: colors.text }}>กำลังโหลดสินค้า...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.productList}>
          {products[category].length === 0 ? (
            <Text style={{ color: colors.text }}>ไม่มีสินค้าในหมวดนี้</Text>
          ) : (
            products[category].map((item) => (
              <TouchableOpacity
                key={item.products_id}
                onPress={() => onSelectProduct(item)}
                style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.productInfo}>
                  <View style={[styles.productIconContainer, { backgroundColor: isDarkMode ? colors.background : '#fafafa', overflow: 'hidden' }]}>
                    {item.image_uri ? (
                      <Image source={{ uri: item.image_uri }} style={styles.productImage} />
                    ) : (
                      <Text style={styles.productIcon}>{item.icon}</Text>
                    )}
                  </View>
                  <View>
                    <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
                    <View style={styles.priceRow}>
                      <Gift size={14} color="#f59e0b" />
                      <Text style={styles.priceText}>{typeof item.price_coin === 'number' ? item.price_coin.toLocaleString() : '-'} Coins</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.redeemButton, { backgroundColor: isDarkMode ? '#575656ff' : '#000000ff' }]}>
                  <Text style={[styles.redeemText, { color: isDarkMode ? '#ffffffff' : '#ffffffff' }]}>Redeem</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f7',
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f7',
    padding: 4,
    borderRadius: 10,
    borderWidth: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#1d1d1f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabActiveDark: {
    backgroundColor: '#515151ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabTextInactive: {
    color: '#86868b',
  },
  tabTextInactiveDark: {
    color: '#c9c7c7ff',
  },
  productList: {
    padding: 16,
    paddingTop: 12,
    gap: 12,
  },
  productCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  productIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productIcon: {
    fontSize: 32,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  redeemButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1d1d1f',
  },
  redeemText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  }
});

export default ShopScreen;
