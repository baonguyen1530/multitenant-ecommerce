import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
    activeCategoryName?: string | null;
    activeCategory?: string | null;
    activeSubcategoryName?: string | null;
};

export const BreadcrumbNavigation = ({
    activeCategoryName,
    activeCategory,
    activeSubcategoryName,
}: Props) => {
    if (!activeCategoryName || activeCategory === "all") return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {activeSubcategoryName ? (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="text-xl font-large underline text-primary">
                                <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator className="text-primary font-large text-lg">
                            /
                        </BreadcrumbSeparator>

                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-xl font-large">
                                {activeSubcategoryName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>  
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-xl font-large">
                            {activeCategoryName}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}