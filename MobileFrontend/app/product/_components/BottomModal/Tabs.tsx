import {Animated, View, StyleSheet, Text, TouchableWithoutFeedback, ScrollView, useColorScheme} from "react-native";
import {FC, useEffect, useRef, useState} from "react";
import Icons from "@/assets/Svg";
import ThemedText from "@/components/themed/Text";
import Colors from "@/constants/Colors";

// id: 1 should be description
const data = [
    {
        id: 1,
        title: 'Description',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Ipsum is simply dummy text of the printing.' +
            '\n\nLorem: ' +
            '\n- Ipsum is simply dummy text of the printing.' +
            '\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry .'
    },
    {
        id: 2,
        title: 'Shipping',
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`
    },
    {
        id: 3,
        title: 'Guarantee',
        description: `Random`
    },
    {
        id: 4,
        title: 'More info',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Ipsum is simply dummy text of the printing.' +
        '\n\nLorem: ' +
        '\n- Ipsum is simply dummy text of the printing.' +
        '\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry .'
    }
];

const initialViewHeight = data.length * 50;

const Tabs: FC = () => {

    const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
    const [viewHeight, setViewHeight] = useState<number>(initialViewHeight);

    const setSelectedTab = (id: null | number, height: number) => {
        
        const newHeight = id ? initialViewHeight + height + 108 : initialViewHeight;
        setViewHeight(newHeight);
        setSelectedTabId(id);
    }

    return (
        <ScrollView>
            <View style={{ height: viewHeight }}>
                {data.map(({ id, title, description }) =>
                    <TabItem
                        key={id}
                        id={id}
                        title={title}
                        description={description}
                        selectedTabId={selectedTabId}
                        setSelectedTab={setSelectedTab}
                    />
                )}
            </View>
        </ScrollView>
    )
};

type TabItemProps = {
    title: string,
    description: string,
    id: number,
    selectedTabId: number | null,
    setSelectedTab: (id: null | number, height: number) => void,
}

const TabItem: FC<TabItemProps> = ({ id, title, description, selectedTabId, setSelectedTab }) => {

    const colorScheme = useColorScheme();
    const { border, text } = Colors[colorScheme ?? 'light'];
    const isSelected = id === selectedTabId;
    const containerHeight = useRef(new Animated.Value(0)).current;
    const [height, setHeight] = useState(0);

    const setTextHeight = (value: number) => {
        if (!height) {
            setHeight(value);
        }
    }

    Animated.timing(containerHeight, {
        toValue: isSelected ? height : 0,
        duration: 200,
        useNativeDriver: false,
    }).start();

    return (
        <View>
            <TouchableWithoutFeedback onPress={() => setSelectedTab(isSelected ? null : id, height)}>
                <View 
                    style={[
                        styles.header, 
                        id === 1 && { borderTopWidth: 0, },
                        { borderTopColor: border, }
                    ]}
                >
                    <ThemedText style={styles.title}>
                        {title}
                    </ThemedText>
                    <View style={{ transform: [{ rotate: isSelected ? '180deg' : '0deg' }] }}>
                        <Icons.ArrowDown 
                            color={text}
                            width={20}
                            height={20}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <Animated.View style={{ height: containerHeight, overflow: 'hidden' }}>
                <ThemedText style={styles.secondaryText}>
                    {description}
                </ThemedText>
            </Animated.View>
            <Text style={[styles.secondaryText, { position: 'absolute', opacity: 0, pointerEvents: 'none', }]} onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setTextHeight(height + 16);
            }}>
                {description}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        borderTopWidth: 1,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 13.4,
        marginTop: 4,
    },
    secondaryText: {
        paddingHorizontal: 20,
        fontSize: 13,
        fontFamily: 'HostGrotesk_Regular',
    }
})

export default Tabs;
