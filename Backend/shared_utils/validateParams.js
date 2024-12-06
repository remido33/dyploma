const getError = require("./getError");

const validateParams = (params) => (req, res, next) => {
    const missingParams = [];
    const invalidParams = [];

    params.forEach((param) => {
        const { key, value, type, defaultValue, validate } = param;
        let paramValue;

        if (key === 'param') {
            paramValue = req.params[value];
        } else if (key === 'query') {
            paramValue = req.query[value];
            // Convert query parameters to numbers if the type is 'number'
            if (type === 'number' && paramValue !== undefined) {
                paramValue = Number(paramValue);
            }
        } else if (key === 'body' && req.body) {
            paramValue = req.body[value];
        } else {
            paramValue = undefined;
        }

        // Apply default value if the parameter is missing
        if (paramValue === undefined && defaultValue !== undefined) {
            paramValue = defaultValue;
        }

        // Custom validation function
        if (validate && typeof validate === 'function') {
            const validationError = !validate(paramValue, req);
            
            if (validationError) {
                invalidParams.push(`${value} at ${key}`);
                return;
            }
        }

        if (paramValue === undefined) {
            missingParams.push(`${value} at ${key}`);
        } else if (type && typeof paramValue !== type) {
            invalidParams.push(`${value} at ${key} (invalid type)`);
        } else if (type === 'number' && isNaN(paramValue)) {
            invalidParams.push(`${value} at ${key} (not a valid number)`);
        }
    });

    if (missingParams.length > 0 || invalidParams.length > 0) {
        const errorMessages = [];

        if (missingParams.length > 0) {
            const missingParamNames = missingParams.join(', ');
            errorMessages.push(`Missing parameter(s): ${missingParamNames}`);
        }

        if (invalidParams.length > 0) {
            const invalidParamNames = invalidParams.join(', ');
            errorMessages.push(`Invalid parameter(s): ${invalidParamNames}`);
        }

        throw getError(400, errorMessages.join('. '));
    }
    next();
};

module.exports = validateParams;
