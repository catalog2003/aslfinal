import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import ExplosiveImages from './ExplosiveImages';

const HomeScreen = ({ navigation }) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden />
            <ExplosiveImages />

            <TouchableOpacity
                style={[
                    styles.button,
                    isPressed && styles.buttonPressed,
                ]}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // Align items to the bottom

        backgroundColor: '#ffffff',
    },

    button: {
        width: '50%',
        top: 30,
        left: '45%',
        height: 60,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#18191F',
        backgroundColor: '#FFBD12',
        shadowColor: '#18191F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40, // Add space from the bottom

    },
    buttonPressed: {
        shadowColor: '#422800',
        shadowOffset: { width: 2, height: 2 },
        elevation: 2,
        transform: [{ translateX: 2 }, { translateY: 2 }],
    },
    buttonText: {
        fontSize: 16,
        color: '#18191F',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
