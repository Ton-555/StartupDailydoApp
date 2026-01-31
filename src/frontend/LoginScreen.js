import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Package } from 'lucide-react-native';
import { MinimalButton, MinimalInput } from '../components/UI';
// import { auth } from '../firebaseConfig'; // นำเข้า firebase ของคุณ

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Firebase Logic: signInWithEmailAndPassword(auth, email, password)
    onLogin(email); 
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24, justifyContent: 'center' }}>
      <View style={{ marginBottom: 40 }}>
        <Package size={48} color="#18181b" />
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: 16 }}>Welcome.</Text>
        <Text style={{ color: '#71717a' }}>Sign in to start your Daily Do.</Text>
      </View>
      <MinimalInput label="EMAIL" value={email} onChangeText={setEmail} placeholder="email@example.com" />
      <MinimalInput label="PASSWORD" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
      <MinimalButton onClick={handleLogin} fullWidth>Sign In</MinimalButton>
    </SafeAreaView>
  );
};

export default LoginScreen;