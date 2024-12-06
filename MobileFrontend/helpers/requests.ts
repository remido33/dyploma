import { ACTION_IDS, ITEMS_LIMIT, PLATFORM_IDS, STORE_ID } from "@/constants/options";
import apiInstance from "./apiInstance";
import { FilterMappingType, SelectedOptionsType, SortingType } from "../constants/types";
import { Platform } from 'react-native';

const joinFilters = ({ 
    filtersMapping, 
    selectedOptions 
}: {
    filtersMapping: FilterMappingType[],
    selectedOptions: SelectedOptionsType,
}) => filtersMapping?.map((filter) => {
    const key = filter.field;
    const selectedFilters = selectedOptions[key] || [];

    if(selectedFilters?.length > 0) {

        const formatted = selectedFilters.map(({ key }: { key: string }) => key).join(',')
        return `${key}=${formatted}`
    }
    
    return key;
})?.join('&');

export const getSearchResults = async ({ 
    offset, 
    sorting, 
    limit, 
    filtersMapping,
    query,
    selectedOptions,
    fields,
}: { 
    offset: number, 
    sorting: SortingType,
    limit?: number,
    query: string,
    filtersMapping: FilterMappingType[],
    selectedOptions: SelectedOptionsType,
    fields: string[],
}) => {

    const filters = joinFilters({ filtersMapping, selectedOptions });

    const { data } = await apiInstance.get(`/store/${STORE_ID}/products/search`, {
        params: {
            limit: limit ? limit : ITEMS_LIMIT,
            offset: offset,
            sortBy: sorting,
            platform: 1,
            query: query,
            aggs: filters,
            fields,
        }
    });

    return data;
};

export const getCollectionProducts = async ({ 
    offset, 
    sorting, 
    collectionId, 
    filtersMapping,
    selectedOptions,
    fields,
}: { 
    offset: number, 
    sorting: SortingType,
    collectionId: string,
    filtersMapping: FilterMappingType[],
    selectedOptions: SelectedOptionsType,
    fields: string[],
}) => {
    
    const filters = joinFilters({ filtersMapping, selectedOptions });

    const { data } = await apiInstance.get(`/store/${STORE_ID}/collections/${collectionId}/products`, {
        params: {
            limit: ITEMS_LIMIT,
            offset: offset,
            sortBy: sorting,
            platform: 1,
            aggs: filters,
            fields,
        }
    });

    return data;
};

export const getProduct = async ({ id }: { id: number, }) => {
    const { data } = await apiInstance.get(`/store/${STORE_ID}/products/${id}`);
    return data;
};

export const getMultipleProducts = async({ ids }: { ids: number[] }) => {
    const { data } = await apiInstance.get(`/store/${STORE_ID}/products?ids=${ids.join(',')}`);
    return data;
};

export const createCheckout = async({ 
    items,
}: {  
    items: {
        quantity: number, 
        variantId: number
    }[],
}) => {
    const { data } = await apiInstance.post(`/store/${STORE_ID}/checkout`, { items });

    return data;
};

export const sendAnalytic = {
    send: (endpoint: string, data: object) => {
        const platformId = PLATFORM_IDS[Platform.OS];
        apiInstance.post(`/analytics/${STORE_ID}/${endpoint}`, { platformId, ...data })
        .catch((error) => {
            console.error(`Failed to send analytics for ${endpoint}`, error);
        });;
    },

    action: ({ action, productId }: { action: keyof typeof ACTION_IDS; productId: number }) => {
        const actionId = ACTION_IDS[action];
        sendAnalytic.send("action", { actionId, productId });
    },

    purchase: ({ productIds }: { productIds: number[] }) => {
        sendAnalytic.send("purchase", { productIds });
    },

    term: ({ query }: { query: string }) => {
        sendAnalytic.send("term", { query });
    },
};
  
  
