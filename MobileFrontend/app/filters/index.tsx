import { FC } from "react";
import { View, StyleSheet } from "react-native";
import Facet from "./_components/Facet";
import { useSelector } from "react-redux";
import { ReduxStateType } from "@/constants/types";

const FacetsScreen: FC = () => {
    const { filtersMapping } = useSelector((state: ReduxStateType) => state.storeData);
    const { filters } = useSelector((state: ReduxStateType) => state.catalogData);

    const sortedFilters = filters.sort((a, b) => 
        filtersMapping.findIndex(mapping => mapping.field === a.label) - 
        filtersMapping.findIndex(mapping => mapping.field === b.label)
    ).filter(({ label }) =>  filtersMapping.find(({ field }) => field === label));

    return (
        <View style={styles.container}>
            {
                sortedFilters.map((filter, index) => {
                    const elasticLabel = filter.label;
                    const title = filtersMapping.find(({ field }) => field === elasticLabel)?.title || 'Filter';

                    return (
                        <Facet
                            key={index}
                            label={elasticLabel}
                            type={index > 0 ? 'RowFacet' : 'CheckboxFacet'}
                            title={title}
                            data={filter.values}
                        />
                    );
                })
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 8,
    },
});

export default FacetsScreen;
