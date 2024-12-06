import Colors from "@/constants/Colors";
import React, {FC, useRef, useEffect, memo} from "react";
import { View, StyleSheet, Animated, Easing, useColorScheme } from "react-native";

type Props = {
    cardWidth: number,
}

const PlaceholderCard: FC<Props> = ({ cardWidth }) => {
    const colorScheme = useColorScheme();
    const { border } = Colors[colorScheme ?? 'light'];
    const shimmerAnimation = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        const shimmer = Animated.loop(
            Animated.timing(shimmerAnimation, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        );

        shimmer.start();

        return () => {
            shimmer.stop();
        };
    }, [shimmerAnimation]);

    const shimmerOpacity = shimmerAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [.5, .8, .5],
    });

    return (
        <View style={[styles.wrapper, { width: cardWidth }]}>
            <Animated.View
                style={[styles.image,
                    {
                        backgroundColor: border,
                        opacity: shimmerOpacity,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.title,
                    {
                        backgroundColor: border,
                        opacity: shimmerOpacity,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.price,
                    {
                        backgroundColor: border,
                        opacity: shimmerOpacity,
                    },
                ]}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 8,
    },
    image: {
        aspectRatio: 0.75,
        borderRadius: 2,
        marginBottom: 8,
    },
    title: {
        height: 12,
        width: 80,
        borderRadius: 2,
        marginBottom: 8,
    },
    price: {
        height: 12,
        width: 40,
        borderRadius: 2,
    },
});

export default memo(PlaceholderCard);
