import { CartDataType } from "@/constants/types";
import { AnyAction } from "redux";


const initialState: CartDataType = {
    items: [],
};

const ADD_ITEM_TO_CART = 'ADD_ITEM_TO_CART';
const REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART';
const UPDATE_ITEM_QUANTITY_IN_CART = 'UPDATE_ITEM_QUANTITY_IN_CART';


export default function cartData(state = initialState, action: AnyAction): CartDataType {

    switch (action.type) {

        case ADD_ITEM_TO_CART:
            const { productId, variantId } = action.payload;

            if(state.items.find(i => i.variantId === variantId)) {
                return state;
            }

            return {
                ...state,
                items: [
                    ...state.items,
                    { productId, variantId, quantity: 1 }
                ]
            }

        case REMOVE_ITEM_FROM_CART:
            const { variantId: toDeleteId, } = action.payload;
            
            return {
                ...state,
                items: [...state.items.filter((i) => !(i.variantId === toDeleteId))],
            }

        case UPDATE_ITEM_QUANTITY_IN_CART: 
            const { variantId: toUpdateId, change, maxQuantity } = action.payload;
            
            return {
                ...state,
                items: state.items.map((item) =>
                    item.variantId === toUpdateId
                        ? {
                            ...item,
                            quantity: 
                                change === 'inc'
                                    ? Math.min(item.quantity + 1, maxQuantity) // if incrememt
                                    : change === 'max'
                                        ? maxQuantity // if max
                                        : Math.max(1, item.quantity - 1) // if decrement
                        }
                        : item
                ),
            }
        default:
            return state;
    }
}

export const addItemToCart = (payload: { productId: number, variantId: number }) => ({
    type: ADD_ITEM_TO_CART,
    payload: payload,
});

export const removeItemFromCart = (payload: { variantId: number }) => ({
    type: REMOVE_ITEM_FROM_CART,
    payload: payload,
});

export const updateItemQuantityInCart = (payload: { 
    variantId: number, 
    change: 'inc' | 'dec' | 'max',
    maxQuantity: number,
}) => ({
    type: UPDATE_ITEM_QUANTITY_IN_CART,
    payload: payload,
})