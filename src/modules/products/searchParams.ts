import { createLoader, parseAsString, parseAsArrayOf } from "nuqs/server";

export const params = {
    minPrice: parseAsString
     .withOptions({
        clearOnDefault: true,
     }),
    maxPrice: parseAsString
     .withOptions({
        clearOnDefault: true,
     }),
    tags: parseAsArrayOf(parseAsString)
     .withOptions({
        clearOnDefault: true,
     }),
};