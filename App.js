import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(null);

  // ฟังก์ชันนำทาง (Simple Navigation)
  const navigate = (screenName) => setCurrentScreen(screenName);

  const handleLogin = (email) => {
    setUser({ fullName: 'Alex Doe', coins: 2500, idMember: 'MB-8829' });
    navigate('onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
        {currentScreen === 'onboarding' && <OnboardingScreen onComplete={() => navigate('home')} />}
        {currentScreen === 'home' && <HomeScreen user={user} navigate={navigate} />}
        {currentScreen === 'profile' && <ProfileScreen user={user} onLogout={() => navigate('login')} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});