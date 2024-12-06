import {FlatList, StyleSheet, Text, View, useColorScheme} from "react-native";
import {FC} from "react";
import { SelectedOptionsType } from "@/constants/types";
import Colors from "@/constants/Colors";
import ThemedText from "@/components/themed/Text";

type Props = {
    selectedOptions: SelectedOptionsType,
    label: string,
}

const SelectedOptions: FC<Props> = ({ selectedOptions, label, }) => {

    const colorScheme = useColorScheme();
    const { border } = Colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.selectedOptions, { borderColor: border, }]}>
            <ThemedText style={{ marginRight: 8, }}>
                Selected:
            </ThemedText>
            {selectedOptions[label] && selectedOptions[label].length > 0 ? (
                <FlatList
                    horizontal
                    data={selectedOptions[label]}
                    renderItem={({ item, index }) =>
                        <ThemedText>
                            {item.key}
                            {index !== selectedOptions[label].length - 1 ? ', ' : ''}
                        </ThemedText>
                    }
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <ThemedText>None</ThemedText>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    selectedOptions: {
        borderBottomWidth: 1,
        marginBottom: 12,
        paddingTop: 22,
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 16,
    },
})

export default SelectedOptions;