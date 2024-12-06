import PlaceholderCard from "@/components/PlaceholderCard";
import ThemedSafeAreaView from "@/components/themed/SafeAreaView";
import ThemedText from "@/components/themed/Text";
import { ITEMS_LIMIT } from "@/constants/options";
import { FilterType, ProductDataType, ReduxStateType } from "@/constants/types";
import { getCollectionProducts, getSearchResults } from "@/helpers/requests";
import { setCatalog, updateCatalogItems } from "@/store/reducers/catalogData";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Facets from "@/components/Facets";
import ProductCard from "@/components/ProductCard";
import Actions from "@/components/Actions";
import { router } from "expo-router";

const horizontalPadding: number = 0;
const spaceBetweenCards: number = 8;

const Results = () => {
    const dispatch = useDispatch();
    const cardWidth: number = (Dimensions.get('window').width - horizontalPadding * 2 - spaceBetweenCards) / 2;

    const { selectedOptions } = useSelector((state: ReduxStateType) => state.filterData);
    const { selectedTab, filtersMapping, fields } = useSelector((store: ReduxStateType) => store.storeData);
    const { items, filters, offset, total, sorting, } = useSelector((state: ReduxStateType) => state.catalogData);
    const { collectionId, query, }: { collectionId: string, query: string, } = useLocalSearchParams();

    const [loadedWithError, setLoadedWithError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData(0);
        setRefreshing(false);
    };


    const fetchData = async (offset: number) => {
        
        try {
            const { total, filters, items } = collectionId ? 
                await getCollectionProducts({ 
                    offset, 
                    sorting, 
                    collectionId, 
                    filtersMapping, 
                    selectedOptions,
                    fields,
                }) : await getSearchResults({ 
                    offset,
                    sorting,
                    query,
                    filtersMapping: [
                        ...filtersMapping,
                        { title: 'Type', field: 'type_wc' }
                    ],
                    selectedOptions: { 
                        ...selectedOptions,
                        "type_wc": [
                            { id: `type_wc.${selectedTab}`, key: `${selectedTab}*` }
                        ] 
                    },
                    fields,
                });
            
            if(!offset) {
                
                dispatch(setCatalog({
                    total,
                    filters: filters?.length > 0 ? filters.map((filter: FilterType) => ({
                        ...filter,
                        values: filter.values.map((value) => ({
                            ...value,
                            id: `${filter.label}_${value.key.split(' ').join('-')}`
                        }))
                    })) : [],
                    items,
                    offset,
                }))
            }
            else {
                dispatch(updateCatalogItems({
                    newItems: items,
                    offset,
                }))
            }


        } catch (err) {
            if (!loadedWithError) {
                console.log(err);
                setLoadedWithError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreData = () => {
        const newOffset = offset + 1;
        
        if(!(total && newOffset * ITEMS_LIMIT >= total)) {
            fetchData(newOffset);
        }
    };

    useEffect(() => {
        fetchData(0);
    }, [sorting, selectedOptions]);

    if(items && items.length === 0 && !loading) {
        return <></>;
        // <ZeroResults query={query} />
    };

    return (
        <ThemedSafeAreaView style={styles.wrapper}>
            {loadedWithError ? (
                <ThemedText>
                    Oops! Something went wrong
                </ThemedText>
            ) : loading ? (
                <View style={{ marginTop: 32, marginLeft: horizontalPadding, }}>
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6]}
                        renderItem={() => (
                            <View style={{ margin: spaceBetweenCards / 2 }}>
                                <PlaceholderCard 
                                    cardWidth={cardWidth} 
                                />
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    />
                </View>
            ) : (
                <View style={styles.container}>
                    {filters.filter((i) => i.values.length > 0).length > 0 && <Facets />}
                    <FlatList
                        style={styles.results}
                        data={items}
                        renderItem={({ item }) => (
                            <View style={{ margin: spaceBetweenCards / 2, marginBottom: 16, }}>
                                <ProductCard 
                                    cardWidth={cardWidth} 
                                    data={item}
                                    router={router}
                                />
                            </View>
                        )}
                        keyExtractor={(item: ProductDataType) => item.id.toString()}
                        numColumns={2}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        ListHeaderComponent={<Actions />}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        onEndReached={fetchMoreData}
                        onEndReachedThreshold={0.2}
                    />
                </View>
            )}
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        paddingTop: 16,
        flex: 1,
        marginBottom: -32, // what?
    },
    results: {
        flex: 1,
        marginTop: 0,
        paddingLeft: (-spaceBetweenCards / 2) + horizontalPadding,
    }
});

export default Results;