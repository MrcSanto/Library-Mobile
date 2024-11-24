import { StyleSheet, Image, View } from 'react-native';
import { useEffect, useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Categoria } from '@/types/types';
import { Collapsible } from '@/components/Collapsible';

export default function Categorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    // Função para buscar as categorias
    const fetchCategorias = () => {
        setLoading(true);
        fetch('http://100.100.100.251:5000/library/categories')
            .then((res) => res.json())
            .then((data) => setCategorias(data))
            .catch((err) => console.error('Erro ao buscar categorias:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <Image
                    source={require('@/assets/images/books_categoria.png')}
                    style={styles.headerImage}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Categorias</ThemedText>
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
                <ThemedText style={styles.subtitle}>Contamos com diversas categorias para leitura</ThemedText>
             </ThemedView>

            <ThemedView style={styles.contentContainer}>
                {loading ? (
                    <ThemedText>Carregando categorias...</ThemedText>
                ) : (
                    categorias.map((categoria) => (
                        <ThemedView key={categoria.categoriaId} style={styles.card}>
                            <Collapsible title={categoria.nome}>
                                <ThemedText style={styles.categoriaDescricao}>
                                    {categoria.descricao}
                                </ThemedText>
                            </Collapsible>
                        </ThemedView>
                    ))
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
    subtitle: {
        fontSize: 17
    },
    contentContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        borderWidth: 0,
    },
    categoriaDescricao: {
        fontSize: 16,
        color: '#ffffff',
        marginTop: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
