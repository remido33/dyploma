import ThemedSafeAreaView from "@/components/themed/SafeAreaView";
import ThemedText from "@/components/themed/Text";
import ThemedView from "@/components/themed/View"; 
import SearchInput from "@/components/SeachInput";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import Colors from "@/constants/Colors";
import Tabs from "@/components/Tabs";
import { ProductDataType, ReduxStateType } from "@/constants/types";
import { useSelector } from "react-redux";
import { getSearchResults } from "@/helpers/requests";
import AutocompleteProducts from "@/components/AutocompleteProducts";
import translate from "@/helpers/translate";
import { router } from "expo-router";
import Icons from "@/assets/Svg";

export default function Search() {
    const timerRef = useRef<any>(null);
    const { fields, selectedTab } = useSelector((store: ReduxStateType) => store.storeData);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');
    const colorScheme = useColorScheme();
    const { border, text } = Colors[colorScheme ?? 'light'];

    const [products, setProducts] = useState<ProductDataType[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { items } = await getSearchResults({
                offset: 0,
                sorting: 'relevance',
                limit: 8,
                query: searchText,
                filtersMapping: [
                    { title: 'Type', field: 'type_wc' }
                ],
                selectedOptions: { 
                    "type_wc": [
                        { id: `type_wc.${selectedTab}`, key: `${selectedTab}*` }
                    ],
                },
                fields,
            });
            
            setProducts(items);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            fetchData();
        }, 500);

        return () => {
            clearTimeout(timerRef.current);
        };
    }, [searchText, selectedTab]);

    const onSubmit = () => {

        router.push({
            pathname: '/results',
            params: {
                query: searchText,
            }
        })
    }

    return (
        <ThemedSafeAreaView>
            <ThemedView style={styles.container}>
            
                <View style={[
                    styles.header,
                    { borderColor: border,}
                ]}>
                    <SearchInput 
                        searchText={searchText} 
                        handleInputChange={setSearchText}
                        onSubmit={onSubmit}
                    />
                </View>
                <Tabs />

                <View style={styles.viewAllWrapper}>
                    {products?.length > 0 && (
                        <TouchableOpacity activeOpacity={1} onPress={onSubmit} style={styles.viewAll}>
                            <View>
                                <ThemedText style={{ fontSize: 13, lineHeight: 24 }}>
                                    {searchText?.length 
                                        ? translate('view_all_results_for', { query: searchText })
                                        : translate('view_all_results')
                                    }
                                </ThemedText>
                            </View>
                            <Icons.ArrowRight color={text} />
                        </TouchableOpacity>
                    )}
                </View>
        
                <View style={styles.products}>
                    <AutocompleteProducts 
                        items={products} 
                        loading={loading} 
                        searchText={searchText} 
                    />
                </View>

        
            </ThemedView>
        </ThemedSafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 16,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: .8,
    },
    products: {
        paddingLeft: 20,
    },
    viewAllWrapper: {
        marginLeft: 'auto',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        marginRight: 20,
    },
    viewAll: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    }
})