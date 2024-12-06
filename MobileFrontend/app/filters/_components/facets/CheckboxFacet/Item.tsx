import ThemedText from "@/components/themed/Text";
import Colors from "@/constants/Colors";
import {FC} from "react";
import {StyleSheet, TouchableWithoutFeedback, View, useColorScheme} from "react-native";

type Props = {
    item: any,
    onPress: () => void,
    matched: boolean,
    selected: boolean,
}

const Item: FC<Props> = ({ item, onPress, matched, selected, }) => {

    const colorScheme = useColorScheme();
    const { tint, border } = Colors[colorScheme ?? 'light'];
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={[
                styles.item,
                matched ? { height: 0, overflow: 'hidden' } : null
            ]}>
                <View 
                    style={[
                        styles.checkbox,
                        { borderColor: border, },
                        selected && { borderColor: tint, backgroundColor: tint}
                    ]}
                >
                    <View style={styles.checkboxInner} />
                </View>

                <ThemedText>
                    {item.key}
                </ThemedText>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 48,
    },
    checkbox: {
        width: 20,
        borderWidth: 1,
        height: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 4,
        height: 4,
    },
});

export default Item;