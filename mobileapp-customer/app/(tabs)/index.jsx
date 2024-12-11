import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';

const locations = [
    { id: 1, latitude: 58.41068698245291, longitude: 15.621581899999995, title: "Hejhej", description: "Här är Folke Filbyter" },
    { id: 2, latitude: 55.705157947051994, longitude: 13.189122134316587, title: "Hallå", description: "Här är Mormors Bageri" },
    { id: 3, latitude: 55.598096442418644, longitude: 12.997459039597759, title: "Tjoho", description: "Här är Lilla Glassfabriken" },
    { id: 4, latitude: 59.327605696465035, longitude: 18.074089948642243, title: "Nämen", description: "Här kan man lägga båten" },
    { id: 5, latitude: 59.85805333537346, longitude: 17.638152751372555, title: "Hoho", description: "Här verkar det finnas bra fika"}
];

export default function TabOneScreen() {
    const [region, setRegion] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Request permission and get current location
    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        
        setRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.0922,  // Set zoom level
            longitudeDelta: 0.0421,  // Set zoom level
        });
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    if (!region) {
        return (
            <View style={styles.container}>
                <Text>Loading map...</Text>
                {errorMsg && <Text>Error: {errorMsg}</Text>}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}  // Use region to center the map on the user's location
            >
                <Marker coordinate={region} title="Du är här" description="Din position" />

                {locations.map(location => (
                    <Marker
                        key={location.id}
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title={location.title}
                        description={location.description}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
