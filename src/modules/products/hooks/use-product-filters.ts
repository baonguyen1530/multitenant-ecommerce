"use client"

import { useQueryStates } from "nuqs";
import { params } from "../server/loaders";

export const useProductFilters = () => {
    return useQueryStates(params);
};