import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { Package } from 'lucide-react-native';
import MinimalInput from './components/MinimalInput';
import MinimalButton from './components/MinimalButton';
import { useTheme } from './context/ThemeContext';
import globalState from '../utils/globalState';
import authAPI from './services/authAPI';

const image = require('../../assets/logo.png');

const LoginScreen = ({ onLogin, onNavigateRegister }) => {
  const { isDarkMode, colors } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(username, password);
      console.log('Login successful:', response);

      // บันทึกลง globalState
      globalState.setCredentials(username, password);
      if (response.data) {
        globalState.setUserId(response.data.users_id);
        globalState.setUserEmail(response.data.email || '');
      }

      onLogin(response.data);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        {/* <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#f4f4f5' : '#eeeeeeff', shadowColor: colors.border }]}> */}
        <View style={styles.viewcenter}>
          <Image source={image} style={styles.stepImage} />
        </View>
        {/* </View> */}
        <Text style={[styles.title, { color: colors.text }]}>Welcome.</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Sign in to continue to your account.</Text>
      </View>
      <View style={styles.form}>
        <MinimalInput label="USERNAME" placeholder="Enter your username" value={username} onChange={setUsername} />
        <MinimalInput label="PASSWORD" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
        <View style={styles.buttonContainer}>
          <MinimalButton onClick={handleLogin} fullWidth variant="primary" disabled={isLoading}>
            {isLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color="white" size="small" />
                <Text style={{ color: 'white', fontWeight: '600' }}>Signing In...</Text>
              </View>
            ) : (
              'Sign In'
            )}
          </MinimalButton>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subText }]}>Don't have an account?</Text>
          <TouchableOpacity onPress={onNavigateRegister}>
            <Text style={[styles.linkText, { color: colors.text }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  iconContainer: {
  width: 80,
  height: 80,
  backgroundColor: '#18181b',
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 24,

  borderColor: '#3f3f46',
  borderWidth: 1,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,

  elevation: 6,
},

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a', // zinc-500
  },
  form: {
    gap: 16,
  },
  buttonContainer: {
    paddingTop: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  footerText: {
    color: '#a1a1aa', // zinc-400
    fontSize: 14,
  },
  linkText: {
    color: '#18181b',
    fontWeight: '600',
    fontSize: 14,
  },
  stepImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  viewcenter: {
    marginTop: -20,
   alignItems: 'center',
    // justifyContent: 'center', 
  }
});

export default LoginScreen;