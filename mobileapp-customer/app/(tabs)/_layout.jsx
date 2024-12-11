import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
            ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
            },
            default: {},
            }),
        }}>
        <Tabs.Screen
            name="index"
            options={{
            title: 'Karta',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="map" color={color} />,
            }}
        />
        <Tabs.Screen
            name="payment"
            options={{
            title: 'Saldo',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard" color={color} />,
            }}
        />
        <Tabs.Screen
            name="scan"
            options={{
            title: '',
            tabBarIcon: ({ color }) => (
                <View style={styles.roundTabIcon}>
                <IconSymbol size={56} name="qrcode.viewfinder" color={Colors.light.secondary} />
            </View>
            ),
            }}
        />
        <Tabs.Screen
            name="support"
            options={{
            title: 'Support',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="lifepreserver" color={color} />,
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
            }}
        />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    roundTabIcon: {
        backgroundColor: Colors.light.primary,
        borderRadius: 50,
        padding: 35, 
        borderWidth: 2,
        borderColor: Colors.light.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
    },
});
