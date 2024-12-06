import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import filterData from './reducers/filterData';
import currentProductData from './reducers/currentProductData';
import cartData from './reducers/cartData';
import catalogData from './reducers/catalogData';
import storeData from './reducers/storeData';
import recommendationData from './reducers/recommendationData';

const rootReducer = combineReducers({
    currentProductData: currentProductData,
    filterData: filterData,
    cartData: cartData,
    catalogData: catalogData,
    storeData: storeData,
    recommendationData: recommendationData
});

{/* alert!! key: root ? */}

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
