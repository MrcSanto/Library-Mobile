import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (token: string) => {
        await AsyncStorage.setItem('@user_token', token);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('@user_token');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('@user_token');
            setIsAuthenticated(!!token);
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
