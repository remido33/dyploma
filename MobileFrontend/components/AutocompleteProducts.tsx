import { FC } from "react";
import { ProductDataType } from "@/constants/types";
import { View, StyleSheet, FlatList, useColorScheme } from "react-native";
import ProductCard from "./ProductCard";
import PlaceholderCard from "./PlaceholderCard";
import translate from "@/helpers/translate";
import ThemedText from "./themed/Text";
import { router  } from "expo-router";

type Props = {
    items: ProductDataType[];
    loading: boolean,
    searchText: string,
};

const AutocompleteProducts: FC<Props> = ({ items, loading, searchText }) => {

    const colorScheme = useColorScheme();
    
    if (!loading && !items.length && searchText) {
        return (
            <ThemedText>
                {translate('no_products_found', { query: searchText })}
            </ThemedText>
        );
    }

    const data = loading ? Array(4).fill(null) : items;

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => (loading ? index.toString() : item.id.toString())}
            renderItem={({ item }) =>
                <View style={styles.item}>
                    {loading
                        ? <PlaceholderCard 
                            cardWidth={180}
                          /> 
                        : <ProductCard 
                            data={item} 
                            router={router} 
                            cardWidth={180}
                          />
                    }
                </View>
            }
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    item: { 
        marginRight: 16 
    },
});

export default AutocompleteProducts;
