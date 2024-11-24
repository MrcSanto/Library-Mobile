import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
} from "react-native";
import { Book } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AdminCardProps {
    book: Book; // O tipo Book deve estar definido corretamente
    onUpdate: (updatedBook: Book) => void; // Callback para atualizar o livro
    onDelete: (bookId: number) => void; // Callback para deletar o livro
}


const AdminCard: React.FC<AdminCardProps> = ({ book, onDelete, onUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedBook, setEditedBook] = useState<Book>({ ...book });

    useEffect(() => {
        setEditedBook({ ...book });
        console.log("AdminCard recebido book:", book);
    }, [book]);

    const defaultImage = "https://via.placeholder.com/150";

    const handleShowDetails = () => {
        setShowModal(true);
    };

    const handleEditBook = () => {
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const token = await AsyncStorage.getItem('@user_token');
            if (!token) {
                Alert.alert('Erro', 'Você precisa estar logado para realizar esta ação.');
                return;
            }

            const response = await fetch(`http://100.100.100.251:5000/library/books/${editedBook.bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedBook),
            });

            if (response.ok) {
                const updatedData = await response.json();
                Alert.alert('Sucesso', 'Livro atualizado com sucesso.');
                onUpdate(updatedData);
                setShowEditModal(false);
            } else {
                Alert.alert('Erro', 'Não foi possível salvar as alterações.');
            }
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar as alterações.');
        }
    };

    const handleDeleteBook = async () => {
        try {
            const token = await AsyncStorage.getItem('@user_token');
            if (!token) {
                Alert.alert('Erro', 'Você precisa estar logado para realizar esta ação.');
                return;
            }

            const response = await fetch(`http://100.100.100.251:5000/library/books/${book.bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Livro deletado com sucesso.');
                onDelete(book.bookId);
            } else {
                Alert.alert('Erro', 'Não foi possível deletar o livro.');
            }
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao deletar o livro.');
        }
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
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditBook}>
                <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{book.nome}</Text>
                        <ScrollView>
                            <Text>
                                <Text style={styles.bold}>Autor:</Text> {book.autor}
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Páginas:</Text> {book.paginas}
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Categoria:</Text> {book.categoria.nome}
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Descrição Categoria:</Text>{" "}
                                {book.categoria.descricao}
                            </Text>
                            <Text>
                                <Text style={styles.bold}>ISBN:</Text> {book.isbn}
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Restantes:</Text> {book.restantes}
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Data Adição:</Text>{" "}
                                {book.dataAdd
                                    ? new Date(book.dataAdd).toLocaleDateString()
                                    : "Sem informação"}
                            </Text>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal para editar o livro */}
            <Modal
                visible={showEditModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Livro</Text>
                        <ScrollView>
                            <Text style={styles.bold}>Nome:</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={editedBook.nome}
                                onChangeText={(text) => setEditedBook({ ...editedBook, nome: text })}
                            />
                            <Text style={styles.bold}>Autor:</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={editedBook.autor}
                                onChangeText={(text) =>
                                    setEditedBook({ ...editedBook, autor: text })
                                }
                            />
                            <Text style={styles.bold}>Páginas:</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={editedBook.paginas.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) =>
                                    setEditedBook({ ...editedBook, paginas: Number(text) })
                                }
                            />
                            {/* Adicione outros campos conforme necessário */}
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={handleSaveEdit}>
                            <Text style={styles.closeButtonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowEditModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancelar</Text>
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
        marginHorizontal: 8,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
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
    editButton: {
        backgroundColor: "#28a745",
        marginTop: 8,
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
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
});

export default AdminCard;
