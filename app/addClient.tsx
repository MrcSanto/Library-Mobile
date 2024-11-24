import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddClient = () => {
    const [cpf, setCpf] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAddClient = async () => {
        if (!cpf || !name) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('@user_token');
            if (!token) {
                Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
                router.replace('/login');
                return;
            }

            const response = await fetch('http://100.100.100.251:5000/library/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    clientCpf: cpf,
                    clientNome: name,
                }),
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Cliente criado com sucesso.');
                router.push('/clientes');
            } else {
                const data = await response.json();
                Alert.alert('Erro', data.message || 'Não foi possível criar o cliente.');
            }
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao criar o cliente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? 'Carregando...' : 'Cadastrar'}
                    onPress={handleAddClient}
                    disabled={loading}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
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
        marginTop: 20,
        width: '100%',
    },
});

export default AddClient;
