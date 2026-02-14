import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Package } from 'lucide-react-native';
import MinimalInput from './components/MinimalInput';
import MinimalButton from './components/MinimalButton';
import { useTheme } from './context/ThemeContext';
import globalState from '../utils/globalState';
import authAPI from './services/authAPI';


const RegisterScreen = ({ onRegister, onNavigateLogin }) => {
    const { isDarkMode, colors } = useTheme();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        // ตรวจสอบว่า password ตรงกันหรือไม่
        if (password !== confirmPassword) {
            Alert.alert('Password Error', 'Passwords do not match!');
            return;
        }

        // ตรวจสอบความยาวรหัสผ่าน (อย่างน้อย 8 ตัวอักษร)
        if (password.length < 8) {
            Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
            return;
        }

        // ตรวจสอบความซับซ้อน (ต้องมีตัวอักษรและตัวเลข)
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasLetter || !hasNumber) {
            Alert.alert('Weak Password', 'Password must contain both letters and numbers.');
            return;
        }

        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!username || !email || !password || !firstName || !lastName) {
            Alert.alert('Error', 'Please fill in all required fields!');
            return;
        }

        // ตรวจสอบ Username (ความยาวและตัวอักษรที่อนุญาต)
        const cleanUsername = username.trim();
        if (cleanUsername.length < 4) {
            Alert.alert('Invalid Username', 'Username must be at least 4 characters long.');
            return;
        }

        // อนุญาตเฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และ underscore
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(cleanUsername)) {
            Alert.alert('Invalid Username', 'Username can only contain letters, numbers, and underscores.');
            return;
        }

        setIsLoading(true);

        try {
            // เรียก API สำหรับ register
            const response = await authAPI.register({
                username: cleanUsername,
                password: password,
                first_name: firstName,
                last_name: lastName,
                user_id: cleanUsername // ส่ง user_id เป็น username เหมือนกัน
            });

            console.log('Registration successful:', response);

            // บันทึกข้อมูลลงใน globalState
            globalState.setCredentials(cleanUsername, password);
            globalState.setUserEmail(email);
            console.log('Saved to globalState:', globalState.getAllData());

            // แสดงข้อความสำเร็จ
            Alert.alert('Success', 'Account created successfully!', [
                {
                    text: 'OK',
                    onPress: () => onRegister(response.data)
                }
            ]);

        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.innerContainer}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#f4f4f5' : '#18181b', shadowColor: colors.border }]}>
                        <Package color={isDarkMode ? '#18181b' : 'white'} size={24} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Create Account.</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>Sign up to get started with your account.</Text>
                </View>

                <View style={styles.form}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <MinimalInput
                                label="FIRST NAME"
                                placeholder="John"
                                value={firstName}
                                onChange={setFirstName}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <MinimalInput
                                label="LAST NAME"
                                placeholder="Doe"
                                value={lastName}
                                onChange={setLastName}
                            />
                        </View>
                    </View>

                    <MinimalInput
                        label="USERNAME"
                        placeholder="Enter your username"
                        value={username}
                        onChange={setUsername}
                    />

                    <MinimalInput
                        label="EMAIL"
                        placeholder="Enter your email"
                        value={email}
                        onChange={setEmail}
                    />

                    <MinimalInput
                        label="PHONE (Optional)"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={setPhone}
                    />

                    <MinimalInput
                        label="PASSWORD"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={setPassword}
                    />

                    <MinimalInput
                        label="CONFIRM PASSWORD"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />

                    <View style={styles.buttonContainer}>
                        <MinimalButton onClick={handleRegister} fullWidth variant="primary" disabled={isLoading}>
                            {isLoading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <ActivityIndicator color="white" size="small" />
                                    <Text style={{ color: 'white', fontWeight: '600' }}>Creating Account...</Text>
                                </View>
                            ) : (
                                'Create Account'
                            )}
                        </MinimalButton>
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.subText }]}>Already have an account?</Text>
                        <TouchableOpacity onPress={onNavigateLogin}>
                            <Text style={[styles.linkText, { color: colors.text }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    innerContainer: {
        padding: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 40,
    },
    iconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#18181b', // zinc-900
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#e4e4e7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 4,
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
    }
});

export default RegisterScreen;