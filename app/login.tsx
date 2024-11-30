import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Image, KeyboardAvoidingView, ScrollView, Platform, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth(); // Obtém a função de login do contexto

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://super-santo.com.br:5000/library/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.auth) {
                login(data.token);
                Alert.alert('Sucesso', 'Login realizado com sucesso!');
                router.push('/');
            } else {
                Alert.alert('Erro', data.message || 'Não foi possível realizar o login.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao tentar realizar o login.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/favicon.png')}
                        style={styles.logo}
                    />
                    <ThemedText type="title" style={styles.title}>
                        LOGIN
                    </ThemedText>
                </ThemedView>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.buttonContainer}>
                    <Button title={loading ? 'Carregando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
                </View>

                <TouchableOpacity onPress={() => router.push('/')}>
                    <Text style={styles.backToHomeText}>Voltar para a página principal</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    title: {
        marginTop: 16,
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 16,
        width: '100%',
    },
    backToHomeText: {
        marginTop: 32,
        fontSize: 16,
        color: '#007BFF',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
