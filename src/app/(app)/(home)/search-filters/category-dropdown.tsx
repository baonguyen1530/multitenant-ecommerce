import { Category } from "@/payload-types"
import { Button } from "@/components/ui/button"

interface Props {
    category: Category;
    isActive?: boolean;
    isNavigationHovered?: boolean;
};

export const CategoryDropdown = ({
    category,
    isActive,
    isNavigationHovered,
}: Props) => {
    return (
        <Button>
            {category.name}
        </Button>
    );
};