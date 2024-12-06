import { TranslationKeys } from '@/constants/types';
import { getLocales } from 'expo-localization';


type Translations = {
  [languageCode: string]: Record<TranslationKeys, string>;
};

const translations: Translations = {
  en: {
    home: 'Home',
    menu: 'Menu',
    search: 'Search',
    cart: 'Cart',
    view_all_results: 'View all results',
    view_all_results_for: 'View all results for "{query}"' ,
    no_products_found: 'Oops! No products found for "{query}".',
    add_to_cart: 'Add to Cart',
    out_of_stock: 'Out of Stock',
    added_to_cart: 'Added to Cart!',
    choose_size: 'Choose size',
    search_input: 'Search...',
  },
};

const currentLocale: string = getLocales()[0].languageCode || 'en';

const translate = (
    key: TranslationKeys, 
    params: Record<string, string> = {}
): string => {
    const language = translations[currentLocale] ? currentLocale : 'en';
    let translation = translations[language][key] || translations['en'][key];

    if (!translation) {
        console.warn(`Translation missing for key: '${key}' in language: '${language}'`);
        translation = `{${key}}`; 
    }

    Object.keys(params).forEach((param) => {
        translation = translation.replace(`{${param}}`, params[param]);
    });

    return translation;
};

export default translate;
