import { Tabs, useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import React from 'react';
import { Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    //console.log('Usuário autenticado:', isAuthenticated);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: true,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Destaques',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons size={28} name="home" color={color} />
                    ),
                    headerRight: () => (
                        <MaterialCommunityIcons
                            name={isAuthenticated ? 'logout' : 'account'}
                            size={24}
                            color={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'}
                            style={{ marginRight: 16 }}
                            onPress={async () => {
                                if (isAuthenticated) {
                                    logout();
                                    router.replace('/');
                                } else {
                                    router.push('/login');
                                }
                            }}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="categorias"
                options={{
                    title: 'Categorias',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="deathly-hallows" color={color} />,
                }}
            />
            <Tabs.Screen
                name="livros"
                options={{
                    title: 'Nossos Livros',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="bookshelf" color={color} />,
                }}
            />
            <Tabs.Screen
                name="clientes"
                options={{
                    title: 'Clientes',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="crud_livros"
                options={{
                    title: 'Livros',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="book-edit" color={color} />,
                }}
            />
        </Tabs>
    );
}
