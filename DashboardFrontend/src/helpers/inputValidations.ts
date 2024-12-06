

const validations: Record<string, (value: string) => string | null> = {
    email: (value: string) => {
        return value.includes(' ') ? 'Email should not contain spaces' : null;
    },
    field: (value: string) => {
        return value.includes(' ') ? 'Field should not contain spaces' : null;
    },
    default: () => null,
};

export default validations;