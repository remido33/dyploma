
import {View, StyleSheet, TouchableOpacity, useColorScheme} from "react-native";
import {FC, memo, useCallback} from "react";
import CustomImage from "./CustomImage";
import { ProductDataType } from "@/constants/types";
import ThemedText from "./themed/Text";
import { sendAnalytic } from "@/helpers/requests";
import { Router } from 'expo-router';
import Colors from "@/constants/Colors";

type ProductCardDataType = Pick<ProductDataType, 'id' | 'mainImage' | 'minPrice' | 'maxPrice' | 'title'>;

type Props = {
    data: ProductCardDataType,
    router: Router,
    cardWidth: number,
};

const ProductCard: FC<Props> = ({ data, router, cardWidth, }) => {

    const colorScheme = useColorScheme();
    
    const { id, mainImage, minPrice, title } = data;

    const onPress = useCallback(() => {
        sendAnalytic.action({
            action: "view",
            productId: id,
        });

        router.push({
            pathname: '/product/[id]',
            params: { id, }
        })

    }, [id]);

    return (
        <View style={{ width: cardWidth }}>
            <TouchableOpacity 
                onPress={onPress} 
                activeOpacity={1} 
                style={styles.image}
            >
                <CustomImage 
                    source={{ uri: mainImage.replace('.jpg', '_large.jpg') }}
                    darkMode={colorScheme === "dark"}
                />
            </TouchableOpacity>
            <View style={styles.content}>
                <ThemedText numberOfLines={1} style={styles.title}>
                    {title}
                </ThemedText>
                <ThemedText style={styles.price}>
                    {minPrice} uah
                </ThemedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        aspectRatio: .75,
        width: '100%',
        marginBottom: 8,
    },
    content: {
        paddingLeft: 4,
        paddingRight: 8,
    },
    title: {
        fontFamily: 'HostGrotesk_Regular',
        fontSize: 13.4,
    },
    price: {
        fontSize: 12,
        fontFamily: 'HostGrotesk_Regular',
        letterSpacing: -.4,
    },
    darkOnImage: {
        position: 'absolute', 
        top: 0, 
        height: '100%', 
        width: '100%', 
        backgroundColor: 'rgba(0,0,0,.24)', 
        zIndex: 1,
    }
});

export default memo(ProductCard);
