import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IP } from '@env';

export default function TabFiveScreen() {
    const [users, setUsers] = useState([]);
    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        // Fetch users from the backend API
        fetch(`http://${IP}:5000/users`)
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));

        // Fetch bikes from the backend API
        fetch(`http://${IP}:5000/bikes`)
            .then(response => response.json())
            .then(data => setBikes(data))
            .catch(error => console.error('Error fetching bikes:', error));
    }, []);

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
            <View style={styles.container}>
                <Text style={styles.heading}>Din profil</Text>
                <Text style={styles.subHeading}>Användare</Text>
                <View>
                    {users.length > 0 && (
                        <View style={styles.listItem}>
                            <Text>Namn: {users[0].name}</Text>
                            <Text>E-post: {users[0].email}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.subHeading}>Cykel</Text>
                <View>
                    {bikes.length > 0 && (
                        <View style={styles.listItem}>
                            <Text>Modell: {bikes[0].model}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.subHeading}>Alla användare</Text>
                <View>
                    {users.map((user, index) => (
                        <View key={index} style={styles.listItem}>
                            <Text>Namn: {user.name}</Text>
                            <Text>E-post: {user.email}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.subHeading}>Alla cyklar</Text>
                <View>
                    {bikes.map((bike, index) => (
                        <View key={index} style={styles.listItem}>
                            <Text>Modell: {bike.model}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    listItem: {
        marginBottom: 10,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
