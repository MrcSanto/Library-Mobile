import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Book } from "@/types/types";

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const [showModal, setShowModal] = useState(false);

    const defaultImage = 'https://via.placeholder.com/150'; // URL de imagem padrão

    const handleShowDetails = () => {
        setShowModal(true);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{book.nome}</Text>
            <Image
                source={{ uri: book.imagem || defaultImage }}
                style={styles.image}
                resizeMode="cover"
            />
            <TouchableOpacity style={styles.button} onPress={handleShowDetails}>
                <Text style={styles.buttonText}>Saiba mais</Text>
            </TouchableOpacity>

            <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{book.nome}</Text>
                        <ScrollView>
                            <Text><Text style={styles.bold}>Autor:</Text> {book.autor}</Text>
                            <Text><Text style={styles.bold}>Páginas:</Text> {book.paginas}</Text>
                            <Text><Text style={styles.bold}>Categoria:</Text> {book.categoria.nome}</Text>
                            <Text><Text style={styles.bold}>Descrição Categoria:</Text> {book.categoria.descricao}</Text>
                            <Text><Text style={styles.bold}>Autor:</Text> {book.autor}</Text>
                            <Text><Text style={styles.bold}>ISBN:</Text> {book.isbn}</Text>
                            <Text><Text style={styles.bold}>Restantes:</Text> {book.restantes}</Text>

                            <Text>
                                <Text style={styles.bold}>Data Adição:</Text>{" "}
                                {book.dataAdd ? new Date(book.dataAdd).toLocaleDateString() : "Sem informação"}
                            </Text>
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginHorizontal: 8, // Espaçamento horizontal entre os cards
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        alignSelf: "center",
    },

    info: {
        marginTop: 8,
        textAlign: "center", // Centraliza o texto dentro do elemento
        alignSelf: "center", // Centraliza o próprio elemento no eixo horizontal
        justifyContent: "center", // Centraliza verticalmente se necessário
    },

    bold: {
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        width: "90%",
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    closeButton: {
        backgroundColor: "#007BFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default BookCard;
