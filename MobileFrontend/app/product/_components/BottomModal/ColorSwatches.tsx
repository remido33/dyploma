import {FC } from "react";
import {FlatList, TouchableOpacity, Text, View, StyleSheet, Image, useColorScheme} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colorMapping from "../../../../constants/colorMapping";
import CustomImage from "@/components/CustomImage";
import { setSelectedColor } from "../../../../store/reducers/currentProductData";
import { ReduxStateType } from "../../../../constants/types";
import Colors from "@/constants/Colors";
import ThemedText from "@/components/themed/Text";
// import colors from "../../../../constants/colors";
// import { CheckOn } from "../../../../assets/Svg";

const ColorSwatches: FC = () => {

    const colorScheme = useColorScheme();
    const { secondary, border, tint, background } = Colors[colorScheme ?? 'light'];

    const dispatch = useDispatch();
    const { selectedColor, variants } = useSelector((state: ReduxStateType) => state.currentProductData);
    const colorOptions = [...new Set(variants.map(variant => variant.color || ""))].filter(color => color !== "");

    const onPress = (color: string) => {
        if(selectedColor !== color) {
            dispatch(setSelectedColor({ color: color }))
        }
    };

    return (
        <View style={styles.wrapper}>
            <FlatList
                horizontal
                scrollEnabled={false}
                data={colorOptions}
                renderItem={({ item }) => {
                    const isSelected = selectedColor === item;
                    const colorSource = (colorMapping[item as keyof typeof colorMapping]) || item;
                    const isHex = colorSource.includes('#');
                    const isImage = colorSource.includes('http'); 
                    
                    const whiteSwatch = colorSource === '#fffff';
                    return (
                        <TouchableOpacity onPress={() => onPress(item)} style={styles.swatch} activeOpacity={1}>
                            <View>
                                {isHex && 
                                    <View style={[
                                        styles.roundSwatch,
                                        whiteSwatch && { borderWidth: 1, borderColor: border },
                                        { backgroundColor: colorSource }]}
                                    />
                                }

                                {isImage && 
                                    <View style={ styles.roundSwatch}>
                                        <CustomImage source={{ uri: colorSource }} />
                                    </View>
                                }

                                {!isHex && !isImage && 
                                    <View 
                                        style={[
                                            styles.defaultSwatch,
                                            { borderColor: border },
                                            isSelected && { backgroundColor: tint }
                                        ]}
                                    >
                                        <ThemedText style={[
                                            isSelected && { color: background, },
                                            styles.swatchText
                                        ]}>
                                            {colorSource}
                                        </ThemedText>
                                    </View>
                                }
                                {isSelected && (isHex || isImage) && 
                                    <View style={styles.swatchSelected}>
                                        {/* 
                                        <CheckOn stroke={whiteSwatch ? colors.gray800 : colors.light} />
                                        */}
                                    </View>
                                }
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item) => item}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 10,
        paddingHorizontal: 16,
    },
    swatch: {
        marginRight: 12,
    },
    roundSwatch: {
        width: 32,
        height: 32,
        borderRadius: 50,
        overflow: 'hidden',
    },
    defaultSwatch: {
        height: 32,
        paddingHorizontal: 14,
        borderRadius: 16,
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 1,
    },
    swatchSelected: {
        position: 'absolute',
        zIndex: 1,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    swatchText: { 
        fontSize: 13, 
        fontFamily: 'HostGrotesk_Regular', 
    }
})

export default ColorSwatches;