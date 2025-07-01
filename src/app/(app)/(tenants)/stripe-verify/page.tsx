"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const Page = () => {
    const trpc = useTRPC();
    const { mutate: verify } = useMutation(trpc.checkout.verify.mutationOptions());

    useEffect(() => {
        
    })

    return (
        <div>
            Verification
        </div>
    );
}

export default Page;