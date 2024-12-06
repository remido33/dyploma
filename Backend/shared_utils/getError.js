
const getError = (status, message, rest) => ({
    error: {
        timestamp: Date.now(),
        status: status,
        message: message,
        ...rest,
    }
});

module.exports = getError;