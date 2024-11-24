import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    FlatList,
    Alert,
    ActivityIndicator,
    TextInput,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Book } from '@/types/types';
import AdminCard from '@/components/AdminCard';

export default function Livros() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const router = useRouter();

    // Verifica se o usuário está autenticado
    const checkAuthentication = async () => {
        try {
            const token = await AsyncStorage.getItem('@user_token');
            if (!token) {
                Alert.alert('Erro', 'Você precisa estar logado para acessar esta página.');
                router.replace('/login');
                return;
            }
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            Alert.alert('Erro', 'Ocorreu um problema. Faça login novamente.');
            router.replace('/login');
        }
    };

    // Busca livros da API
    const fetchBooks = () => {
        setLoading(true);
        fetch('http://100.100.100.251:5000/library/books')
            .then((res) => res.json())
            .then((data) => {
                setBooks(data.data || []);
                setFilteredBooks(data.data || []);
            })
            .catch((err) => console.error('Erro ao buscar livros:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBooks();
        }
    }, [isAuthenticated]);

    // Filtra os livros com base no texto de busca
    const handleSearch = (text: string) => {
        setSearchText(text);

        const filtered = books.filter((book) =>
            book.nome.toLowerCase().includes(text.toLowerCase()) ||
            book.autor.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredBooks(filtered);
    };

    if (!isAuthenticated || loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#888" />
                <ThemedText>Carregando...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={filteredBooks}
                keyExtractor={(item) => item.bookId.toString()}
                renderItem={({ item }) => (
                    <AdminCard
                        book={item}
                        onUpdate={(updatedBook: Book) => {
                            setBooks((prevBooks) =>
                                prevBooks.map((book) =>
                                    book.bookId === updatedBook.bookId ? { ...book, ...updatedBook } : book
                                )
                            );
                            setFilteredBooks((prevBooks) =>
                                prevBooks.map((book) =>
                                    book.bookId === updatedBook.bookId ? { ...book, ...updatedBook } : book
                                )
                            );
                        }}
                        onDelete={(bookId: number) => {
                            setBooks((prevBooks) =>
                                prevBooks.filter((book) => book.bookId !== bookId)
                            );
                            setFilteredBooks((prevBooks) =>
                                prevBooks.filter((book) => book.bookId !== bookId)
                            );
                        }}
                    />
                )}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer}
                ListHeaderComponent={
                    <ThemedView style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Procure por um livro..."
                            placeholderTextColor="#aaa"
                            value={searchText}
                            onChangeText={handleSearch}
                        />
                    </ThemedView>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    flatListContainer: {
        paddingHorizontal: 10,
        width: '100%',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
