import { CollectionType, FilterType, StoreDataType, TabType } from "@/constants/types";
import { AnyAction } from "redux";

const initialState: StoreDataType = {
    filtersMapping: [],
    collections: [],
    fields: [],
    tabs: ["Men's", "Women's"],
    selectedTab: "Men's",
};

const SET_STORE = 'SET_STORE';
const SET_TAB = 'SET_TAB';

export default function storeData(state = initialState, action: AnyAction): StoreDataType {

    switch (action.type) {
        case SET_STORE:
            
            const { filters, collections, fields } = action.payload;
            
            return {
                ...state,
                filtersMapping: filters,
                collections,
                fields: fields.join(','),
            }

        case SET_TAB: 
            const { tab } = action.payload;

            return {
                ...state,
                selectedTab: tab,
            }

        default:
            return state;
    }
}

export const setStore = (payload: { 
    filters: FilterType[], 
    collections: CollectionType[],
    fields: string[],
}) => ({
    type: SET_STORE,
    payload,
});

export const setTab = (payload: {
    tab: TabType,
}) => ({
    type: SET_TAB,
    payload,
});