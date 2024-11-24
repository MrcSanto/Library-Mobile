import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CircularButtonProps {
    title?: string;
    icon?: string;
    onPress: () => void;
}

const Botao: React.FC<CircularButtonProps> = ({ title, icon, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
        {
            title ? <Text style={styles.buttonText}>{title}</Text> : <MaterialCommunityIcons size={28} name={icon as any} />
        }

        </TouchableOpacity>
);
};

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Botao;
