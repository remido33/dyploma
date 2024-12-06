import { RecommendationDataType } from "@/constants/types";
import { AnyAction } from "redux";

const initialState: RecommendationDataType = {
    items: [],
};

const ADD_ID_TO_RECOMMENDATION = 'ADD_RECOMMENDATION';

export default function cartData(state = initialState, action: AnyAction): RecommendationDataType {

    switch (action.type) {

        case ADD_ID_TO_RECOMMENDATION:
            const { productId } = action.payload;

            if(state.items.find((id) => id === productId)) {
                return state;
            }
            
            const updatedItems = [...state.items, productId];
            
            if (updatedItems.length > 5) {
                updatedItems.shift();
            }

            return {
                ...state,
                items: updatedItems
            };

        default:
            return state;
    }
}

export const addIdToRecommendation = (payload: { productId: number }) => ({
    type: ADD_ID_TO_RECOMMENDATION,
    payload: payload,
});
