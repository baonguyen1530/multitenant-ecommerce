import { CustomCategory } from "../types";
import { Categories } from "./categories";
import { SearchInput } from "./search-input"

interface Props{
    data: CustomCategory[];
};

export const SearchFilters = ({
    data,
}: Props) => {
    return(
        // px-4: adds horizontal padding
        // lg:pxx-12: adds horizontal padding of 3rem, This overrides px-4 on large screens
        // py-8: adds vertical padding
        // border-b: adds a bottom border using the default border color
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
            <SearchInput data={data}></SearchInput>
            <div className="hidden lg:block">
                <Categories data = {data}></Categories>
            </div>
        </div>
    );
};