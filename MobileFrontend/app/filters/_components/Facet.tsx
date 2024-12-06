import React, {FC} from 'react';
import RowFacet from "./facets/RowFacet";
import {handleFilterOption} from "@/store/reducers/filterData";
import {useDispatch, useSelector} from "react-redux";
import {CheckboxFacetWrapper, DefaultFacetWrapper} from "./wrappers";
import { FilterOptionType, ReduxStateType } from '@/constants/types';

type FacetProps = {
    label: string,
    type: 'CheckboxFacet' | 'RowFacet', // can be expanded with more facets
    title: string,
    data: FilterOptionType[],
};

const Facet: FC<FacetProps> = ({ label, type, title, data }) => {
    const dispatch = useDispatch();
    let ComponentToRender = null;

    switch (type) {
        case 'RowFacet':
            ComponentToRender = RowFacet;
            break; // can be expanded with more facets
    }

    const { selectedOptions } = useSelector((state: ReduxStateType) => state.filterData);

    const onOptionClick = ({ id, key }: { id: string, key: string }) => {
        dispatch(handleFilterOption({ label, id, key }));
    };

    const count = selectedOptions[label] ? selectedOptions[label].length : 0;

    return type !== 'CheckboxFacet' ?
        <DefaultFacetWrapper
            ComponentToRender={ComponentToRender}
            title={title}
            data={data}
            label={label}
            onOptionClick={onOptionClick}
            selectedOptions={selectedOptions}
            count={count}
        />
        :
        <CheckboxFacetWrapper
            label={label}
            title={title}
            data={data}
            count={count}
        />
};

export default Facet;
