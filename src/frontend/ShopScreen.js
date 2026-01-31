import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { MinimalButton } from '../components/UI';

const ShopScreen = ({ navigate }) => {
  const [cart, setCart] = useState([]);
  const products = [
    { id: 1, name: "น้ำดื่ม 600ml", price: 10, icon: "💧" },
    { id: 2, name: "บะหมี่กึ่งสำเร็จรูป", price: 15, icon: "🍜" },
  ];

  const total = cart.reduce((s, i) => s + i.price, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa', padding: 20 }}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 24 }}>{item.icon}</Text>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: '#f59e0b' }}>{item.price} Coins</Text>
            </View>
            <TouchableOpacity onPress={() => setCart([...cart, item])} style={{ backgroundColor: '#18181b', padding: 10, borderRadius: 12 }}>
              <ShoppingBag size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
      {cart.length > 0 && (
        <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 24, borderWith: 1, borderColor: '#e4e4e7' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>Total: {total} Coins</Text>
          <MinimalButton onClick={() => { alert('Redeemed!'); setCart([]); navigate('history'); }}>Redeem with Coins</MinimalButton>
        </View>
      )}
    </View>
  );
};