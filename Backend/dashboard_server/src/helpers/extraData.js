const getError = require("../../../shared_utils/getError");

const plans = [
    { id: 1, value: 'basic' },
    { id: 2, value: 'advanced' }, 
];

const analyticActions = ['views', 'atc', 'viewsPop', 'atcPop'];

const getAnalyticsActionId = (type) => {

    switch(type) {
        case 'views':
        case 'viewsPop':
            return 1;
        case 'atc':
        case 'atcPop':
            return 2;
        default: 
            console.log('error type', type)
            throw getError(500, 'Analytics loading error.')
    }
};


const storeSettingsKeys = ['apiKey', 'filters', 'collections', 'fields'];


module.exports = {
    plans,
    analyticActions,
    storeSettingsKeys,
    getAnalyticsActionId,
}