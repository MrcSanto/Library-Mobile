import React, { useState, useEffect } from 'react';
import {StyleSheet, FlatList, Alert, ActivityIndicator, Button} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { Client } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClientCard from '@/components/ClientCard'; // Certifique-se de que o caminho está correto

export default function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [isMounted, setIsMounted] = useState(false); // Verificar montagem

    useEffect(() => {
        setIsMounted(true); // Define que o layout está montado
    }, []);

    useEffect(() => {
        if (!isMounted) return; // Aguarde até que o layout esteja montado

        if (!isAuthenticated) {
            Alert.alert('Erro', 'Você precisa estar logado para acessar esta página.');
            router.replace('/login');
            return;
        }

        const fetchClients = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem('@user_token');

                if (!token) {
                    Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
                    router.replace('/login');
                    return;
                }

                const response = await fetch('http://100.100.100.251:5000/library/clients', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setClients(data.data);
                } else {
                    Alert.alert('Erro', data.message || 'Não foi possível carregar os clientes.');
                }
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
                Alert.alert('Erro', 'Ocorreu um erro ao buscar os clientes.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [isMounted, isAuthenticated]);

    if (!isMounted || loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#888" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
                Clientes
            </ThemedText>
            <FlatList
                data={clients}
                keyExtractor={(item) => item.clientId.toString()}
                renderItem={({ item }) => (
                    <ClientCard id={item.clientId} name={item.clientNome} cpf={item.clientCpf} />
                )}
                contentContainerStyle={styles.list}
            />
            <ThemedView style={styles.addButtonContainer}>
                <Button
                    title="Adicionar Novo Cliente"
                    onPress={() => router.push('/addClient')}
                />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        marginBottom: 16,
        textAlign: 'center',
        fontSize: 24,
    },
    list: {
        paddingVertical: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonContainer: {
        marginTop: 20,
        padding: 20,
        alignItems: 'center',
    },
});