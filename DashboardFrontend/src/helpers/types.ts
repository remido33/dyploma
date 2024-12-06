
export type NavigationItem = {
    title: string,
    link: string,
}

export type FilterType = {
    id: string,
    field: string,
    title: string,
}

export type NestedCollectionType = {
    id: string,
    title: string,
    ref: string,
    loading?: boolean,
}

export type CollectionType = {
    id: string,
    title: string,
    ref: string,
    children: NestedCollectionType[],
    parentId?: string, // for nested collections
    loading?: boolean,
}

export type UpdateNestedType = {
    parentId: string,
    updatedCollections: NestedCollectionType[],
}

export type CollectionModalActionType = 'add' | 'add nested' | 'edit' | 'edit nested';

export type ErrorType = { 
    message: string, 
    status: number 
}

export type ProductTypeAnalytic = {
    id: number,
    title: string,
    count: string,
}

type Analytic = {
    total_count: string,
    date: string,
    [key: string]: string,
}

export type TableAnalytic = {
    value: string,
    count: string,
}

export type AnalyticsData = {
    views: Analytic[],
    atc: Analytic[],
    viewsPop: ProductTypeAnalytic[],
    atcPop: ProductTypeAnalytic[],
    terms: TableAnalytic[],
    purchases: Analytic[],
}