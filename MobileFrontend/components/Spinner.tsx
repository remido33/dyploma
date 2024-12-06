import Colors from '@/constants/Colors';
import React, { useEffect, useRef, FC } from 'react';
import { Animated, Easing, StyleSheet, useColorScheme } from 'react-native';

const Spinner: FC = () => {
    const colorScheme = useColorScheme();
    const { tint, } = Colors[colorScheme ?? 'light'];
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={[
            styles.spinner, 
            { transform: [{ rotate }],
            borderColor: tint,
            }]}  
        />
    );
};

const styles = StyleSheet.create({
    spinner: {
        width: 20,
        height: 20,
        borderWidth: 2.4,
        borderTopColor: 'transparent',
        borderRadius: 25,
    },
});

export default Spinner;
