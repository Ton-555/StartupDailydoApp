import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { Gift, ShoppingBag, Truck, ArrowRight, Check } from 'lucide-react-native';
import MinimalButton from './components/MinimalButton';
import { useTheme } from './context/ThemeContext';

const OnboardingScreen = ({ onComplete }) => {
  const { isDarkMode, colors } = useTheme();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const stepsData = [
    {
      id: 1,
      image: require('../../assets/logo.png'),
      title: "Welcome",
      description: "ยินดีตอนรับสู้บริการของเรา Dailydo"
    },
    {
      id: 2,
      image: require('../../assets/Main.gif'),
      title: "เริ่มต้นการใช้งาน",
      description: "สมัคร Package เพื่อเริ่มใช้บริการของเรา"
    },
    {
      id: 3,
      image: require('../../assets/Plan.png'),
      title: "เลือก Package ที่คุณต้องการ",
      description: "ในแต่ละ Package จะได้รับสิทธิประโยชน์ที่ต่างกัน"
    },
    {
      id: 4,
      image: require('../../assets/Plan-done.png'),
      title: "นี่คือ Coin ของคุณ",
      description: "เมื่อคุณได้สมัคร Package แล้วจะได้รับ 'Coin' ที่จะนำมาใช้งาน "
    },
    {
      id: 5,
      image: require('../../assets/Market.png'),
      title: "เลือกสินค้าที่ต้องการจัดส่ง",
      description: "คุณจะใช้ Coin ในการซื้อสินค้าที่ต้องการจัดส่ง"
    },
    {
      id: 6,
      image: require('../../assets/Market-setting.png'),
      title: "กำหนดรายการสั่งซื้อสินค้า",
      description: "กำหนดรายการสั่งซื้อสินค้าที่คุณต้องการ"
    },
    {
      id: 7,
      icon: Truck,
      title: "สินค้าพร้อมส่งถึงคุณแล้ว!",
      description: "ขอบคุณที่ใช้บริการของเรา \b\n\n'Dailydo Service'"
    },
  ];

  const currentStepData = stepsData[step - 1];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.stepContainer}>
        <Animated.View style={{
          alignItems: 'center',
          width: '100%',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <View style={[styles.imageContainer, { backgroundColor: 'transparent' }]}>
            {currentStepData.image ? (
              <Image source={currentStepData.image} style={styles.stepImage} />
            ) : (
              <Icon size={80} color={colors.text} />
            )}
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{currentStepData.title}</Text>
          <Text style={[styles.description, { color: colors.subText }]}>{currentStepData.description}</Text>
        </Animated.View>
      </View>

      <View style={styles.indicatorContainer}>
        {stepsData.map((s) => (
          <View
            key={s.id}
            style={[
              styles.indicator,
              step === s.id ? [styles.indicatorActive, { backgroundColor: colors.text }] : [styles.indicatorInactive, { backgroundColor: colors.border }]
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonWrapper}>
          <MinimalButton onClick={handleNext} variant="primary" fullWidth>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                {step < totalSteps ? 'Next' : 'Get Started'}
              </Text>
              {step < totalSteps ? <ArrowRight size={18} color="white" /> : <Check size={18} color="white" />}
            </View>
          </MinimalButton>
        </View>
        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
            <Text style={[styles.backText, { color: colors.subText }]}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 32,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    maxWidth: 320,
    maxHeight: 320,
    backgroundColor: 'transparent',
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
    marginBottom: 24,
    maxWidth: 280,
    lineHeight: 24,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  buttonWrapper: {
    width: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
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
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
  },
  stepImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});

export default OnboardingScreen;