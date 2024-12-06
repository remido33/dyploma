import {FC} from "react";
import {StyleSheet, TouchableOpacity, View, useColorScheme} from "react-native";
import {useSelector} from "react-redux";
import { ReduxStateType } from "@/constants/types";
import Icons from "@/assets/Svg";
import ThemedText from "@/components/themed/Text";
import { Link, router } from "expo-router";
import Colors from "@/constants/Colors";


const Facets: FC = () => {

    const colorScheme = useColorScheme();
    const { text, secondary } = Colors[colorScheme ?? 'light'];

    const { selectedOptions } = useSelector((state: ReduxStateType) => state.filterData);
    
    const filtersApplied = Object.keys(selectedOptions)
        .filter(key => Array.isArray(selectedOptions[key]) && selectedOptions[key].length > 0)
        .length;


    return (
        <View style={styles.facets}>
            <Link href="/filters">
                <View style={styles.filters}>
                    <Icons.Facets color={text} />
                    <ThemedText style={{ marginLeft: 8, }}>
                        Filters
                    </ThemedText>
                </View>
            </Link>
            <ThemedText style={{ fontSize: 13, color: secondary, }}>
                {filtersApplied} Filters Applied
            </ThemedText>
        </View>
    )
};

const styles = StyleSheet.create({
    facets: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16,
        paddingLeft: 14,
        paddingBottom: 14,
    },
    filters: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
})

export default Facets;