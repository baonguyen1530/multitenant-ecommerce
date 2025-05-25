"use client"

import { useTRPC } from "@/trpc/client";
import { Categories } from "./categories";
import { SearchInput } from "./search-input"
import { useSuspenseQuery } from "@tanstack/react-query";

export const SearchFilters = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

    return(
        // px-4: adds horizontal padding
        // lg:pxx-12: adds horizontal padding of 3rem, This overrides px-4 on large screens
        // py-8: adds vertical padding
        // border-b: adds a bottom border using the default border color
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
            backgroundColor: "F5F5F5",
        }}>
            <SearchInput />
            <div className="hidden lg:block">
                <Categories data = {data}></Categories>
            </div>
        </div>
    );
};

export const SearchFiltersLoading = () => {
    return(
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
            backgroundColor: "F5F5F5",
        }}>
            <SearchInput disabled />
            <div className="hidden lg:block">
                <div className="h-11" />
            </div>
        </div>
    );
};