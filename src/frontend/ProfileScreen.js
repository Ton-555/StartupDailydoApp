import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LogOut, User, Plus, MapPin, Settings, Info, ChevronRight } from 'lucide-react-native';
import Header from './components/Header';
import MinimalButton from './components/MinimalButton';

const ProfileScreen = ({ user, onLogout, navigate }) => {
  return (
    <View style={styles.container}>
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
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#d4d4d8" />
            <View style={styles.avatarRing} />
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.topUpButton}>
            <MinimalButton fullWidth variant="primary" icon={Plus} onClick={() => navigate('topup')}>Top Up Coins</MinimalButton>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuButton icon={MapPin} label="My Address" />
          <MenuButton icon={Settings} label="Settings" />
          <MenuButton icon={Info} label="About App" />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <LogOut size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const MenuButton = ({ icon: Icon, label, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <View style={styles.menuLeft}>
      <View style={styles.menuIconBox}>
        <Icon size={20} color="#52525b" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <ChevronRight size={18} color="#d4d4d8" />
  </TouchableOpacity>
);

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
    marginTop: 24,
    width: '100%',
    maxWidth: 320,
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
