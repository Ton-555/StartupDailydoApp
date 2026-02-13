import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Gift } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const ShopScreen = ({ onSelectProduct }) => {
  const { isDarkMode, colors } = useTheme();
  const [category, setCategory] = useState('consumer'); // 'consumer' | 'consumable'
  // Mock description
  const desc = "This premium item is carefully selected for your daily needs. High quality, durable, and worth every coin.";
  const products = {
    consumer: [
      { id: 1, name: 'Toothbrush', price: 550, icon: '🪥', image: 'https://s3.konvy.com/static/team/2025/0519/17476427822408.jpg', description: desc, category: 'consumer' },
      { id: 2, name: 'Toothpaste', price: 850, icon: '🦷', image: 'https://images.ctfassets.net/xwl2qgknr5qo/5KQmCjOI552N269Jy70uJW/64f2619cfc84c44acba29e1cd3ce118c/TH-Paste-Mobile.png?fm=webp', description: desc, category: 'consumer' },
      { id: 3, name: 'Razor', price: 1200, icon: '🪒', image: 'https://www.top10.in.th/wp-content/uploads/2022/06/%E0%B8%A1%E0%B8%B5%E0%B8%94%E0%B9%82%E0%B8%81%E0%B8%99%E0%B8%AB%E0%B8%99%E0%B8%A7%E0%B8%94-%E0%B8%A2%E0%B8%B5%E0%B9%88%E0%B8%AB%E0%B9%89%E0%B8%AD%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%94%E0%B8%B5.jpg', description: desc, category: 'consumer' },
      { id: 4, name: 'Shampoo', price: 1590, icon: '🧴', image: 'https://image.makewebcdn.com/makeweb/m_1920x0/Pwzg6v3Xa/DefaultData/LINE_ALBUM_G_T_Nutri_Booster_Cont__%E0%B9%92%E0%B9%92%E0%B9%91%E0%B9%92%E0%B9%90%E0%B9%95_2.jpg', description: desc, category: 'consumer' },
      { id: 5, name: 'Tissue', price: 450, icon: '🧻', image: 'https://img.lazcdn.com/g/p/13fbf0067734fcb1be87211f98174643.jpg_720x720q80.jpg', description: desc, category: 'consumer' },
      { id: 6, name: 'Soap', price: 350, icon: '🧼', image: 'https://www.bennett.co.th/album/product/large/a32d74549ab437c45ed1471990ab110d.png', description: desc, category: 'consumer' },
      { id: 7, name: 'Laundry detergent', price: 1290, icon: '🧺', image: 'https://s359.kapook.com/pagebuilder/2a174c98-529f-4d91-8eff-19a9623577f8.jpg', description: desc, category: 'consumer' },
      { id: 8, name: 'Dishwashing liquid', price: 490, icon: '🍽️', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNqZSIji71dSyJlNc-l3YTs1SLNBNvNe--2w&s', description: desc, category: 'consumer' }
    ],
    consumable: [
      { id: 9, name: 'Rice (5kg)', price: 2500, icon: '🍚', image: 'https://img.lazcdn.com/g/p/bdd32cb78ab49cb52491d968bddfe5ee.jpg_720x720q80.jpg', description: desc, category: 'consumable' },
      { id: 10, name: 'Instant noodles', price: 150, icon: '🍜', image: 'https://s359.kapook.com/pagebuilder/96bd290b-b1d7-43c8-8df4-a90a001f3efe.jpg', description: desc, category: 'consumable' },
      { id: 11, name: 'Canned food', price: 350, icon: '🥫', image: 'https://media.allonline.7eleven.co.th/_185_/plist/562449-00-Canned-Packaged-Ready-Meals-Sealect.jpg', description: desc, category: 'consumable' },
      { id: 12, name: 'Dried food', price: 650, icon: '🥜', image: 'https://media.allonline.7eleven.co.th/pdmain/393319_010_Supermarket.jpg', description: desc, category: 'consumable' },
      { id: 13, name: 'Cereal', price: 1800, icon: '🥣', image: 'https://www.organicpavilion.com/cdn/shop/files/OLY.Honey_1024x1024.jpg?v=1727349697', description: desc, category: 'consumable' },
      { id: 14, name: 'Cookie', price: 450, icon: '🍪', image: 'https://f.ptcdn.info/559/025/000/1415966960-61ZZj9szIQ-o.jpg', description: desc, category: 'consumable' },
      { id: 15, name: 'Wafer', price: 250, icon: '🧇', image: 'https://cdn.imweb.me/thumbnail/20240108/815b3234a0490.jpg', description: desc, category: 'consumable' },
      { id: 16, name: 'Chewing gum', price: 100, icon: '🍬', image: 'https://st.bigc-cs.com/cdn-cgi/image/format=webp,quality=90/public/media/catalog/product/13/88/8850338020513/8850338020513_1-20221130151321-.jpg', description: desc, category: 'consumable' },
      { id: 17, name: 'Coffee powder', price: 1200, icon: '☕', image: 'https://images.mango-prod.siammakro.cloud/product-images/6761201270979-e75d6e4f-25cd-4538-b13c-403c9f2fd753.jpeg?eo-img.resize=w%2F1080&eo-img.format=webp', description: desc, category: 'consumable' },
      { id: 18, name: 'Drinking water', price: 120, icon: '💧', image: 'https://bangpleestationery.com/wp-content/uploads/2023/04/%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%84%E0%B8%A3%E0%B8%B4%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%A5.jpg', description: desc, category: 'consumable' }
    ]
  };

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
      <ScrollView contentContainerStyle={styles.productList}>
        {products[category].map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelectProduct(item)}
            style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.productInfo}>
              <View style={[styles.productIconContainer, { backgroundColor: isDarkMode ? colors.background : '#fafafa', overflow: 'hidden' }]}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                ) : (
                  <Text style={styles.productIcon}>{item.icon}</Text>
                )}
              </View>
              <View>
                <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Gift size={14} color="#f59e0b" />
                  <Text style={styles.priceText}>{item.price.toLocaleString()} Coins</Text>
                </View>
              </View>
            </View>
            <View style={[styles.redeemButton, { backgroundColor: isDarkMode ? '#3f3f46' : '#18181b' }]}>
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
  tabActiveDark: {
    backgroundColor: '#3f3f46',
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
  tabTextInactiveDark: {
    color: '#a1a1aa',
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
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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