import { StyleSheet, Image, View, TextInput, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Book } from '@/types/types';
import BookCard from '@/components/BookCard';

export default function Livros() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);

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
        fetchBooks();
    }, []);

    // Função para filtrar os livros com base na barra de pesquisa
    const handleSearch = (text: string) => {
        setSearchText(text);

        const filtered = books.filter((book) =>
            book.nome.toLowerCase().includes(text.toLowerCase()) ||
            book.autor.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredBooks(filtered);
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <Image
                    source={require('@/assets/images/bookshelf.png')}
                    style={styles.headerImage}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Nossos Livros</ThemedText>
            </ThemedView>

            {/* Barra de pesquisa */}
            <ThemedView style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Procure por um livro..."
                    placeholderTextColor="#aaa"
                    value={searchText}
                    onChangeText={handleSearch}
                />
            </ThemedView>

            <ThemedView style={styles.contentContainer}>
                {loading ? (
                    <ThemedText>Carregando livros...</ThemedText>
                ) : (
                    <FlatList
                        data={filteredBooks}
                        keyExtractor={(item) => item.bookId.toString()}
                        renderItem={({ item }) => <BookCard book={item} />}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContainer} // Adicionando estilo para ajustar a largura
                    />
                )}
            </ThemedView>
        </ParallaxScrollView>
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
        paddingHorizontal: 10, // Espaçamento horizontal dentro da tela
        width: '100%', // Garante que ocupe toda a largura disponível
    },
    columnWrapper: {
        justifyContent: 'space-between', // Espaçamento uniforme entre os itens
        marginBottom: 16, // Espaçamento entre as linhas
    },
    list: {
        paddingBottom: 16,
    },
});
