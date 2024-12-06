
import { ProductDataType, } from "@/constants/types";
import { AnyAction } from "redux";

const initialState: ProductDataType = {
    id: 0,
    vendor: '',
    title: '',
    minPrice: 0,
    available: false,
    maxPrice: 0,
    mainImage: '',
    images: [],
    variants: [],
    selectedColor: null,
    selectedVariantId: null,
};

const SET_PRODUCT_STATE = 'SET_PRODUCT_STATE';
const SET_SELECTED_VARIANT = 'SET_SELECTED_VARIANT';
const SET_SELECTED_COLOR = 'SET_SELECTED_COLOR';

export default function currentProductData(state = initialState, action: AnyAction): ProductDataType {

    switch (action.type) {
            
        case SET_PRODUCT_STATE:
            const { 
                id,
                selectedVariantId, 
                available, 
                vendor,
                title, 
                minPrice, 
                images,
                mainImage,
                variants, 
            }: ProductDataType = action.payload;
            
            const selectedColor = variants.find((i) => i?.color)?.color || null;
            
            return {
                ...state,
                id,
                selectedVariantId,
                vendor,
                available,
                title,
                minPrice,
                mainImage,
                images,
                variants,
                selectedColor,
            }

        case SET_SELECTED_VARIANT:
            const { id: variantId, } = action.payload;

            return {
                ...state,
                selectedVariantId: variantId,
            }

        case SET_SELECTED_COLOR:
            const { color, } = action.payload;

            return {
                ...state,
                selectedColor: color,
                selectedVariantId: null,
            }
        default:
            return state;
    }
}

export const setProductState = (payload: ProductDataType) => ({
    type: SET_PRODUCT_STATE,
    payload: payload,
})

export const setSelectedVariant = (payload: { id: number, }) => ({
    type: SET_SELECTED_VARIANT,
    payload: payload,
});

export const setSelectedColor = (payload: { color: string, }) => ({
    type: SET_SELECTED_COLOR,
    payload: payload,
});