import {FC, useCallback, useMemo} from "react";
import {View, Text, ScrollView, StyleSheet, useColorScheme} from "react-native";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView, TouchableOpacity} from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedVariant } from "../../../store/reducers/currentProductData";
import { ReduxStateType } from "../../../constants/types";
import { getSizeOptions } from "../../../store/selectors/currentProductData";
import Colors from "@/constants/Colors";
import ThemedText from "@/components/themed/Text";
import ThemedView from "@/components/themed/View";
import translate from "@/helpers/translate";

type Props = {
    sizeSelectorRef: any,
}

const SizeSelector: FC<Props> = ({ sizeSelectorRef, }) => {

    const colorScheme = useColorScheme();
    const { tint, secondary, border, background } = Colors[colorScheme ?? 'light'];

    const dispatch = useDispatch();
    const snapPoints = useMemo(() => [1, 460], []);
    const { selectedVariantId, } = useSelector((state: ReduxStateType) => state.currentProductData);
    const sizeOptions = useSelector(getSizeOptions);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
                pressBehavior='collapse'
                enableTouchThrough={false}
            />
        ), []
    );

    const onSizeSwatchPress = (id: number) => {
        dispatch(setSelectedVariant({ id }))
    }

    return (
        <BottomSheet
            ref={sizeSelectorRef}
            snapPoints={snapPoints}
            handleIndicatorStyle={{ backgroundColor: '' }} // colors.gray600 
            enableHandlePanningGesture={false}
            backdropComponent={renderBackdrop}
            backgroundStyle={{
                backgroundColor: background
            }}
        >
            <BottomSheetView>
                <ThemedView style={styles.wrapper}>
                    <ThemedText type="subtitle">
                        {translate('choose_size')}
                    </ThemedText>
                    <ScrollView style={[styles.sizesList, { borderTopColor: border, }]}>
                        {
                            sizeOptions.map(({ id, size, quantity: available, }, index: number,) => 
                                <TouchableOpacity 
                                    activeOpacity={1}
                                    key={index} 
                                    onPress={() => available && onSizeSwatchPress(id)}
                                    style={styles.sizeItem}
                                >
                                    <View style={[
                                            styles.sizeCheckbox, 
                                            { borderColor: tint, },
                                            id === selectedVariantId && { backgroundColor: tint }, 
                                            !available && { borderColor: border, }
                                        ]} 
                                    />
                                    <ThemedText 
                                        style={[
                                            styles.sizeText,
                                            !available && { color: secondary, }
                                        ]}
                                    >
                                            {size}
                                    </ThemedText>
                                    {!available && (
                                        <ThemedText style={[styles.outText, { color: secondary, }]}>
                                            Out of stock!
                                        </ThemedText>
                                    )}
                                </TouchableOpacity>
                            )
                        }
                    </ScrollView>
                </ThemedView>
            </BottomSheetView>
        </BottomSheet>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 20,
    },
    sizesList: {
        borderTopWidth: 1,
        marginTop: 10,
        paddingTop: 16,
        height: '100%',
    },
    sizeItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    sizeCheckbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderRadius: 50,
    },
    sizeText: {
        marginLeft: 12,
        textTransform: 'capitalize',
        fontFamily: 'HostGrotesk_Regular',
    },
    outText: {
        fontFamily: 'HostGrotesk_Regular',
        fontSize: 13,
        marginLeft: 'auto',
    },
})

export default SizeSelector;