import {StyleSheet, Text, TouchableWithoutFeedback, View, useColorScheme} from "react-native";
import React, {FC} from "react";
// import {ArrowRight} from "../../../../assets/Svg";
import { FilterOptionType, SelectedOptionsType, } from "@/constants/types";
import Icons from "@/assets/Svg";
import { Colors } from "react-native/Libraries/NewAppScreen";
import ThemedText from "@/components/themed/Text";

type DefaultFacetPropsType = {
    ComponentToRender: any,
    title: string,
    label: string,
    onOptionClick: ({ id, key }: { id: string, key: string, }) => void,
    data: FilterOptionType[],
    selectedOptions: SelectedOptionsType,
    count: number,
}

export const DefaultFacetWrapper: FC<DefaultFacetPropsType> = ({ ComponentToRender, title, data, label, onOptionClick, selectedOptions, count }) => {

    const colorScheme = useColorScheme();
    const { border } = Colors[colorScheme ?? 'light'];

    return (
        (
            <View style={[styles.wrapper, { borderColor: border, }]}>
                <View style={styles.header}>
                    <ThemedText>
                        {title} {count ? `(${count})` : null}
                    </ThemedText>
                </View>
                {ComponentToRender &&
                    <View style={styles.body}>
                        <ComponentToRender
                            data={data}
                            label={label}
                            onOptionClick={({ id, key }: { id: string, key: string, }) => 
                                onOptionClick({ id, key })
                            }
                            selectedOptions={selectedOptions}
                        />
                    </View>
                }
            </View>
        )
    )
}

type CheckboxFacetPropsType = {
    label: string,
    title: string,
    data: FilterOptionType[],
    count: number,
}

export const CheckboxFacetWrapper: FC<CheckboxFacetPropsType> = ({ label, title, data, count }) => {
    
    const colorScheme = useColorScheme();
    const { text, border } = Colors[colorScheme ?? 'light'];

    const onPress = () => null;

    {/* 
     navigate('CheckboxFacet',
        {
            label: label,
            title: title,
            data: data,
        }
    );
    */}
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View 
                style={[
                    styles.header, 
                    styles.checkboxFacetHeader,
                    { borderColor: border, }
                ]}
            >
                <ThemedText>
                    {title} {count && `(${count})`}
                </ThemedText>
    
                <Icons.ChevronRight color={text} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        paddingLeft: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkboxFacetHeader: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
    },
    body: {
        marginTop: 14,
    },
    arrow: {
        width: 24,
        height: 24,
    }
})