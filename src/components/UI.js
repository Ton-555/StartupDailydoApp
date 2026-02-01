import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TextInput } from 'react-native';

export const MinimalButton = ({ children, onPress, variant = 'primary', icon: Icon, fullWidth = false }) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.btn, 
        isPrimary ? styles.btnPrimary : styles.btnOutline,
        fullWidth && { width: '100%' }
      ]}
    >
      {Icon && <Icon size={18} color={isPrimary ? "#FFF" : "#18181b"} />}
      <Text style={[styles.btnText, { color: isPrimary ? "#FFF" : "#18181b" }]}>{children}</Text>
    </TouchableOpacity>
  );
};

export const Header = ({ title, onBack, rightAction }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    {rightAction}
  </View>
);

const styles = StyleSheet.create({
  btn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 10 },
  btnPrimary: { backgroundColor: '#18181b' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e4e4e7' },
  btnText: { fontWeight: '600', fontSize: 15 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#18181b' }
});