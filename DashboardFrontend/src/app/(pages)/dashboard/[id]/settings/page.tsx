"use client";

import { FC, useEffect, useState } from "react";
import styles from '@/styles/settings.module.css';
import nextApi from '@/utils/nextApi';
import InputWithCta from "@/components/InputWithCta";
import FilterSettings from "./_components/FilterSettings";
import CollectionSettings from './_components/CollectionSettings';
import { FilterType, CollectionType, ErrorType } from "@/helpers/types";
import { useNotifications } from '@/components/Notifications/Provider';
import updateStore from "@/helpers/updateStore";
import { usePathname } from 'next/navigation';

type StoreType = {
    filters: FilterType[],
    collections: CollectionType[],
    fields: string[],
};


const DashboardSettings: FC = () => {

    const [error, setError] = useState<ErrorType | null>(null)
    const [store, setStore] = useState<null | StoreType>(null);
    const { pushNotification } = useNotifications();
    const pathname = usePathname()
    const storeId = pathname.split('/')[2] || '';

    const onSubmit = async (key: string, value: any,) => {
        try {
            await updateStore({ storeId, key, value });
            pushNotification('Successfully updated');
        } catch (err: any) {
            pushNotification(err.message, true);
        }
    };

    useEffect(() => {
        const getStoreSettings = async () => {
            try {

                const { data } = await nextApi.get(`/api/store/${storeId}`);
                const { filters, collections, fields, } = data;
                
                setStore({
                    filters,
                    collections,
                    fields,
                });

            } catch(err: any) {
                const { status, message }: ErrorType = err;
                setError({ status, message });
            }
        };

        getStoreSettings();
    }, []);

    {/* 
    if(error) {
        throw new Error(error.message);
    };
    */}

    return (
        <>
            {store && (
                <div className={styles.wrapper}>
                    <section>
                        <h3>Collections</h3>
                        <p>Configute a list of your collections in app.</p>
                        <CollectionSettings
                            storeId={storeId}
                            collections={store.collections}
                        />
                    </section>
                    <section>
                        <h3>Filters</h3>
                        <p>Provide filters which will be shown in app.</p>
                        <FilterSettings
                            storeId={storeId}
                            filters={store.filters}
                        />
                    </section>
                    <section>
                        <h3>Fields</h3>
                        <p>Select retrieved fields for the product response on non-product pages (e.g. search, collections, etc.).</p>
                        <InputWithCta
                            label="Fields"
                            value={store.fields.join(',')}
                            placeholder='id,title,image,minPrice'
                            onSubmit={(value) => onSubmit('fields', value.split(',').filter(Boolean))}
                            hideLabel={true}
                        />
                    </section>
                </div>
            )}
        </>
    );
};

export default DashboardSettings;
