import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import { screenOptions } from '@/constants/options';
import {Provider} from "react-redux";
import { store, persistor } from "../store";
import { PersistGate } from 'redux-persist/integration/react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        Montserrat_Medium: require('../assets/fonts/Montserrat-Medium.ttf'),
        HostGrotesk_Regular: require('../assets/fonts/HostGrotesk-Regular.ttf'),
        HostGrotesk_SemiBold: require('../assets/fonts/HostGrotesk-SemiBold.ttf'),
    });
    
    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, }}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={screenOptions} />
                            <Stack.Screen name="product/[id]" options={screenOptions} />
                            <Stack.Screen name="+not-found" options={screenOptions}  />
                        </Stack>
                        <StatusBar style="auto" />
                    </ThemeProvider>
                </PersistGate>
            </Provider>
        </GestureHandlerRootView>
    );
}
