import { StyleSheet, Image, View, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Book } from '@/types/types';
import AdminCard from '@/components/AdminCard';
import React from 'react';

export default function Livros() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Função para verificar autenticação
    const checkAuthentication = async () => {
        try {
            const token = await AsyncStorage.getItem('@user_token');
            if (!token) {
                Alert.alert('Erro', 'Você precisa estar logado para acessar esta página.');
                router.replace('/login'); // Redireciona para a página de login
                return;
            }
            setIsAuthenticated(true); // Usuário está autenticado
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            Alert.alert('Erro', 'Ocorreu um problema. Faça login novamente.');
            router.replace('/login');
        }
    };

    // Função para buscar os livros
    const fetchBooks = () => {
        setLoading(true);
        fetch('http://100.100.100.251:5000/library/books')
            .then((res) => res.json())
            .then((data) => {
                setBooks(data.data);
                setFilteredBooks(data.data); // Inicialmente exibe todos os livros
            })
            .catch((err) => console.error('Erro ao buscar livros:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        checkAuthentication(); // Verifica a autenticação ao montar o componente
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBooks();
        }
    }, [isAuthenticated]);

    // Função para filtrar os livros com base na barra de pesquisa
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
        <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.bookId.toString()}
            renderItem={({ item }) => (
                <AdminCard
                    book={item}
                    onUpdate={(updatedBook: Book) => {
                        // Atualiza o estado local com o livro editado
                        setBooks((prevBooks) =>
                            prevBooks.map((book) =>
                                book.bookId === updatedBook.bookId ? updatedBook : book
                            )
                        );
                        setFilteredBooks((prevBooks) =>
                            prevBooks.map((book) =>
                                book.bookId === updatedBook.bookId ? updatedBook : book
                            )
                        );
                    }}
                    onDelete={(bookId : number) => {
                        // Remove o livro do estado local
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
                <>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText type="title">Nossos Livros</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Procure por um livro..."
                            placeholderTextColor="#aaa"
                            value={searchText}
                            onChangeText={handleSearch}
                        />
                    </ThemedView>
                </>
            }
        />
    );

}

const styles = StyleSheet.create({
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        alignSelf: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        marginVertical: 16,
        justifyContent: 'center',
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
    contentContainer: {
        padding: 16,
    },
    flatListContainer: {
        paddingHorizontal: 10,
        width: '100%',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    list: {
        paddingBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
