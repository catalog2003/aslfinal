import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions } from 'react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.appName}>Your App Name</Text>
            <ActivityIndicator size="large" color="#8C00CD" style={styles.loadingIndicator} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: '50%', // 50% of the screen width
        height: undefined, // Allows aspect ratio to be maintained
        aspectRatio: 1, // Square aspect ratio
        marginBottom: '5%', // 5% of the screen height
    },
    appName: {
        fontSize: Dimensions.get('window').width * 0.08, // 8% of the screen width
        fontWeight: 'bold',
        marginBottom: '5%', // 5% of the screen height
        textAlign: 'center',
    },
    loadingIndicator: {
        marginTop: '5%', // 5% of the screen height
    },
});

export default SplashScreen;
