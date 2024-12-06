import { FilterType, CatalogDataType, SortingType, ProductDataType } from "@/constants/types";
import { AnyAction } from "redux";

const initialState: CatalogDataType = {
    items: [],
    offset: 0,
    filters: [],
    sorting: 'relevance',
    total: 0,
};

const SET_CATALOG = 'SET_CATALOG';
const UPDATE_CATALOG_ITEMS = 'UPDATE_CATALOG_ITEMS';
const UPDATE_CATALOG_SORTING = 'UPDATE_CATALOG_SORTING';
const RESET_CATALOG = 'RESET_CATALOG';

export default function catalogData(state = initialState, action: AnyAction): CatalogDataType {

    switch (action.type) {

        case SET_CATALOG:

            const { items, filters, offset, total, } = action.payload;

            return {
                ...state,
                items,
                filters,
                offset,
                total,
            }
        
        case UPDATE_CATALOG_ITEMS: 
            const { newItems, offset: updatedOffset } = action.payload;
            
            return {
                ...state,
                offset: updatedOffset,
                items: [...state.items, ...newItems],
            };

        case RESET_CATALOG:
            return initialState;
        
        case UPDATE_CATALOG_SORTING:
            const { sorting } = action.payload;

            return {
                ...state,
                offset: 0,
                sorting: sorting,
            }

        default:
            return state;
    }
}

export const setCatalog = (payload: { 
    items: ProductDataType[], 
    filters: FilterType[],
    offset: number,
    total: number,
}) => ({
    type: SET_CATALOG,
    payload: payload,
});

export const updateCatalogItems = (payload: {
    newItems: ProductDataType[],
    offset: number,
}) => ({
    type: UPDATE_CATALOG_ITEMS,
    payload: payload,
});

export const updateCatalogSorting = (payload: {
    sorting: SortingType,
}) => ({
    type: UPDATE_CATALOG_SORTING,
    payload: payload,
});

export const resetCatalog = () => ({
    type: RESET_CATALOG,
})