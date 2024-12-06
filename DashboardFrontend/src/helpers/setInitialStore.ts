import nextApi from "@/utils/nextApi";

const setInitialStore = async () => {
    try {
        const { data } = await nextApi.get(`/api/user/stores`);
        
        console.log(data);
        if(data.length > 0) {
            const id = data[0].id;

            nextApi.post('/api/store/change', { 
                storeId: id,       
            }, { withCredentials: true })
                .then(() => window.location.href = `/dashboard/${id}`);

            return { ok: true, }
        }
        else {
            return { ok: false, message: 'No stores were found for user.'}
        }
    }
    catch (err: any) {
        return { ok: false, message: err.message }
    }   
};

export default setInitialStore;