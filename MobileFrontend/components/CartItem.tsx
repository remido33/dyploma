import {Text, TouchableOpacity, View, StyleSheet, Alert, useColorScheme} from "react-native";
import {FC} from "react";
import CustomImage from "@/components/CustomImage";
import { CartItemType, ReduxStateType } from "@/constants/types";
import { useDispatch, useSelector } from "react-redux";
import { removeItemFromCart, updateItemQuantityInCart } from "@/store/reducers/cartData";
import Colors from "@/constants/Colors";
import Icons from "@/assets/Svg";
import ThemedText from "./themed/Text";
// import {MinusIcon, PlusIcon, TrashIcon} from "../../../assets/Svg";

type Props = {
    data: CartItemType,
    imageWidth: number,
};

const CartItem: FC<Props> = ({ data, imageWidth }) => {

    const colorScheme = useColorScheme();
    const { border, secondary, tint, } = Colors[colorScheme ?? 'light'];

    // variant info
    const { items: userItems } = useSelector((state: ReduxStateType) => state.cartData);
    const { productTitle, productId, id, price, image, color, size, quantity: maxQuantity }: CartItemType = data;
    const oof = maxQuantity === 0;

    const dispatch = useDispatch();
    
    const onDelete = () => {
        return Alert.alert('Confirmation', 'Are you sure you want to delete?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: () => dispatch(removeItemFromCart({ variantId: id, })),
                style: 'destructive',
            },
        ]);
    }
    
    const onQuantityUpdate = (change: 'inc' | 'dec' | 'max') => {
        dispatch(updateItemQuantityInCart({
            variantId: id,
            maxQuantity,
            change,
        }))
    }

    const currentQuantity = userItems.find(({ variantId }) => variantId === id)?.quantity || 1;

    if(currentQuantity > maxQuantity && maxQuantity > 0) {
        dispatch(updateItemQuantityInCart({ 
            variantId: id, 
            change: 'max', 
            maxQuantity, 
        }))
    }

    return (
        <View style={[styles.wrapper, { borderColor: border, }]}>
            <View 
                style={{
                    width: imageWidth, 
                    height: imageWidth * 1.3, 
                    opacity: oof ? .5 : undefined 
                }}
            >
                <CustomImage
                    source={{ uri: image, }}
                />
            </View>
            <View style={styles.content}>
                <View style={styles.contentHeader}>
                    <View>
                        <ThemedText>
                            {productTitle}
                        </ThemedText>
                        <ThemedText style={{ marginTop: 2, }}>
                            {Math.round(parseFloat(price))} uah
                        </ThemedText>
                    </View>
                    <TouchableOpacity onPress={onDelete} style={{ marginTop: -3, }}>
                        <Icons.Trash color={tint} />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentOptions}>

                    <View style={styles.optionWrapper}>
                        <Text style={styles.optionTitle}>
                            Color:
                        </Text>
                        <Text style={styles.optionValue}>{color}</Text>
                    </View>

                    <View style={[styles.optionWrapper, { marginTop: 16, }]}>
                        <Text style={styles.optionTitle}>
                            Size:
                        </Text>
                        <Text style={styles.optionValue}>
                            {size}
                        </Text>
                    </View>

                    {!oof && (
                        <View style={styles.quantityWrapper}>
                            <Text style={styles.optionTitle}>Quantity:</Text>
                            <View style={styles.quantityCta}>
                                <TouchableOpacity onPress={() => onQuantityUpdate('dec')}>
                                    <Icons.Minus 
                                        color={maxQuantity > 1 ? tint : secondary} 
                                    />
                                </TouchableOpacity>
                                <Text style={styles.quantityNum}>
                                    {currentQuantity}
                                </Text>
                                <TouchableOpacity onPress={() => onQuantityUpdate('inc')}>
                                    <Icons.Plus 
                                        color={maxQuantity !== currentQuantity ? tint : secondary} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {oof && (
                        <ThemedText>
                            Product is out of stock.
                        </ThemedText>
                    )}
                </View>

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 16,
        marginHorizontal: 16,
        borderBottomWidth: 1,
    },
    contentOptions: {
        marginTop: 20,
    },
    optionWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    optionTitle: {
        width: 80,
    },
    optionValue: {
        textTransform: 'capitalize',
    },
    quantityWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    quantityNum: {
        width: 40,
        textAlign: 'center',
    },
    quantityCta: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        paddingTop: 4,
        paddingLeft: 16,
        flex: 1,
    },
    contentHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
})

export default CartItem;