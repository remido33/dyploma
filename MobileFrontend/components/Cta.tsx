import { FC } from "react";
import { TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import ThemedText from "./themed/Text";
import Colors from "@/constants/Colors";

type Props = {
    children?: React.ReactNode,
    onPress: () => void,
    text: string,
    disabled?: boolean,
}

const Cta: FC<Props> = ({ children, onPress, text, disabled = false }) => {

    const colorScheme = useColorScheme();
    const { background, tint, secondary, } = Colors[colorScheme ?? 'light'];

    return (
        <TouchableOpacity 
            onPress={disabled ? undefined : onPress}
            style={[
                styles.wrapper, 
                { backgroundColor: disabled ? secondary : tint }
            ]}
        >
            {
            children ? children : 
                <ThemedText 
                    style={{
                        color: background, 
                        fontFamily: 'HostGrotesk_SemiBold',
                    }}
                >
                    {text}
                </ThemedText>
            }
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        height: 48,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },

})

export default Cta;