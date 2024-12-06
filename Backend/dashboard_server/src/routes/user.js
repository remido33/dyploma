const router = require('express').Router();
const { 
    createUserController,
    verifyUserController,
    loginUserController,
    updateUserStoresController,
    getUserStoresController,
    deleteUserController,
} = require("../controllers/user");
const validateParams = require("../../../shared_utils/validateParams");
const { isEmail, isStringOfNumbersSeparatedByComma } = require('../../../shared_utils/validators');

router.post(
    '/',
    validateParams([
        { 
            key: 'body', 
            value: 'email', 
            validate: (value) => isEmail(value),
        },
        {
            key: 'body',
            value: 'storeIds',
            validate: (value) => isStringOfNumbersSeparatedByComma(value),
        }
    ]), 
    createUserController
);

router.post(
    '/login',
    validateParams([
        { 
            key: 'body', 
            value: 'email', 
            validate: (value) => isEmail(value),
        },
    ]),
    loginUserController,
);

router.post(
    '/:id/verify',
    validateParams([
        {
            key: 'body',
            value: 'token',
            validate: (value) => value.toString().length === 6,
        }
    ]),
    verifyUserController,
);

router.delete(
    '/:id',
    deleteUserController,
);

router.patch(
    '/:id/stores',
    validateParams([
        {
            key: 'body',
            value: 'storeIds',
            validate: (value) => isStringOfNumbersSeparatedByComma(value),
        }
    ]),
    updateUserStoresController,
);

router.get(
    '/:id/stores',
    getUserStoresController,
)

module.exports = router;