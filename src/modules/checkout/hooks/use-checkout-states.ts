import { parseAsBoolean, useQueryStates } from "nuqs";

export const useCheckoutStates = () => {
    return useQueryStates({
        success: parseAsBoolean.withDefault(false).withOptions({
            clearOnDefault: true,   //Clear the user's input
        }),
        cancel: parseAsBoolean.withDefault(false).withOptions({
            clearOnDefault: true, 
        }),
    });
};