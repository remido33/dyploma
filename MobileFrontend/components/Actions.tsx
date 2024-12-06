import React, { FC, useState, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, Animated, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType, SortingType } from '@/constants/types';
import Icons from '@/assets/Svg';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/themed/Text';
import { updateCatalogSorting } from '@/store/reducers/catalogData';

const sortOptions: { title: string, key: SortingType }[] = [
    { 
        title: 'Relevance',
        key: 'relevance',
    },
    { 
        title: 'Price: Low to High',
        key: 'priceLowToHigh'
    },
    { 
        title: 'Price: High to Low',
        key: 'priceHighToLow', 
    },
    { 
        title: 'Most new', 
        key: 'newest', 
    },
];

type SortOptionType = {
    title: string,
    onPress: () => void,
}

const SortOption: FC<SortOptionType> = ({ title, onPress, }) => {

    return (
        <TouchableOpacity onPress={onPress} style={styles.sortOption}>
            <ThemedText style={{ fontSize: 13, paddingVertical: 2, }}>
                {title}
            </ThemedText>
        </TouchableOpacity>
    );
};


const Actions: FC= () => {

    const colorScheme = useColorScheme();
    const { text, border } = Colors[colorScheme ?? 'light'];

    const dispatch = useDispatch();
    const { total, sorting } = useSelector((state: ReduxStateType) => state.catalogData);
    const currSorting = sortOptions.find((i) => i.key === sorting)?.title || 'Current';
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownHeight = useRef(new Animated.Value(0)).current;

    const toggleDropdown = () => {
        const newValue = dropdownVisible ? 0 : (sortOptions.length - 1) * 34;
        Animated.timing(dropdownHeight, {
            toValue: newValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setDropdownVisible(!dropdownVisible);
    };

    const onPress = (key: SortingType) => {
        dispatch(updateCatalogSorting({ 
            sorting: key 
        }));
        toggleDropdown();
    }

    return (
        <>
            <View style={[styles.actions, { borderTopColor: border, }]}>
                <ThemedText style={{ fontSize: 13, }}>
                    Showing {total} results
                </ThemedText>
                <TouchableOpacity onPress={toggleDropdown}>
                    <View style={styles.sort}>
                        <ThemedText style={styles.sortingLabel}>
                            {currSorting}
                        </ThemedText>
                        <View style={{ transform: [{ rotate: dropdownVisible ? '180deg' : '0deg' }] }}>
                            <Icons.ArrowDown 
                                color={text}
                                width={20}
                                height={20}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.sortDropdown, { height: dropdownHeight }]}>
                <FlatList
                    data={sortOptions.filter((i) => i.key !== sorting)}
                    renderItem={({ item }) => (
                        <SortOption
                            key={item.key}
                            title={item.title}
                            onPress={() => onPress(item.key)}
                        />
                    )}
                />
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    actions: {
        borderTopWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 16,
    },
    sortingLabel: {
        marginRight: 8,
        fontSize: 13,
    },
    sort: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortDropdown: {
        marginLeft: 'auto',
        marginRight: 46,
    },
    sortOption: {
        paddingBottom: 14,
    },
})

export default Actions;