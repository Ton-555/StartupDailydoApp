import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Gift, ArrowRight } from 'lucide-react-native';
import { MinimalButton } from '../components/UI';

const OnboardingScreen = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 200, height: 200, backgroundColor: '#f4f4f5', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
        <Gift size={80} color="#d4d4d8" />
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>{step === 1 ? "สะสมคอยน์" : "แลกรับสินค้า"}</Text>
      <Text style={{ textAlign: 'center', color: '#71717a', marginBottom: 40 }}>
        {step === 1 ? "รับคอยน์ง่ายๆ จากการสมัครแพ็คเกจรายเดือน" : "ใช้คอยน์แลกซื้อสินค้าอุปโภคบริโภคส่งตรงถึงบ้าน"}
      </Text>
      
      <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
        {step > 1 && <MinimalButton onClick={() => setStep(1)} variant="outline" className="flex-1">Back</MinimalButton>}
        <MinimalButton 
          onClick={() => step === 1 ? setStep(2) : onComplete()} 
          fullWidth={step === 1}
        >
          {step === 1 ? "Next" : "Get Started"}
        </MinimalButton>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;    