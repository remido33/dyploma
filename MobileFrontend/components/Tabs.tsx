
import { View, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import ThemedText from './themed/Text';
import Colors from '@/constants/Colors';
import { useDispatch, useSelector } from "react-redux";
import { ReduxStateType, TabType } from '@/constants/types';
import { setTab } from '@/store/reducers/storeData';

export default function Tabs() {
    const dispatch = useDispatch();
    const colorScheme = useColorScheme();
    const { tint, border, text, secondary } = Colors[colorScheme ?? 'light'];
    const { tabs, selectedTab } = useSelector((state: ReduxStateType) => state.storeData);

    return (
        <View style={[styles.container, { borderBottomColor: border }]}>
            {tabs.map((tab: TabType, index: number) => {

                const isSelected = selectedTab === tab;
                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        onPress={() =>  dispatch(setTab({ tab }))}
                        style={[
                            styles.tab, 
                            isSelected && { 
                                borderBottomColor: tint, 
                                borderBottomWidth: 1.5,
                            }
                        ]}
                    >
                        <ThemedText 
                            style={{ 
                                color: isSelected ? text : secondary,
                                fontSize: 13,
                            }}
                        >
                            {tab}
                        </ThemedText>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tab: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
        marginBottom: -1,
        paddingTop: 20,
        paddingBottom: 16,
    }
})