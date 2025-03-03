import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, TouchableOpacity, Modal, Image, Alert, ScrollView, Switch } from 'react-native';

import { CameraView, useCameraPermissions } from 'expo-camera';


import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import io from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';

// Import your small image icon and new icon image
import SmallImageIcon from '../assets/menu.png';
import IconImage from '../assets/icon1.png'; // Replace with the path to your icon image
import IconImage2 from '../assets/icon2.png';
import IconImage3 from '../assets/icon3.png';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const cameraAspectRatio = 4 / 3; // Adjust as needed

const SERVER_URL = 'ip generated from server'; // Replace with your Flask server URL
const apiKey = 'fal ai api'; // Insert your API key here

// YellowBox component
const YellowBox = ({ children }) => (
    <View style={styles.yellowBox}>
        <Text style={styles.yellowBoxText}>{children}</Text>
    </View>
);

const SignLanguage = () => {
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [socket, setSocket] = useState(null);
    const [prediction, setPrediction] = useState('');
    const [wordFormation, setWordFormation] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [autoCapture, setAutoCapture] = useState(false);
    const cameraRef = useRef(null);
    const lastPredictionRef = useRef('');
    const intervalRef = useRef(null);

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket.emit('start_predictions');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        newSocket.on('prediction', (data) => {
            if (data.class === 'NEXT') {
                if (lastPredictionRef.current === 'DELETE') {
                    // Delete the last character from word formation
                    setWordFormation(prev => prev.slice(0, -1));
                } else if (lastPredictionRef.current === 'SPACE') {
                    // Add a space to the word formation
                    setWordFormation(prev => prev + ' ');
                } else {
                    // Add last predicted character to word formation
                    setWordFormation(prev => prev + lastPredictionRef.current);
                }
                // Reset last prediction
                lastPredictionRef.current = '';
            } else {
                // Update last predicted character
                lastPredictionRef.current = data.class;
            }

            // Update current prediction display
            setPrediction(data.class);
        });

        return () => {
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.off('prediction');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const takePicture = async () => {
        if (!socket) {
            console.log('Socket connection not established.');
            return;
        }

        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            const uri = photo.uri;

            try {
                const base64Image = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                socket.emit('image', { image: base64Image });
                console.log('Image sent to server.');
            } catch (error) {
                console.error('Error reading image:', error);
            }
        }
    };

    const clearWordFormation = () => {
        setWordFormation('');
    };

    const generateImage = async () => {
        const requestBody = {
            prompt: wordFormation,
            image_size: "square_hd",
            num_inference_steps: 4,
            num_images: 1,
            format: "jpeg"
        };

        try {
            const response = await fetch('https://fal.run/fal-ai/fast-lightning-sdxl', {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const imageUrl = data.images[0].url;
            setImageUrl(imageUrl);
            setModalVisible(true);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            Alert.alert('Error', 'Error generating image.');
        }
    };

    const speakWordFormation = () => {
        if (!wordFormation.trim().length) {
            Alert.alert('Nothing to Convert', 'Enter text in the text area.');
            return;
        }
        Speech.speak(wordFormation);
    };

    const handleAutoCaptureToggle = () => {
        setAutoCapture(prev => !prev);
    };

    useEffect(() => {
        if (autoCapture) {
            intervalRef.current = setInterval(takePicture, 3000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [autoCapture]);

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    // Calculate camera dimensions to fit within a rectangle
    let cameraWidth = screenWidth;
    let cameraHeight = screenWidth / cameraAspectRatio;

    if (cameraHeight > screenHeight) {
        cameraHeight = screenHeight;
        cameraWidth = screenHeight * cameraAspectRatio;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}><TouchableOpacity style={styles.circularButton} onPress={() => navigation.goBack()}>
                <Image source={IconImage} style={styles.icon} />
            </TouchableOpacity>
                <Text style={styles.headerText}>Sign </Text>
                <Image source={SmallImageIcon} style={styles.smallIcon} />
            </View>
            <View style={styles.outerContainer}>
                <View style={[styles.cameraContainer, { width: cameraWidth, height: cameraHeight }]}>
                    <CameraView style={styles.camera} ref={cameraRef} facing="front">
                        {/* Content for the camera view */}
                    </CameraView>
                </View>
                <TouchableOpacity style={styles.takePicture} onPress={takePicture}>
                    <Text style={styles.takePictureText}>Capture</Text>
                </TouchableOpacity>
                <Text style={styles.predictionText}>Character: {prediction}</Text>
                <Text style={styles.wordFormationText}>Word: {wordFormation}</Text>
                <TouchableOpacity style={styles.clearButton} onPress={clearWordFormation}>
                    <Text style={styles.clearButtonText}>Clear Word </Text>
                </TouchableOpacity>


                {/* Yellow box with bold text */}
                <YellowBox>
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>Auto Capture</Text>
                        <Switch
                            onValueChange={handleAutoCaptureToggle}
                            value={autoCapture}
                            trackColor={{ false: "#E9E7FC", true: "#FFBD12" }} // Color for the toggle switch
                        />
                    </View>
                </YellowBox>
                <TouchableOpacity style={styles.circularButton2} onPress={speakWordFormation}>
                    <Image source={IconImage2} style={styles.icon2} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circularButton3} onPress={generateImage}>
                    <Image source={IconImage3} style={styles.icon3} />
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    {imageUrl && (
                        <Image
                            style={styles.image}
                            source={{ uri: imageUrl }}
                        />
                    )}
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -40,
        marginBottom: 20,
        width: '100%', // Ensures the container takes the full width of the screen
    },

    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1, // Takes up available space between the icons
    },

    smallIcon: {
        width: 50,
        height: 50,
    },

    circularButton: {
        width: 70,
        height: 70,
        aspectRatio: 1,
        borderRadius: 70,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#18191F',
        borderBottomWidth: 7,
        borderBottomRightRadius: 80,
        borderBottomLeftRadius: 80,
    },

    icon: {
        width: '70%', // Percentage-based dimensions
        height: '70%',
        resizeMode: 'contain',
    },

    outerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Inner area background color
    },
    cameraContainer: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
    },
    predictionText: {
        marginTop: 20,
        fontSize: 27,
        fontWeight: 'bold',
        top:70,
    },
    wordFormationText: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        top:80,
    },

    takePicture: {
        position: 'absolute',
        bottom: -60,
        left: 20,
        width: '45%',
        padding: 16,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        borderRadius: 10,
        backgroundColor: '#1947E5', // Equivalent of var(--Contra-Blue, #1947E5)
    },
    takePictureText: {
        color: 'white',
        fontWeight: 'bold',

        fontFeatureSettings: "'clig' off, 'liga' off",
        fontFamily: 'Montserrat',
        fontSize: 21,
        fontStyle: 'normal',

        lineHeight: 28,
    },
    clearButton: {
        position: 'absolute',
        bottom: -60,
        right: 20,

        width: '45%',
        padding: 16,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        borderRadius: 10,
        backgroundColor: '#F95A2C',
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',

        fontFeatureSettings: "'clig' off, 'liga' off",
        fontFamily: 'Montserrat',
        fontSize: 21,
        fontStyle: 'normal',

        lineHeight: 28,
    },

    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -5,
    },
    switchText: {
        marginRight: 10,
        fontSize: 21,
        fontWeight: "bold",
        fontFamily: 'Montserrat',
    },

    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 20,
        right: 20,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
    },
    circularButton2: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: '#D6FCF7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#18191F',
        position: 'absolute',
        bottom: 20,
        left: 20,
        borderBottomWidth: 7,
        borderBottomRightRadius: 42,
        borderBottomLeftRadius: 42,
    },

    circularButton3: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: '#FFE8E8',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#18191F',
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderBottomWidth: 7,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
    },
    icon2: {
        width: 40,
        height: 40,
    },

    icon3: {
        width: 40,
        height: 40,
    },

    // Styles for YellowBox
    yellowBox: {
        width: 327,
        height: 76,
        flexShrink: 0,
        borderRadius: 16,
        backgroundColor: '#FFF4CC',
        justifyContent: 'center',
        alignItems: 'center',
        top: -80,
        marginBottom: 100, // Adjust spacing as needed
    },
    yellowBoxText: {
        fontWeight: 'bold',
    },
});

export default SignLanguage;
