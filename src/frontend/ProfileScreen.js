import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { User, LogOut, Calendar } from 'lucide-react-native';
import { MinimalButton } from '../components/UI';

const ProfileScreen = ({ user, onLogout }) => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 24, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f4f4f5', alignItems: 'center', justifyContent: 'center' }}>
          <User size={40} color="#a1a1aa" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 12 }}>{user?.fullName}</Text>
        <Text style={{ color: '#71717a' }}>Bangkok, Thailand</Text>
      </View>

      <View style={{ padding: 24 }}>
        <View style={{ backgroundColor: '#fffbeb', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#fef3c7', marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', color: '#92400e' }}>Active Package: Gold Plan</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 }}>
            <Calendar size={14} color="#b45309" />
            <Text style={{ fontSize: 12, color: '#b45309' }}>Expires: Dec 31, 2026</Text>
          </View>
        </View>

        <MinimalButton variant="outline" onClick={() => {}} icon={LogOut}>Logout</MinimalButton>
      </View>
    </ScrollView>
  );
};