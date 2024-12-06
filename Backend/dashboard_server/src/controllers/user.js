const tryCatch = require("../../../shared_utils/tryCatch");
const { 
    createUserService,
    loginUserService,
    verifyUserService,
    deleteUserService,
    getUserStoresService,
    updateUserStoresService,
} = require("../services/user");

const createUserController = tryCatch(async (req, res) => {
    const { email, storeIds } = req.body;
    const stores = storeIds.split(',').filter(Boolean);
    const response = await createUserService({ email, stores, });

    res.status(201).json(response);
});

const loginUserController = tryCatch(async (req, res) => {
    const { email } = req.body;
    const data = await loginUserService({ email, })

    res.status(200).json(data);
});

const verifyUserController = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;
    const data = await verifyUserService({ id, token });

    res.status(200).json(data);
})

const deleteUserController = tryCatch(async (req, res) => {
    const { id } = req.params;
    await deleteUserService({ id });

    res.status(204).end();
});

const updateUserStoresController = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { storeIds } = req.body;
    const stores = storeIds.split(',').filter(Boolean);
    
    await updateUserStoresService({ id, stores, });

    res.status(204).end();
});

const getUserStoresController = tryCatch(async (req, res) => {
    const { id } = req.params;
    const response = await getUserStoresService({ id });
    res.status(200).json(response);
})


module.exports = {
    createUserController,
    loginUserController,
    verifyUserController,
    deleteUserController,
    updateUserStoresController,
    getUserStoresController,
};
