import { createLoader, useQueryStates } from "nuqs";
import { parseAsString } from "nuqs/server";

export const params = {
    minPrice: parseAsString
        .withOptions({
            clearOnDefault: true,
        }),
    maxPrice: parseAsString
        .withOptions({
            clearOnDefault: true,
        }),
};

export const useProductFilters = () => {
    return useQueryStates(params);
};

export const loadProductFilters = createLoader(params);