import configPromise from "@payload-config"
import { Category } from "@/payload-types"
import { getPayload } from "payload"


import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters } from "./search-filters";
import { CustomCategory } from "./types";

interface Props {
    children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
    const payload = await getPayload({  
        config: configPromise,
    });
    
    const data = await payload.find({
        collection: "categories",
        depth: 1,   // Populate subcategories, subcategories.[0] will be a type of "Category"
        // A technique used to divide big dataset or long list into smaller chunks called pages.
        // Often used to improve performance, reduce load time, and easier for user to navigate
        // Since we put it as false, the entire dataset will be returned
        pagination: false,
        where: {
            parent: {
                exists: false,
            },
        },
        sort: "name"
    });

    const formattedData: CustomCategory[] = data.docs.map((doc) => ({
        ...doc,
        subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // Because of "depth: 1" we are confident "doc" will be a type of "Category"
            ...(doc as Category),
        }))
    }));

    return(
        <div className="flex flex-col min-h-screen">
            <Navbar></Navbar>
            <SearchFilters data={formattedData}></SearchFilters>
            <div className="flex-1 bg-[#F4F4F0]">
                {children}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Layout;