import {Image, StyleSheet, Platform, FlatList} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useEffect, useState} from "react";
import {Book} from "@/types/types";
import BookCard from "@/components/BookCard";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
]);


export default function Destaques() {
    const [popularBooks, setPopularBooks] = useState<Book[]>([]);
    const [recentBooks, setRecentBooks] = useState<Book[]>([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [loadingRecent, setLoadingRecent] = useState(true);

    const fetchPopularBooks = () => {
        setLoadingPopular(true);
        fetch("http://super-santo.com.br:5000/library/books/most-popular")
            .then((res) => res.json())
            .then((data) => {
                setPopularBooks(data);
                //console.log(data);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoadingPopular(false));
    };

    const fetchRecentBooks = () => {
        setLoadingRecent(true);
        fetch("http://super-santo.com.br:5000/library/books/most-recent")
            .then((res) => res.json())
            .then((data) => {
                setRecentBooks(data);
                //console.log(data);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoadingRecent(false));
    };

    useEffect(() => {
        fetchPopularBooks();
        fetchRecentBooks();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/books_destaque.png')}
                    style={styles.booksLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Destaques</ThemedText>
            </ThemedView>
            <ThemedView style={styles.subtitle}>
                <ThemedText type="subtitle">Mais Populares</ThemedText>
            </ThemedView>
            <ThemedView>
                <FlatList
                    data={popularBooks}
                    keyExtractor={(item) => item.bookId.toString()}
                    renderItem={({ item }) => <BookCard book={item} />}
                    numColumns={2} // Define o número de colunas
                    columnWrapperStyle={styles.columnWrapper}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                />
            </ThemedView>

            <ThemedView style={styles.subtitle}>
                <ThemedText type="subtitle">Mais Recentes</ThemedText>
            </ThemedView>
            <ThemedView>
                <FlatList
                    data={recentBooks}
                    keyExtractor={(item) => item.bookId.toString()}
                    renderItem={({ item }) => <BookCard book={item} />}
                    numColumns={2} // Define o número de colunas
                    columnWrapperStyle={styles.columnWrapper}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                />
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    columnWrapper: {
        justifyContent: 'space-between', // Espaço uniforme entre os itens
        marginBottom: 16, // Espaço entre as linhas
    },
    subtitle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    booksLogo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        alignSelf: 'center'
    },
});
