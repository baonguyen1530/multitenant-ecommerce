import { RefObject } from "react";

export const useDropDownPosition = (
    ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
    const getDropdownPosition = () => {
        if (!ref.current) return { top: 0, left: 0 };

        const rect = ref.current.get
    };

    return { getDropdownPosition };
}
