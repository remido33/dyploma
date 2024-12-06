import { Tabs, useGlobalSearchParams, usePathname, useSegments, } from 'expo-router';
import React, { useEffect } from 'react';
import { HapticTab } from '@/components/HapticTab';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, StyleSheet, View } from 'react-native';
import translate from '@/helpers/translate';
import { resetCatalog } from '@/store/reducers/catalogData';
import { resetFilters } from '@/store/reducers/filterData';
import { setStore } from '@/store/reducers/storeData';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { STORE_ID } from '@/constants/options';
import { TranslationKeys } from '@/constants/types';

const TabLabel = ({ label, focused, color }: { label: TranslationKeys, focused: boolean, color: string }) => (
    <>
        <Text style={{ color, ...styles.tabBarLabel }}>{translate(label)}</Text>
        {focused && <FocusedDot color={color} />}
    </>
);

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(resetCatalog());
        dispatch(resetFilters());
        
        const getStore = async () => {
            try {
                const { data } = await axios.get(`http://192.168.1.131:4001/store/${STORE_ID}`);
                const { filters, collections, fields }  = data;
                
                dispatch(setStore({ 
                    filters, 
                    collections,
                    fields,
                }));
                
            }
            catch(err) {
                console.log(err);
            }
        };

        getStore();
    }, []);
    
    const { tint, secondary, text, } =  Colors[colorScheme ?? 'light'];
    const params = useGlobalSearchParams();


    const getColor = (focused: boolean) => focused ? tint : secondary;
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: { 
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: tint,
                headerShown: false,
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: () => null,
                    tabBarLabel: ({ focused }) => 
                        <TabLabel 
                            label="home" 
                            focused={focused} 
                            color={getColor(focused)}
                        />,
                }}
            />
            <Tabs.Screen
                name="collections"
                options={{
                    tabBarIcon: () => null,
                    tabBarLabel: ({ focused, }) => {
                        
                        const isFocused = focused || !!params?.collectionId;
                        return (
                             
                            <TabLabel 
                                label="menu" 
                                focused={isFocused} 
                                color={getColor(isFocused)} 
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: () => null,
                    tabBarLabel: ({ focused, }) => {
                        
                        const isFocused = focused || !!params?.query;
                        
                        return (
                            <TabLabel 
                                label="search" 
                                focused={isFocused} 
                                color={getColor(isFocused)} 
                            />
                        )
                    }
                }}
            />

            <Tabs.Screen
                name="cart"
                options={{
                    tabBarIcon: () => null,
                    tabBarLabel: ({ focused, }) => 
                        <TabLabel 
                            label="cart" 
                            focused={focused} 
                            color={getColor(focused)} 
                        />,
                }}
            />
            <Tabs.Screen 
                name='results'
                options={{
                    href: null,
                }}
            />
    </Tabs>
    );
};

const FocusedDot = ({ color }: { color: string }) => (
    <View style={{ backgroundColor: color, ...styles.dot }} />
);

const styles = StyleSheet.create({
    tabBarLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        marginTop: -12,
        fontFamily: 'Montserrat_Medium',
    },
    dot: {
        marginTop: 6,
        width: 5,
        height: 5,
        borderRadius: '50%',
    },
});
