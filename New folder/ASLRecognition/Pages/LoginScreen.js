import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native';
import IconImage from "../assets/icon1.png";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Perform login logic here using email and password
        console.log('Login with:', { email, password });
        // Navigate to Signlanguage screen
        navigation.navigate('Sign');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/top.png')} style={styles.topImage} />
            <TouchableOpacity style={styles.circularButton} onPress={() => navigation.goBack()}>
                <Image source={IconImage} style={styles.icon1} />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back</Text>
                <View style={styles.line}></View>
                <View style={styles.inputContainer}>
                    <Image source={require('../assets/user.png')} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        onChangeText={setEmail}
                        value={email}
                        placeholderTextColor="#18191F" // Light gray placeholder color
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image source={require('../assets/lock.png')} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        value={password}
                        placeholderTextColor="#18191F" // Light gray placeholder color
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Continue</Text>
                        <Image source={require('../assets/arrow.png')} style={styles.buttonIcon} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F57C00', // Orange background
        alignItems: 'center',
    },
    topImage: {
        width: '100%', // Full width of the screen
        height: '50%', // 50% of the screen height
        resizeMode: 'contain', // Contain the image within the area without cutting off any part
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
    },
    card: {
        backgroundColor: '#fff',
        padding: Dimensions.get('window').width * 0.05, // 5% of screen width
        borderRadius: 5,
        width: '100%', // 90% of the screen width
        maxWidth: 900, // Max width for larger screens
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        borderTopWidth: 10,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderWidth: 2,
        borderColor: '#18191F',
        alignSelf: 'center', // Center the card horizontally
        marginTop: 'auto', // Push the card to the bottom
        marginBottom: 0, // Margin to separate from the bottom edge
    },
    title: {
        fontSize: Dimensions.get('window').width * 0.08, // 8% of screen width
        fontWeight: 'bold',
        marginBottom: '5%', // 5% of screen height
        textAlign: 'center', // Center the text
    },
    line: {
        width: '100%', // Full width of the container
        height: 2,
        backgroundColor: '#000000', // Black color
        marginBottom: '5%', // Spacing below the line
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000',
        padding: '3%', // 3% of screen width
        marginBottom: '5%', // 5% of screen height
        borderRadius: 15,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 21, // Fixed font size
        lineHeight: 28, // Line height for better spacing
        fontFamily: 'Montserrat', // Use Montserrat font
    },
    button: {
        backgroundColor: '#000',
        padding: '2%', // 2% of screen height
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: Dimensions.get('window').width * 0.05, // 5% of screen width
        fontWeight: 'bold',
        marginRight: 10, // Margin between text and icon
    },
    buttonIcon: {
        width: Dimensions.get('window').width * 0.03,
        height: Dimensions.get('window').height * 0.03,
    },
    circularButton: {
        width: '12%', // Percentage-based width
        aspectRatio: 1, // Ensure the button remains circular
        borderRadius: Dimensions.get('window').width * 0.06, // Half of the width to make it circular
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#18191F',
        position: 'absolute',
        top: '2%',
        left: '4%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        borderBottomWidth: 7,
        borderBottomRightRadius: Dimensions.get('window').width* 0.06,
        borderBottomLeftRadius: Dimensions.get('window').width * 0.06,
    },
    icon1: {
        width: '70%', // Percentage-based dimensions
        height: '70%',
        resizeMode: 'contain',
    },
});

export default LoginScreen;
