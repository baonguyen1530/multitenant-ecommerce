"use client"

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { toast } from "sonner";
import { generateTenantURL } from "@/lib/utils";

interface CheckoutViewProps {
    tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
    const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);

    const trpc = useTRPC();
    const { data, error } = useQuery(trpc.checkout.getProducts.queryOptions({
        ids: productIds,
    }));

    useEffect(() => {
        if (error?.data?.code === "NOT_FOUND") {
            clearAllCarts();
            toast.warning("Invalid product found, cart cleared")
        }
    }, [error, clearAllCarts]);

    return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                <div className="lg:col-span-4">
                    <div className="border rounded-md overflow-hidden bg-white">
                        {data?.docs.map((product, index) => (
                            <CheckoutItem 
                                key={product.id}
                                id={product.id}
                                isLast={index === data.docs.length-1}
                                imageUrl={product.image?.url}
                                name={product.name}
                                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                                tenantUrl={generateTenantURL(product.tenant.slug)}
                                tenantName={product.tenant.name}
                                price={product.price}
                                onRemove={() => removeProduct(product.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    Checkout sidebar
                </div>
            </div>
        </div>
    );
};