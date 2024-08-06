import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const maxDistance = Math.min(width, height) * 0.75;

// Image sources
const images = [
    require('../Untitled/A.png'),
    require('../Untitled/B.png'),
    require('../Untitled/C.png'),
    require('../Untitled/D.png'),
    require('../Untitled/E.png'),
    require('../Untitled/F.png'),
    require('../Untitled/G.png'),
    require('../Untitled/H.png'),
    require('../Untitled/I.png'),
    require('../Untitled/J.png'),
    require('../Untitled/K.png'),
    require('../Untitled/L.png'),
    require('../Untitled/M.png'),
    require('../Untitled/N.png'),
    require('../Untitled/O.png'),
    require('../Untitled/P.png'),
    require('../Untitled/Q.png'),
    require('../Untitled/R.png'),
    require('../Untitled/S.png'),
    require('../Untitled/T.png'),
    require('../Untitled/U.png'),
    require('../Untitled/V.png'),
    require('../Untitled/W.png'),
    require('../Untitled/X.png'),
    require('../Untitled/Y.png'),
    require('../Untitled/Z.png'),
];

// Adjust size based on device width
const baseWidth = width / 4; // Base item width
const itemWidth = Math.min(baseWidth, width * 0.15); // Max 15% of screen width
const itemHeight = itemWidth * 1.5; // Keep aspect ratio

const spacing = height * 0.01; // Space between images (adjust this value)
const offsetY = height * 0.7; // Upward movement

const finalPositions = [];
const layout = [6, 5, 5, 6, 4]; // Layout for each row
let currentY = spacing; // Start from the top with spacing

layout.forEach((numImages) => {
    const totalWidth = numImages * itemWidth + (numImages - 1) * spacing; // Total width of the row
    const startX = (width - totalWidth) / 2; // Center the row

    for (let i = 0; i < numImages; i++) {
        finalPositions.push({
            x: startX + i * (itemWidth + spacing), // Position based on index
            y: currentY - offsetY, // Use currentY for vertical positioning with offsetY
        });
    }
    currentY += itemHeight + spacing; // Increment Y for next row
});

const getRandomAngle = () => Math.random() * (Math.PI / 2);
const getRandomDistance = () => Math.random() * (maxDistance * 0.5) + maxDistance * 0.5;
const getRandomDuration = (min, max) => Math.random() * (max - min) + min;

const ExplosiveImage = ({ source, finalX, finalY }) => {
    const translateX = new Animated.Value(0);
    const translateY = new Animated.Value(0);
    const rotate = new Animated.Value(0);

    useEffect(() => {
        const angle = getRandomAngle();
        const distance = getRandomDistance();
        const xSpace = Math.cos(angle) * (distance * 1.2) - 50; // Adjust this value to move left
        const ySpace = -Math.sin(angle) * (distance * 1.2);
        const rotateDeg = Math.random() * 360;

        Animated.parallel([
            Animated.timing(translateX, {
                toValue: xSpace,
                duration: getRandomDuration(500, 1000),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: ySpace,
                duration: getRandomDuration(500, 1000),
                useNativeDriver: true,
            }),
            Animated.timing(rotate, {
                toValue: rotateDeg,
                duration: getRandomDuration(500, 1000),
                useNativeDriver: true,
            }),
        ]).start(() => {
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: finalX,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: finalY,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    }, [finalX, finalY]);

    return (
        <Animated.Image
            source={source}
            style={[
                styles.explosiveImage,
                {
                    transform: [
                        { translateX },
                        { translateY },
                        {
                            rotate: rotate.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg'],
                            }),
                        },
                    ],
                },
            ]}
            resizeMode="contain"
        />
    );
};

const StaticImage = ({ source, x, y }) => (
    <Animated.Image
        source={source}
        style={[
            styles.staticImage,
            {
                left: x,
                top: y,
            },
        ]}
        resizeMode="contain"
    />
);

const ExplosiveImages = () => {
    const [showExplosive, setShowExplosive] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            setShowExplosive(true);
            return () => setShowExplosive(false);
        }, [])
    );

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            {showExplosive ? (
                images.map((img, index) => (
                    <ExplosiveImage
                        key={index}
                        source={img}
                        finalX={finalPositions[index].x}
                        finalY={finalPositions[index].y}
                    />
                ))
            ) : (
                layout.map((numImages, rowIndex) =>
                    Array.from({ length: numImages }, (_, index) => (
                        <StaticImage
                            key={`${rowIndex}-${index}`}
                            source={images[rowIndex * layout[rowIndex] + index]}
                            x={finalPositions[rowIndex * layout[rowIndex] + index].x}
                            y={finalPositions[rowIndex * layout[rowIndex] + index].y}
                        />
                    ))
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    explosiveImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: itemWidth,
        height: itemHeight,
    },
    staticImage: {
        position: 'absolute',
        width: itemWidth,
        height: itemHeight,
    },
});

export default ExplosiveImages;
