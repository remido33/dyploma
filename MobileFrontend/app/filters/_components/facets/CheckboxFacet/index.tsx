import {FC, useEffect, useState} from "react";
import {View, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {handleFilterOption, clearFilterByLabel} from "@/store/reducers/filterData";
import {useDispatch, useSelector} from "react-redux";
import Item from "./Item";
import SearchInput from "@/components/SeachInput";
import SelectedOptions from "./SelectedOptions";
import { FilterOptionType, ReduxStateType } from "@/constants/types";
import ThemedText from "@/components/themed/Text";

const CheckboxFacet: FC = ({ route, navigation }: any) => {
    const dispatch = useDispatch();
    const selectedOptions = useSelector((state: ReduxStateType) => state.filterData.selectedOptions);
    const [searchText, setSearchText] = useState<string>('');
    const { label, title, data, } = route.params;

    const [filteredOptions, setFilteredOptions] = useState(data.map((option: FilterOptionType) => ({
        ...option,
        match: true,
    })));

    {/* 
    useEffect(() => {
        navigation.setOptions({
            title: title || 'Filter facets',
            headerRight: () => {
                if (selectedOptions[label]?.length > 0) {
                    return (
                        <TouchableOpacity onPress={onClear}>
                            <ThemedText>
                                Clear options
                            </ThemedText>
                        </TouchableOpacity>
                    );
                } else {
                    return null;
                }
            },
        });
    }, [navigation, selectedOptions, title]);
    */}

    const onClear = () => {
        dispatch(clearFilterByLabel({
            label: label,
        }))
    }

    const handleInputChange = (text: string) => {
        setSearchText(text);
        const filtered = filteredOptions.map((option: FilterOptionType) => ({
            ...option,
            match: option.key.toLowerCase().includes(text.toLowerCase()),
        }));
        setFilteredOptions(filtered);
    };

    const onOptionClick = ({ id, key }: { id: string, key: string, }) => {
        dispatch(handleFilterOption({ label, id, key, }));
    };

    return (
        <View style={styles.container}>
            <SearchInput
                searchText={searchText}
                handleInputChange={handleInputChange}
            />
            <SelectedOptions
                selectedOptions={selectedOptions}
                label={label}
            />
            <FlatList
                horizontal={false}
                data={filteredOptions}
                renderItem={({ item }) => {
                    const selected = selectedOptions[label]?.some((i) => i.id === item.id);

                    return (
                        <Item
                            item={item}
                            onPress={() => onOptionClick({
                                id: item.id,
                                key: item.key,
                            })}
                            matched={!item.match && searchText.length > 0}
                            selected={selected}
                        />
                    )
                }}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
})

export default CheckboxFacet;