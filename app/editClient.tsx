import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemedView} from "@/components/ThemedView";

const EditClient = () => {
    const { id } = useLocalSearchParams(); // Obtém o ID do cliente
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const router = useRouter();

    // Busca as informações do cliente ao carregar a página
    useEffect(() => {
        const fetchClient = async () => {
            try {
                const token = await AsyncStorage.getItem('@user_token'); // Recupera o token
                if (!token) {
                    Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
                    router.replace('/login');
                    return;
                }

                const response = await fetch(`http://super-santo.com.br:5000/library/clients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
                    },
                });
                const data = await response.json();
                setName(data.clientNome);
                setCpf(data.clientCpf);
            } catch (error) {
                console.error('Erro ao buscar cliente:', error);
                Alert.alert('Erro', 'Não foi possível carregar os dados do cliente.');
            }
        };

        if (id) fetchClient();
    }, [id]);

    // Atualiza as informações do cliente
    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('@user_token'); // Recupera o token
            if (!token) {
                Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
                router.replace('/login');
                return;
            }

            const response = await fetch(`http://super-santo.com.br:5000/library/clients/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
                },
                body: JSON.stringify({ clientNome: name, clientCpf: cpf }),
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Cliente atualizado com sucesso.');
                router.push('/clientes');
            } else {
                Alert.alert('Erro', 'Não foi possível atualizar o cliente.');
            }
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar as informações do cliente.');
        }
    };

    return (
        <ThemedView style={styles.container}>

            <ThemedView style={styles.formContainer}>
                <TextInput
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="CPF"
                    value={cpf}
                    onChangeText={setCpf}
                    style={styles.input}
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title="Salvar"
                        onPress={handleSave}
                    />
                </View>
            </ThemedView>
        </ThemedView>

    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: {
        padding: 20,
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
        alignItems: 'center',
        marginTop: 20,
    }
});

export default EditClient;
