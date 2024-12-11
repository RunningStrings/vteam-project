import { StatusBar } from 'expo-status-bar';
import { Image, View, Text, StyleSheet} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';

export default function TabTwoScreen() {
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
            <ThemedView style={styles.container}>
                <ThemedText type="title">Priser</ThemedText>
            <ThemedText type="subtitle">Din stad</ThemedText>
            <ThemedText>Upplåsning: 0kr</ThemedText>
            <ThemedText>Därefter: 5kr/minut</ThemedText>
            <StatusBar style="auto" />
            </ThemedView>
            <Collapsible title="Fast pris">
            <ThemedText>10kr/tur, ingen upplåsningsavgift</ThemedText>
            <ThemedText>Betala 99kr per månad, åk så länge de räcker!</ThemedText>
            </Collapsible>
            <Collapsible title="Månadskort">
            <ThemedText>300 fria minuter, ingen upplåsningsavgift</ThemedText>
            <ThemedText>Betala 249kr per månad, köp till fler minuter vid behov!</ThemedText>
            </Collapsible>
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
});
