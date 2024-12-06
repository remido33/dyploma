import {FC, useMemo} from "react";
import {View, StyleSheet, FlatList, TouchableWithoutFeedback, useColorScheme} from "react-native";
import { FilterOptionType, SelectedOptionsType } from "@/constants/types";
import ThemedText from "@/components/themed/Text";
import Colors from "@/constants/Colors";

type Props = {
    label: string,
    data: FilterOptionType[],
    onOptionClick: ({ id, key }: { id: string, key: string, }) => void,
    selectedOptions: SelectedOptionsType,
}

const RowFacet: FC<Props> = ({ label, data, onOptionClick, selectedOptions }) => {

    const isFound = (itemId: string) => 
        selectedOptions[label]?.find(({ id }) => id === itemId);

    const sortedData = useMemo(() => {
        const selectedItems = data.filter((item) => isFound(item.id));
        const unselectedItems = data.filter((item) => !isFound(item.id));

        return [...selectedItems, ...unselectedItems];
    }, [data, selectedOptions[label]]);


    return (
        <FlatList
            data={sortedData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
                <RowFacetItem
                    key={item.id}
                    item={item}
                    onPress={() => onOptionClick({
                        id: item.id,
                        key: item.key,
                    })}
                    isSelected={isFound(item.id)}
                />
            )}
        />
    )
};

type ItemProps = {
    item: FilterOptionType,
    isSelected: any,
    onPress: () => void,
}

const RowFacetItem: FC<ItemProps> = ({ item, isSelected, onPress, }) => {

    const colorScheme = useColorScheme();
    const { tint, border } = Colors[colorScheme ?? 'light'];

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={[
                styles.item,
                { borderColor: border },
                isSelected && { backgroundColor: tint, }
            ]}
            >
                <ThemedText>
                    {item.key}
                </ThemedText>
            </View>
        </TouchableWithoutFeedback>
    )
};

const styles = StyleSheet.create({
    item: {
        marginRight: 16,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
})

export default RowFacet;