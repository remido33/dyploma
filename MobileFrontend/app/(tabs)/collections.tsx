import ThemedSafeAreaView from "@/components/themed/SafeAreaView";
import ThemedText from "@/components/themed/Text";
import ThemedView from "@/components/themed/View";
import { CollectionType, ReduxStateType } from "@/constants/types";
import { Link } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Tabs from '@/components/Tabs';

export default function Collections() {
    
    const { collections } = useSelector((state: ReduxStateType) => state.storeData);
    
    const renderItem = ({ item }: { item: CollectionType }) => (
        <View key={item.ref} style={styles.parentContainer}>
            <Link href='/(tabs)/results?collectionId=1' style={styles.link}>
                <ThemedText 
                    style={[
                        styles.collectionTitle,
                        item.title.includes('Sale') && { color: '#ce0000' }
                    ]}
                >
                    {item.title}
                </ThemedText>
            </Link>
            {item?.children?.length > 0 && (
                <View style={styles.childContainer}>
                    {item.children.map((child) => (
                        <Link 
                            key={child.ref} 
                            href='/(tabs)/results?collectionId=1'
                            style={styles.link}
                        >
                            <ThemedText 
                                key={child.ref} 
                                style={styles.collectionTitle}
                            >
                                {child.title}
                            </ThemedText>
                        </Link>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <ThemedSafeAreaView>
            <ThemedView style={styles.container}>
                <Tabs />
                
                <FlatList
                    style={styles.list}
                    data={collections}
                    keyExtractor={(item) => item.ref}
                    renderItem={renderItem}
                />
            </ThemedView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        flex: 1,
    },
    list: {
        paddingTop: 32,
    },
    link: {
        paddingLeft: 40,
        paddingVertical: 10,
    },
    parentContainer: {
        marginBottom: 4,
    },
    childContainer: {
        paddingLeft: 24,
        marginBottom: 8,
    },
    collectionTitle: {
        textTransform: 'uppercase',
        fontSize: 13,
    },
});
