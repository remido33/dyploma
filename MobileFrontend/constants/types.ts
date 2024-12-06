
export type ProductVariantType = {
    id: number,
    title: string,
    image: string,
    quantity: number,
    size?: string,
    color?: string,
    price: string,
}

export type ProductDataType = {
    id: number,
    title: string,
    available: boolean,
    vendor?: string,
    minPrice: number,
    maxPrice: number,
    mainImage: string,
    images: string[],
    variants: ProductVariantType[],
    selectedVariantId?: null | number,
    selectedColor?: null | string,
}

export type CollectionType = {
    id: string,
    title: string,
    ref: string,
    children: { 
        id: string, 
        title: string,
        ref: string,
    }[]
}

export type FilterOptionType = {
    id: string,
    key: string,
    count: number,
}

export type SelectedOptionsType = {
    [label: string]: {
        id: string,
        key: string,
    }[],
}

export type FilterDataType = {
    selectedOptions: SelectedOptionsType,
}

export type CartDataType = {
    items: { 
        variantId: number, 
        productId: number, 
        quantity: number,
    }[],
}

export type TranslationKeys =
  | 'home'
  | 'menu'
  | 'search'
  | 'search_input'
  | 'cart'
  | 'view_all_results'
  | 'view_all_results_for'
  | 'no_products_found'
  | 'add_to_cart'
  | 'out_of_stock'
  | 'added_to_cart'
  | 'choose_size'


export type FilterType = {
    label: string,
    values: FilterOptionType[],
}

export type SortingType = 'relevance' | 'priceHighToLow' | 'priceLowToHigh' | 'newest';

export type CatalogDataType = {
    items: ProductDataType[],
    filters: FilterType[],
    offset: number,
    sorting: SortingType,
    total: number,
}

export type FilterMappingType = { 
    title: string, 
    field: string
}

export type TabType = "Men's" | "Women's";

export type StoreDataType = {
    filtersMapping: FilterMappingType[],
    collections: CollectionType[],
    fields: string[],
    tabs: TabType[],
    selectedTab: TabType,
}

export type RecommendationDataType = {
    items: number[],
}

export type ReduxStateType = {
    currentProductData: ProductDataType,
    filterData: FilterDataType,
    cartData: CartDataType,
    catalogData: CatalogDataType,
    storeData: StoreDataType,
    recommendationData: RecommendationDataType,
}

export type CartItemType = ProductVariantType & {
    productTitle: string,
    productId: number,
};