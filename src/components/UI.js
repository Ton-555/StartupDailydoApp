import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export const MinimalButton = ({ children, onClick, variant = 'primary', icon: Icon, fullWidth, disabled }) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity 
      onPress={onClick} 
      disabled={disabled}
      style={[
        styles.btnBase, 
        isPrimary ? styles.btnPrimary : styles.btnOutline,
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 }
      ]}
    >
      {Icon && <Icon size={18} color={isPrimary ? "white" : "#18181b"} />}
      <Text style={[styles.btnText, { color: isPrimary ? "white" : "#18181b" }]}>{children}</Text>
    </TouchableOpacity>
  );
};

export const MinimalInput = ({ label, placeholder, value, onChangeText, secureTextEntry }) => (
  <View style={styles.inputContainer}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#a1a1aa"
    />
  </View>
);

const styles = StyleSheet.create({
  btnBase: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8 },
  btnPrimary: { backgroundColor: '#18181b' },
  btnOutline: { backgroundColor: 'transparent', borderWith: 1, borderColor: '#e4e4e7' },
  btnText: { fontWeight: '600', fontSize: 14 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 10, fontWeight: '700', color: '#71717a', marginBottom: 8 },
  input: { backgroundColor: '#f4f4f5', padding: 16, borderRadius: 12, fontSize: 14, color: '#18181b' }
});