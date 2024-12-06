import {FC} from "react";
import {View, StyleSheet, useColorScheme} from "react-native";
import Swiper from 'react-native-swiper';
import CustomImage from "@/components/CustomImage";
import { useSelector } from "react-redux";
import { ReduxStateType } from "../../../constants/types";
import Colors from "@/constants/Colors";

const ImageSlider: FC = () => {

    const colorScheme = useColorScheme();
    const { tint, background, secondary} = Colors[colorScheme ?? 'light'];

    const { selectedColor, variants, images } = useSelector((state: ReduxStateType) => state.currentProductData);
    const colorOptions = [...new Set(variants.map(variant => variant.color || ""))].filter(color => color !== "");
    
    const selectedColorImages = 
    [...new Set(variants.filter((v) => v.color === selectedColor).map((v) => v.image))];

    const imagesArray = selectedColor && colorOptions.length > 1 && selectedColorImages.length > 0
        ? [...selectedColorImages, ...images.filter(image => !selectedColorImages.includes(image))]
        : images;

    return (
        
        <Swiper
            horizontal={false}
            key={imagesArray.length}
            dot={
                <View
                    style={{
                        ...styles.dot,
                        backgroundColor: secondary,
                    }}
                />
            }
            activeDot={
                <View style={{
                        ...styles.dot,
                        backgroundColor: colorScheme === 'light' ? tint : background,
                    }}
                />
            }
            paginationStyle={{
                right: null,
                left: 16,
            }}
        >
            {imagesArray.map((image, index) =>
                <View key={index} style={styles.slide}>
                    <CustomImage
                        source={{ uri: image }}
                        darkMode={colorScheme === "dark"}
                    />
                </View>
            )}
        </Swiper>
    )
}

export default ImageSlider;

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
    },
    dot: {
        width: 3,
        height: 12,
        borderRadius: 4,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 2,
        marginBottom: 2,
    }
})