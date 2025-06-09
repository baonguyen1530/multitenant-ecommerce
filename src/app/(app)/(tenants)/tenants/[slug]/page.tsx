import { SearchParams } from "nuqs";

interface Props {
    searchParams: Promise<SearchParams>;
    params: Promise<{ slug: string }>;
}; 