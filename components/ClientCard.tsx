import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Botao from './Botao';
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";

type ClientCardProps = {
    id: number | string;
    name: string;
    cpf: string;
};

export default function ClientCard({ id, name, cpf }: ClientCardProps) {
    const router = useRouter();

    return (
        <ThemedView style={styles.card}>
            <ThemedView style={styles.content}>
                <ThemedView>
                    <ThemedText style={styles.title}>{name}</ThemedText>
                    <ThemedText style={styles.subtitle}>CPF: {cpf}</ThemedText>
                </ThemedView>
                <Botao
                    icon={'account-edit'}
                    onPress={() => router.push({ pathname: '/editClient', params: { id } })}
                />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
});
