
import nextApi from '@/utils/nextApi';

const updateStore = async ({ storeId, key, value}: { storeId: string, key: string, value: string | Object, }) => {
    const res = await nextApi.patch(`/api/store/${storeId}`, {
        update: {
            [key]: value,
        },
    });
    return res;
};

export default updateStore;