import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LogOut, User, Plus, MapPin, CreditCard, Settings, ChevronRight, Crown } from 'lucide-react-native';
import Header from './components/Header';
import MinimalButton from './components/MinimalButton';
import { useTheme } from './context/ThemeContext';

const ProfileScreen = ({ user, onLogout, navigate }) => {
  const { isDarkMode, colors } = useTheme();

  const getPackageName = (packageId) => {
    switch(packageId) {
      case 1: return 'Standard';
      case 2: return 'Premium';
      case 3: return 'Platinum';
      default: return 'Free';
    }
  };

  const isPackageActive = user.package_end && new Date(user.package_end) > new Date();
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="My Profile"
        rightAction={
          <TouchableOpacity onPress={onLogout}>
            <LogOut size={20} color="#f87171" style={{ marginRight: 8 }} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={[styles.avatarContainer, { backgroundColor: isDarkMode ? colors.background : '#f4f4f5', borderColor: isDarkMode ? '#3f3f46' : '#fafafa' }]}>
            <User size={40} color={isDarkMode ? '#71717a' : '#d4d4d8'} />
            <View style={styles.avatarRing} />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user.fullName}</Text>
          <Text style={[styles.email, { color: colors.subText }]}>{user.email}</Text>

          {/* Subscription Badge */}
          {isPackageActive && (
            <View style={[styles.subBadge, { backgroundColor: isDarkMode ? '#451a03' : '#fffbeb', borderColor: isDarkMode ? '#78350f' : '#fef3c7' }]}>
              <Crown size={14} color="#f59e0b" style={{ marginRight: 6 }} />
              <Text style={[styles.subTextBadge, { color: isDarkMode ? '#fde68a' : '#b45309' }]}>
                {getPackageName(user.package_id)} Plan
              </Text>
            </View>
          )}

          {/* Package Details */}
          <View style={[styles.packageDetailsCard, { backgroundColor: isDarkMode ? colors.background : '#f9fafb', borderColor: colors.border }]}>
            <View style={styles.packageRow}>
              <Text style={[styles.packageLabel, { color: colors.subText }]}>Current Plan</Text>
              <Text style={[styles.packageValue, { color: colors.text }]}>
                {isPackageActive ? getPackageName(user.package_id) : 'No Active Plan'}
              </Text>
            </View>
            {user.package_end && (
              <View style={styles.packageRow}>
                <Text style={[styles.packageLabel, { color: colors.subText }]}>
                  {isPackageActive ? 'Expires on' : 'Expired on'}
                </Text>
                <Text style={[styles.packageValue, { color: isPackageActive ? '#10b981' : '#ef4444', fontWeight: '600' }]}>
                  {formatDate(user.package_end)}
                </Text>
              </View>
            )}
            {isPackageActive && (
              <View style={styles.packageStatusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                <Text style={[styles.statusText, { color: '#10b981' }]}>Active</Text>
              </View>
            )}
          </View>

          <View style={styles.topUpButton}>
            <MinimalButton fullWidth variant="primary" icon={Plus} onClick={() => navigate('topup')}>Top Up Coins</MinimalButton>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <MenuButton icon={MapPin} label="My Address" onPress={() => navigate('address')} />
          <MenuButton icon={CreditCard} label="Credit Card" onPress={() => navigate('creditcard')} />
          <MenuButton icon={Settings} label="Settings" onPress={() => navigate('settings')} />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={onLogout}
            style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2', borderColor: isDarkMode ? '#7f1d1d' : '#fee2e2' }]}
          >
            <LogOut size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const MenuButton = ({ icon: Icon, label, onPress }) => {
  const { isDarkMode, colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.menuLeft}>
        <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? colors.background : '#fafafa' }]}>
          <Icon size={20} color={isDarkMode ? colors.subText : "#52525b"} />
        </View>
        <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <ChevronRight size={18} color={colors.subText} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  avatarContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#f4f4f5',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#fafafa',
    // shadow simulation via ring view if needed, but border is fine
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18181b',
  },
  email: {
    fontSize: 14,
    color: '#71717a',
    marginTop: 4,
  },
  topUpButton: {
    marginTop: 16,
    width: '100%',
    maxWidth: 320,
  },
  packageDetailsCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    width: '100%',
  },
  packageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageLabel: {
    fontSize: 13,
    color: '#71717a',
    fontWeight: '500',
  },
  packageValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181b',
  },
  packageStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  subBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  subTextBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b45309',
  },
  menuContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconBox: {
    padding: 8,
    backgroundColor: '#fafafa',
    borderRadius: 8,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3f3f46',
  },
  logoutContainer: {
    padding: 16,
    marginTop: 16,
  },
  logoutButton: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fef2f2', // red-50
    borderWidth: 1,
    borderColor: '#fee2e2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '500',
    fontSize: 16,
  }
});

export default ProfileScreen;
