import { parseAsArrayOf, parseAsString } from "nuqs/server";
import type { SearchParams } from "nuqs/server";

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

export const loadProductFilters = async (searchParams: Promise<SearchParams>) => {
    const resolvedParams = await searchParams;
    return {
        minPrice: params.minPrice.parseServerSide(resolvedParams),
        maxPrice: params.maxPrice.parseServerSide(resolvedParams),
        tags: params.tags.parseServerSide(resolvedParams),
    };
}; 