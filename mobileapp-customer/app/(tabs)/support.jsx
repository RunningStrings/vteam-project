import { StatusBar } from 'expo-status-bar';
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function TabFourScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }
        >
            <StatusBar style="auto" />
            <ThemedView style={styles.container}>
                <ThemedText type="title">Support</ThemedText>
            <ThemedText type="subtitle">Din stad</ThemedText>
            </ThemedView>
            <Pressable
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? '#5D3FD3' : '#841584',
                    },
                    styles.pressableButton,
                ]}
                onPress={() => alert('Olycka anmäld!')}
            >
                <Text style={styles.buttonText}>Anmäl en olycka</Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? '#5D3FD3' : '#841584',
                    },
                    styles.pressableButton,
                ]}
                onPress={() => alert('Cykel registrerad för service!')}
            >
                <Text style={styles.buttonText}>Anmäl en trasig cykel</Text>
            </Pressable>
        </ParallaxScrollView>
    );
    }

    const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pressableButton: {
        backgroundColor: Colors.light.tabIconSelected,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
