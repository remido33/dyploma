import {FC} from "react";
import {StyleSheet, Text, TextInput, View, useColorScheme} from "react-native";
import Colors from "@/constants/Colors";
import ThemedText from "./themed/Text";
import translate from "@/helpers/translate";

type Props = {
    searchText: string,
    handleInputChange: (text: string) => void,
    onSubmit?: () => void,
}

const SearchInput: FC<Props> = ({ searchText, handleInputChange, onSubmit }) => {

    const colorScheme = useColorScheme();
    const { text, tint, secondary } = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.inputContainer}>
            {searchText?.length === 0 && (
                <ThemedText style={[styles.placeholderText, { color: secondary }]}>
                    {translate('search_input')}
                </ThemedText>
            )}
            <TextInput
                style={[styles.input, { color: text }]}
                onChangeText={handleInputChange}
                value={searchText}
                selectionColor={tint}
                onSubmitEditing={onSubmit}
                returnKeyType="done"
            />
        </View>
    )
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
    },
    input: {
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
    },
    placeholderText: {
        position: 'absolute',
    },
})

export default SearchInput;