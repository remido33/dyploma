import Icons from '@/assets/Svg';
import Spinner from '@/components/Spinner';
import ThemedText from '@/components/themed/Text';
import Colors from '@/constants/Colors';
import React, { FC, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, useColorScheme, } from 'react-native';
// import Spinner from '../custom/Spinner';
// import BackButton from '../custom/BackButton';
// import { useNavigation } from '@react-navigation/native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';

type Props = {
    route: any,
}

const Checkout: FC<Props> = ({ route }) => {

    const colorScheme = useColorScheme();
    const { text, background, tint } = Colors[colorScheme ?? 'light'];

    const [loading, setLoading] = useState<boolean>(true);
    // const { goBack } = useNavigation();
    const { webUrl } = route.params;

    const handleWebViewMessage = (event: any) => {
        const message = event.nativeEvent.data;

        if (message.checkout_completed) {
            
        } 
        else if (!message.checkout_in_progress) {
            // goBack();
        }
       
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => null} style={styles.goBack}>
                <Icons.ChevronLeft color={text} />
                <ThemedText style={styles.goBackText}>Go Back</ThemedText>
            </TouchableOpacity>
            <WebView
                source={{ uri: webUrl }}
                startInLoadingState={true}
                // renderLoading={() => <ActivityIndicator size="large" color={tint} />}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={handleWebViewMessage}
                onLoadEnd={() => setLoading(false)}
            />
            {loading && (
                <View style={[styles.spinner, { backgroundColor: background }]}>
                    <Spinner />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    spinner: {
        top: 100,
        position: 'absolute',
        height: '100%',
        width: '100%',
        paddingBottom: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    goBack: {
        marginTop: 16,
        marginLeft: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    goBackText: {
        marginLeft: 8,
    }
})

export default Checkout;
