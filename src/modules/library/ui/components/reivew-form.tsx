import { ReviewGetOneOutput } from "@/modules/reviews/types";

interface Props {
    productId: string;
    initialData?: ReviewGetOneOutput; 
}

export const ReviewForm = ({ productId, initalData }: Props) => {
    return (
        <div>
            Review form!
        </div>
    )
};