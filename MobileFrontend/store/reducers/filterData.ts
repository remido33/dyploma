import { FilterDataType, FilterOptionType, SelectedOptionsType } from "@/constants/types";
import { AnyAction } from "redux";

const initialState: FilterDataType = {
    selectedOptions: {}, // Use an object to store facets and their selected facets
};

// { "label": [ { "id": 1, "value": "value" }, ... ] }

const RESET_FILTERS = 'RESET_FILTERS';
const HANDLE_FILTER_OPTION = 'HANDLE_FILTER_OPTION';
const CLEAR_FILTER_BY_LABEL = 'CLEAR_FILTER_BY_ID';

export default function filterData(state = initialState, action: AnyAction): FilterDataType {

    switch (action.type) {

        case RESET_FILTERS:
            return {
                ...state,
                selectedOptions: {},
            }
            
        case CLEAR_FILTER_BY_LABEL:
            const { label: clearedlabel } = action.payload;

            return {
                ...state,
                selectedOptions: {
                    ...state.selectedOptions,
                    [clearedlabel]: [],
                }
            }

            case HANDLE_FILTER_OPTION:
                const { label, id: optionId, key: optionKey } = action.payload;
            
                const facetOptions = state.selectedOptions[label] || [];
            
                const updatedOptions = facetOptions.some((opt) => opt.id === optionId)
                    ? facetOptions.filter((opt) => opt.id !== optionId) // If exists, remove it
                    : [...facetOptions, { id: optionId, key: optionKey }]; // If not, add it
            
                let newSelectedOptions: SelectedOptionsType = { ...state.selectedOptions };
            
                if (updatedOptions.length === 0) {
                    delete newSelectedOptions[label]; // Remove the label if updatedOptions is empty
                } else {
                    newSelectedOptions[label] = updatedOptions; // Update the label with new options
                }
            
                return {
                    ...state,
                    selectedOptions: newSelectedOptions,
                };

        default:
            return state;
    }
}

export const handleFilterOption = (payload: { 
    label: string, 
    id: string, 
    key: string, 
}) => ({
    type: HANDLE_FILTER_OPTION,
    payload: payload,
});

export const clearFilterByLabel = (payload: { label: number, }) => ({
    type: CLEAR_FILTER_BY_LABEL,
    payload: payload,
});

export const resetFilters = () => ({
    type: RESET_FILTERS,
})

