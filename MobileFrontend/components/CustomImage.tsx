import React, { useState } from 'react';
import {
    Animated,
    StyleSheet,
    View,
} from "react-native";

type Props = {
    source: {
        uri: string,
    },
    darkMode?: boolean,
};

const CustomImage: React.FC<Props> = ({ source, darkMode = false }) => {

    const fadeAnim = useState(new Animated.Value(0))[0];

    const handleImageLoad = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={[styles.wrapper]}>
            <Animated.Image
                source={source}
                resizeMode="cover"
                style={[styles.image, { opacity: fadeAnim }]}
                onLoadEnd={handleImageLoad}
            />
            {darkMode && <View style={styles.darkOnImage} />}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        display: 'flex',
        height: '100%',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
    },
    darkOnImage: {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,.1)',
        zIndex: 1,
    },
});

export default CustomImage;
