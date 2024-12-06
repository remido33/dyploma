import {FC } from "react";
import {FlatList, TouchableOpacity, Text, View, StyleSheet, useColorScheme} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedVariant } from "@/store/reducers/currentProductData";
import { ReduxStateType } from "@/constants/types";
import { getSizeOptions } from '@/store/selectors/currentProductData';
import Colors from "@/constants/Colors";
import ThemedText from "@/components/themed/Text";
// import colors from "../../../../constants/colors";

const SizeSwatches: FC = () => {
    const colorScheme = useColorScheme();
    const { border, background, tint } = Colors[colorScheme ?? 'light'];
    const dispatch = useDispatch();
    const { selectedVariantId } = useSelector((state: ReduxStateType) => state.currentProductData);
    const sizeOptions = useSelector(getSizeOptions);
    
    const onSizeItemPress = (id: number) => {
        dispatch(setSelectedVariant({ id, }))
    };

    return (
        <View style={[styles.wrapper, { borderBottomColor: border, }]}>
            <ThemedText style={{ fontSize: 13.4, }}>
                Available sizes:
            </ThemedText>
            <FlatList
                style={{ marginTop: 12, }}
                horizontal
                scrollEnabled={false}
                data={sizeOptions}
                renderItem={({ item }) => {
                    const { id, size, quantity: available, } = item;
                    const swatchSelected = available && id === selectedVariantId;

                    return (
                        <TouchableOpacity 
                            activeOpacity={1}
                            onPress={() => available && onSizeItemPress(id)}
                            style={[
                                styles.sizeSwatch,
                                { borderColor: border },
                                !available && styles.sizeSwatchDisabled,
                                !!swatchSelected && { backgroundColor: tint }
                            ]}
                        >
                            <ThemedText 
                                style={[
                                    styles.sizeText,
                                    !!swatchSelected && { color: background }
                                ]}
                            >
                                {size}
                            </ThemedText>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 28,
        paddingBottom: 28,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    sizeSwatch: {
        position: 'relative',
        paddingVertical: 5,
        paddingHorizontal: 14,
        minWidth: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 1,
    },
    sizeSwatchDisabled: {
        opacity: .4,
    },
    sizeText: {
        fontSize: 12.4,
        textTransform: 'capitalize',
        fontFamily: 'HostGrotesk_Regular', 
    },
})

export default SizeSwatches;