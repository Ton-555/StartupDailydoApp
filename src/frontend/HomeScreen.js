import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Image as ImageIcon, Gift, Package, ChevronRight } from 'lucide-react-native';
import Header from './components/Header';

const HomeScreen = ({ user, navigate }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Home"
        rightAction={
          <View style={styles.profileIcon}>
            <User size={16} color="#000" />
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Banner */}
        <View style={styles.banner}>
          <ImageIcon size={40} color="#a1a1aa" style={{ marginBottom: 8 }} />
          <Text style={styles.bannerText}>Advertising Banner</Text>
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
        <TouchableOpacity onPress={() => navigate('package')} style={styles.packageLink}>
          <View style={styles.packageContent}>
            <View style={styles.packageIcon}>
              <Package size={24} color="#9333ea" />
            </View>
            <View>
              <Text style={styles.packageTitle}>Membership Packages</Text>
              <Text style={styles.packageSubtitle}>Upgrade for more benefits</Text>
            </View>
          </View>
          <ChevronRight size={24} color="#d4d4d8" />
        </TouchableOpacity>

        {/* Promotions */}
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promotions</Text>
            <Text style={styles.seeAll}>View All</Text>
          </View>
          <View style={styles.promoGrid}>
            {[1, 2].map((i) => (
              <View key={i} style={styles.promoCard}>
                <View style={styles.promoImage}>
                  <Gift size={24} color="#d4d4d8" />
                </View>
                <Text style={styles.promoTitle}>Special Deal #{i}</Text>
                <Text style={styles.promoSubtitle}>Limited time offer</Text>
              </View>
            ))}
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
  banner: {
    width: '100%',
    height: 160,
    backgroundColor: '#e4e4e7', // zinc-200
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '500',
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
    height: 96,
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  }
});

export default HomeScreen;