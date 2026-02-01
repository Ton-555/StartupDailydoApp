import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Gift, ShoppingBag, ArrowRight } from 'lucide-react-native';
import MinimalButton from './components/MinimalButton';

const OnboardingScreen = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  // Simplified, no complex animation logic for now to keep it stable
  const StepOne = () => (
    <View style={styles.stepContainer}>
      <View style={styles.imageContainer}><Gift size={80} color="#d4d4d8" /></View>
      <Text style={styles.title}>Welcome to Rewards</Text>
      <Text style={styles.description}>Collect coins and redeem exclusive rewards just for you. Start your journey today.</Text>
      <View style={{ width: 160 }}>
        <MinimalButton onClick={() => setStep(2)} variant="primary">Next <ArrowRight size={18} color="white" /></MinimalButton>
      </View>
    </View>
  );

  const StepTwo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.imageContainer}><ShoppingBag size={80} color="#d4d4d8" /></View>
      <Text style={styles.title}>Shop & Enjoy</Text>
      <Text style={styles.description}>Browse through our curated collection of consumables and goods.</Text>
      <View style={styles.buttonGroup}>
        <View style={{ flex: 1 }}>
          <MinimalButton onClick={() => setStep(1)} variant="outline">Back</MinimalButton>
        </View>
        <View style={{ flex: 1 }}>
          <MinimalButton onClick={onComplete} variant="primary">Start Now</MinimalButton>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {step === 1 ? <StepOne /> : <StepTwo />}
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, step === 1 ? styles.indicatorActive : styles.indicatorInactive]} />
        <View style={[styles.indicator, step === 2 ? styles.indicatorActive : styles.indicatorInactive]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 24,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    width: 256,
    height: 256,
    backgroundColor: '#f4f4f5', // zinc-100
    borderRadius: 24,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#18181b', // zinc-900
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#71717a', // zinc-500
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 280,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    maxWidth: 320,
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 32,
    justifyContent: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#18181b',
  },
  indicatorInactive: {
    width: 8,
    backgroundColor: '#e4e4e7',
  }
});

export default OnboardingScreen;