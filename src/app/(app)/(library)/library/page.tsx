import { LibraryView } from "@/modules/library/ui/views/library-view";

const Page = () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchInfinite
    return <LibraryView />
}

export default Page;