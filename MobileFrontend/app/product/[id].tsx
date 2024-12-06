import {FC, useCallback, useEffect, useRef, useState} from "react";
import {View, StyleSheet, useWindowDimensions, TouchableOpacity, Animated, useColorScheme} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import { setProductState } from "@/store/reducers/currentProductData";
import { ProductDataType } from "@/constants/types";
import { addItemToCart } from "@/store/reducers/cartData";
import { ReduxStateType } from "@/constants/types";
import { getProduct, sendAnalytic } from "@/helpers/requests";
import { addIdToRecommendation } from "@/store/reducers/recommendationData";
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from "expo-router";
import SizeSelector from "./_components/SizeSelector";
import ImageSlider from "./_components/ImageSlider";
import Icons from "@/assets/Svg";
import BottomModal from "./_components/BottomModal";
import Colors from "@/constants/Colors";
import ThemedText from "@/components/themed/Text";
import translate from "@/helpers/translate";
import Cta from "@/components/Cta";


const ProductScreen: FC = () => {

    const colorScheme = useColorScheme();
    const { secondary, tint, background, border, text } = Colors[colorScheme ?? 'light'];

    const { id }: { id: string, } = useLocalSearchParams();
    const productId = parseInt(id);

    const { height: screenHeight } = useWindowDimensions();
    const { selectedVariantId, selectedColor, available } = useSelector((state: ReduxStateType) => state.currentProductData);

    const [loading, setLoading] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertPosition] = useState<Animated.Value>(new Animated.Value(300));
    
    const snapPoints = [selectedColor ? 230 : 194, 536];
    const bottomModalRef = useRef<any>(null);
    const sizeSelectorRef = useRef<any>(null);
    
    const dispatch = useDispatch();
    
    const onAtcPress = () => {
        if(!selectedVariantId) {
            sizeSelectorRef.current?.expand();
        }
        else {
            sizeSelectorRef.current?.collapse();
            bottomModalRef.current?.collapse();
            
            dispatch(addItemToCart({
                productId,
                variantId: selectedVariantId,
            }));

            sendAnalytic.action({ 
                productId,
                action: 'atc', 
            });
            
            showSuccessAlert();
        }
    }

    const showSuccessAlert = () => {
        setShowAlert(true);
        Animated.timing(alertPosition, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            )
            setTimeout(() => {
                Animated.timing(alertPosition, {
                    toValue: 300,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setShowAlert(false);
                });
            }, 2000);
        });
    };

    const setProductData = useCallback(async () => {
        setLoading(true);
        try {
            const { id, vendor, available, title, minPrice, maxPrice, mainImage, images, variants }: ProductDataType = await getProduct({ id: productId });
            dispatch(setProductState({
                id, vendor, available, title, minPrice, maxPrice, mainImage, images, variants
            }));
        } catch (err) {
            console.log('Failed to fetch product data:', err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {        
        setProductData();
        dispatch(addIdToRecommendation({ productId }))
    }, [productId]);

    return !loading &&  (
        <View style={styles.container}>

            {true && (
                <Animated.View 
                    style={[
                        styles.successAlert, 
                        { 
                            transform: [{ translateX: alertPosition }], 
                            backgroundColor: colorScheme === "light" ? tint : background,
                        },
                        
                    ]}
                > 
                    <ThemedText style={[styles.successAlertText, { color: background, }]}>
                        {translate('added_to_cart')}
                    </ThemedText>
                </Animated.View>
            )}
            <View style={{ height: screenHeight - (selectedColor ? 230 : 200) }}>
                <ImageSlider />
            </View>
            
            {/* Go Back */}
            <TouchableOpacity onPress={() => null} style={styles.backButton}> 
                <Icons.ChevronLeft color={text} />
            </TouchableOpacity>
            
            <BottomModal
                bottomModalRef={bottomModalRef}
                snapPoints={snapPoints}
            />

            <SizeSelector 
                sizeSelectorRef={sizeSelectorRef} 
            />

            <View 
                style={[
                    styles.atcWrapper, 
                    { backgroundColor: background, borderTopColor: border }
                ]}
            >  
                <Cta 
                    onPress={onAtcPress} 
                    text={available ? translate('add_to_cart') : translate('out_of_stock')} 
                    disabled={!available}
                />
                {/* 
                <TouchableOpacity 
                    style={[
                        styles.atcButton,
                        { backgroundColor: !available ? secondary : tint },
                    ]} 
                    onPress={available ? onAtcPress : undefined}
                >
                   
                    <ThemedText 
                        style={{ 
                            color: background, 
                            fontFamily: 'HostGrotesk_SemiBold',
                        }}
                    > 
                        {available ? translate('add_to_cart') : translate('out_of_stock')}
                    </ThemedText>
                </TouchableOpacity>
                */}
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    successAlert: {
        position: 'absolute',
        top: 74,
        right: 0,
        paddingVertical: 14,
        paddingHorizontal: 16,
        justifyContent: 'center',
        zIndex: 2,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    successAlertText: {
        textAlign: 'center',
        fontSize: 13.4,
    },
    backButton: {
        position: 'absolute',
        top: 72,
        left: 8,
        zIndex: 0,
        paddingRight: 10,
        paddingBottom: 10,
    },
    atcWrapper: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopWidth: 1,
        paddingVertical: 16,
        paddingHorizontal: 20,
        paddingBottom: 42,
        zIndex: 1,
    },
    atcButton: {
        height: 48,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },

})

export default ProductScreen;