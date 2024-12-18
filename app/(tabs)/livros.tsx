import { StyleSheet, Image, View, TextInput, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { Book } from '@/types/types';
import BookCard from '@/components/BookCard';
import React from 'react';

export default function Livros() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);

    // Função para buscar os livros
    const fetchBooks = () => {
        setLoading(true);
        fetch('http://super-santo.com.br:5000/library/books')
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

    const renderHeader = () => (
        <>
            <Image
                source={require('@/assets/images/bookshelf.png')}
                style={styles.headerImage}
            />
            <View style={styles.titleContainer}>
                <ThemedText type="title">Nossos Livros</ThemedText>
            </View>
            {/* Barra de pesquisa */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Procure por um livro..."
                    placeholderTextColor="#aaa"
                    value={searchText}
                    onChangeText={handleSearch}
                />
            </View>
        </>
    );

    return (
        <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.bookId.toString()}
            renderItem={({ item }) => <BookCard book={item} />}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
                loading ? (
                    <ThemedText>Carregando livros...</ThemedText>
                ) : (
                    <ThemedText>Nenhum livro encontrado.</ThemedText>
                )
            }
        />
    );
}

const styles = StyleSheet.create({
    headerImage: {
        width: '100%',
        height: 200,
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
    flatListContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
});
