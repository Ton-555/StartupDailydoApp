import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { User, Image as ImageIcon, Gift, Package, ChevronRight } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const HomeScreen = ({ user, navigate, onRefreshUser }) => {
  const { isDarkMode, colors, theme } = useTheme();
  const { width } = Dimensions.get('window');
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const BANNERS = [
    { id: '1', uri: 'https://www.bennett.co.th/album/banner/large/c2c5b8844a031b488a766bf73ebb168b.jpg', title: 'Your Daily Refresh', subtitle: 'Elevate your morning routine' },
    { id: '2', uri: 'https://s3.konvy.com/static/team/2025/0519/17476427822408.jpg', title: 'Special Deal', subtitle: 'Toothpaste -30% Off' },
    { id: '3', uri: 'https://www.organicpavilion.com/cdn/shop/files/OLY.Honey_1024x1024.jpg?v=1727349697', title: 'Healthy Choice', subtitle: 'Organic Honey Buy 2 Get 1' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= BANNERS.length) {
        nextIndex = 0;
      }
      // ตรวจสอบว่า flatListRef.current ยังมีอยู่ก่อนเรียกใช้
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setActiveIndex(nextIndex);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  useEffect(() => {
    if (onRefreshUser) {
      onRefreshUser();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Home"
        rightAction={
          <View style={[styles.profileIcon, { backgroundColor: isDarkMode ? '#3f3f46' : '#e4e4e7' }]}>
            <User size={16} color={colors.text} />
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Banner Carousel */}
        <View>
          <FlatList
            ref={flatListRef}
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
              setActiveIndex(index);
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigate('shop')} activeOpacity={0.9} style={[styles.bannerContainer, { width: width - 32 }]}>
                <Image source={{ uri: item.uri }} style={styles.banner} />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerText}>{item.title}</Text>
                  <Text style={styles.bannerSubText}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {BANNERS.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, { backgroundColor: index === activeIndex ? colors.text : colors.border }]}
              />
            ))}
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Your Balance</Text>
              <Text style={styles.balanceAmount}>{user?.coins?.toLocaleString() || 0} <Text style={styles.balanceUnit}>Coins</Text></Text>
            </View>
            <View style={styles.giftIcon}>
              <Gift size={24} color="#facc15" />
            </View>
          </View>
        </View>

        {/* Package Link */}
        <TouchableOpacity onPress={() => navigate('package')} style={[styles.packageLink, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.packageContent}>
            <View style={[styles.packageIcon, { backgroundColor: isDarkMode ? '#4c1d95' : '#faf5ff' }]}>
              <Package size={24} color={isDarkMode ? '#ddd6fe' : '#9333ea'} />
            </View>
            <View>
              <Text style={[styles.packageTitle, { color: colors.text }]}>Membership Packages</Text>
              <Text style={[styles.packageSubtitle, { color: colors.subText }]}>Upgrade for more benefits</Text>
            </View>
          </View>
          <ChevronRight size={24} color={colors.subText} />
        </TouchableOpacity>

        {/* Promotions */}
        <View>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Promotions</Text>
            {/* <Text style={[styles.seeAll, { color: colors.subText }]}>View All</Text> */}
          </View>
          <View style={styles.promoGrid}>
            {/* Promo 1 */}
            <TouchableOpacity onPress={() => navigate('shop')} activeOpacity={0.9} style={[styles.promoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>-30%</Text>
              </View>
              <Image
                source={{ uri: 'https://s3.konvy.com/static/team/2025/0519/17476427822408.jpg' }}
                style={[styles.promoImage, { backgroundColor: isDarkMode ? '#3f3f46' : '#f4f4f5' }]}
              />
              <Text style={[styles.promoTitle, { color: colors.text }]}>Toothpaste</Text>
              <Text style={[styles.promoSubtitle, { color: colors.subText }]}>Special Price: 1,100 Coins</Text>
            </TouchableOpacity>

            {/* Promo 2 */}
            <TouchableOpacity onPress={() => navigate('shop')} activeOpacity={0.9} style={[styles.promoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Sale</Text>
              </View>
              <Image
                source={{ uri: 'https://www.organicpavilion.com/cdn/shop/files/OLY.Honey_1024x1024.jpg?v=1727349697' }}
                style={[styles.promoImage, { backgroundColor: isDarkMode ? '#3f3f46' : '#f4f4f5' }]}
              />
              <Text style={[styles.promoTitle, { color: colors.text }]}>Butter Cereal</Text>
              <Text style={[styles.promoSubtitle, { color: colors.subText }]}>Buy 2 Get 1 Free</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa', // zinc-50
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  profileIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#e4e4e7', // zinc-200
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: '#e4e4e7',
    fontSize: 14,
  },
  balanceCard: {
    backgroundColor: '#18181b', // zinc-900
    padding: 24,
    borderRadius: 16,
    shadowColor: '#e4e4e7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#a1a1aa', // zinc-400
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  balanceUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#71717a',
  },
  giftIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#27272a', // zinc-800
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageLink: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  packageIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#faf5ff', // purple-50
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18181b',
  },
  packageSubtitle: {
    fontSize: 12,
    color: '#71717a',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18181b',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '500',
    color: '#71717a',
  },
  promoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  promoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f4f4f5',
  },
  promoImage: {
    height: 120, // Increased height for better visibility
    width: '100%',
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
    backgroundColor: '#f4f4f5',
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181b',
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ef4444', // red-500
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  }
});

export default HomeScreen;