import { FC, useCallback, useState } from "react";
import { View, Text , StyleSheet, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CartItemType, ProductDataType, ReduxStateType } from "@/constants/types";
import { createCheckout, getMultipleProducts } from "@/helpers/requests";
import { removeItemFromCart } from "@/store/reducers/cartData";
import { useFocusEffect } from '@react-navigation/native';
import Cta from "@/components/Cta";
import ThemedText from "@/components/themed/Text";
import Item from '@/components/CartItem';
import ThemedSafeAreaView from "@/components/themed/SafeAreaView";

const Cart: FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    // const { navigate }: any = useNavigation();
    const [cartVariants, setCartVariants] = useState<CartItemType[]>([]);
    const { items: userItems } = useSelector((state: ReduxStateType) => state.cartData);
    const imageWidth = Dimensions.get('window').width * 0.26;
    
    const fetchCartData = async () => {
        setLoading(true);
        const data = await getMultipleProducts({ 
            ids: userItems.map(({ productId }) => productId) 
        });

        const variants = userItems.map(({ variantId }) => {
            const product = data.find((i: ProductDataType) =>
                i.variants.some(({ id }) => id === variantId)
            );

            if (product) {
                return {
                    productTitle: product.title,
                    productId: product.id,
                    ...product.variants.find(({ id }: { id: number }) => id === variantId),
                }
            }
        });

        const missingItems = userItems.filter(({ variantId }) => 
            !variants.find(({ id }: { id: number }) => id === variantId));
        
        if (missingItems.length > 0) {
            missingItems.forEach(({ variantId }: { variantId: number }) => {
                dispatch(removeItemFromCart({ 
                    variantId 
                }));
            })
        }
        setCartVariants(variants);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (userItems.length > 0) {
                fetchCartData();
            }
            else {
                setCartVariants([]);
            }
        }, [])
    );

    const onProceed = async () => {
        const items = cartVariants.map(({ id }) => ({
            variantId: id,
            quantity: userItems.find(({ variantId }) => variantId === id)!.quantity,
        }));

        
        try {
            const { webUrl } = await createCheckout({ items }); 
            {/* 
            navigate('Checkout', { 
                webUrl, 
                productIds: cartVariants.map(({ productId }) => productId) 
            });
            */}
        }
        catch(err) {
            console.log(err);
        };
    };

    const total = userItems
        .map(({ variantId, quantity }) => {
            const foundVariant = cartVariants.find(({ id }) => id === variantId);
            if (foundVariant && foundVariant.quantity > 0) {
                return parseFloat(foundVariant.price) * quantity;
            }
            return 0;
        })
        .reduce((acc, price) => acc + price, 0)

    const formattedTotal = Number.isInteger(total) ? total.toFixed(0) : total.toFixed(2);

    return (
        <ThemedSafeAreaView style={styles.container}>

            {loading && <ActivityIndicator style={styles.spinner} size='small' /> }
            {!loading && cartVariants.length > 0 && (
                <>
                    <FlatList
                        data={[...cartVariants].sort((a) => (a.quantity === 0 ? 1 : -1))}
                        renderItem={({ item }) =>
                            <Item
                                data={item}
                                imageWidth={imageWidth}
                            />
                        }
                        keyExtractor={(item) => item.id.toString()}
                        style={{ paddingTop: 32, }}
                    />

                    <View style={styles.footer}>
                        <ThemedText style={styles.totalText}>
                            Total: {formattedTotal} uah
                        </ThemedText>
                        <Cta 
                            onPress={onProceed} 
                            text='Proceed checkout' 
                        /> 
                    </View>
                </>
            )}

            {!loading && cartVariants.length === 0 && (
                <ThemedText>
                    {`Your cart is empty!\nWanna check the catalog?`}
                </ThemedText>
            )}
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    spinner: {
        marginTop: '70%',
    },
    container: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        // backgroundColor: colors.light,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    checkoutButton: {
        // backgroundColor: colors.dark,
        height: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkoutText: {
        // color: colors.light,
        textAlign: 'center',
        fontFamily: 'Primary-600',
        fontSize: 15,
    },
    totalText: {
        textAlign: 'right',
        marginBottom: 16,
        fontFamily: 'Secondary-600',
        fontSize: 15,
    },
});

export default Cart;
