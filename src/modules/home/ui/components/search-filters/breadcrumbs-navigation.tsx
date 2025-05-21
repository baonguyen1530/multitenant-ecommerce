import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeperator,
} from "@/components/ui/breadcrumb";

interface Props {
    activeCategoryName?: string | null;
    activeCategory?: string | null;
    activeSubcategoryName?: string | null;
};

const BreadcrumbNavigation = ({
    activeCategoryName,
    activeCategory,
    activeSubcategoryName,
}: Props) => {
    if (!activeCategoryName || activeCategory === "all") return null;

    return (
        <Breadcrumb></Breadcrumb>

    );
}