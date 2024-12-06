import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {StyleSheet, Text, View, useColorScheme} from "react-native";
import SizeSwatches from "./SizeSwatches";
import ColorSwatches from "./ColorSwatches";
import Tabs from "./Tabs";
import {FC, useCallback} from "react";
import { useSelector } from "react-redux";
import { ReduxStateType } from "../../../../constants/types";
import { getPrice } from "../../../../store/selectors/currentProductData";
import Colors from "@/constants/Colors";
import ThemedText from "@/components/themed/Text";

type Props ={
    snapPoints: number[],
    bottomModalRef: any,
}

const BottomModal: FC<Props> = ({ snapPoints, bottomModalRef, }) => {

    const colorScheme = useColorScheme();
    const { background, tint, secondary } = Colors[colorScheme ?? 'light'];

    const { title, vendor, selectedColor } = useSelector((state: ReduxStateType) => state.currentProductData);
    const price = useSelector(getPrice);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
                pressBehavior='collapse'
                enableTouchThrough={false}
            />
        ),
        []
    );

    return (
        <BottomSheet
            ref={bottomModalRef}
            snapPoints={snapPoints}
            handleIndicatorStyle={{ backgroundColor: tint }}
            enableHandlePanningGesture={false}
            backdropComponent={renderBackdrop}
            backgroundStyle={{
                backgroundColor: background,
            }}
            style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: .2,
                shadowRadius: 8,
                elevation: 4,
            }}
        >
            <BottomSheetView>
                <View>
                    <View style={styles.header}>
                        <View>
                            <ThemedText style={[styles.brand, { color: secondary, }]}>
                                {vendor}
                            </ThemedText>
                            <ThemedText style={styles.title}>
                                {title}
                            </ThemedText>
                        </View>
                        <ThemedText style={styles.price}>
                            {price} uah
                        </ThemedText>
                    </View>
                    <ColorSwatches />
                </View>

                <SizeSwatches />
                <Tabs />
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 8,
        paddingHorizontal: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    brand: {
        marginBottom: 2,
        fontSize: 11,
        textTransform: 'uppercase',
    },
    title: {
        fontFamily: 'HostGrotesk_Regular',
        fontSize: 16,
    },
    price: {
        fontFamily: 'HostGrotesk_Regular',
    }
});

export default BottomModal;