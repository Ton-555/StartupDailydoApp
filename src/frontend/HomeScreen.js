import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Crown, Gift } from 'lucide-react-native';

const HomeScreen = ({ user, navigate }) => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={{ padding: 24 }}>
        <View style={{ backgroundColor: '#18181b', padding: 24, borderRadius: 24, marginBottom: 24 }}>
          <Text style={{ color: '#a1a1aa', fontSize: 12, fontWeight: '700' }}>YOUR BALANCE</Text>
          <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold', marginTop: 4 }}>
            {user?.coins} <Text style={{ fontSize: 18, color: '#71717a' }}>Coins</Text>
          </Text>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Recommended Packages</Text>
        <TouchableOpacity 
          onPress={() => navigate('package')}
          style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e4e4e7', flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Starter Plan</Text>
            <Text style={{ color: '#71717a', fontSize: 12 }}>฿99 / Month</Text>
          </View>
          <Crown color="#fbbf24" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;