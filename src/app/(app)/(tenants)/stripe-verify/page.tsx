"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Page = () => {
    const trpc = useTRPC();
    const [error, setError] = useState<string | null>(null);
    
    const { mutate: verify, isPending } = useMutation(trpc.checkout.verify.mutationOptions({
        onSuccess: (data) => {
            console.log("Success data:", data);
            if (data.url) {
                window.location.href = data.url;
            } else {
                setError("No redirect URL received from Stripe");
            }
        },
        onError: (error) => {
            console.log("Verification error:", error);
            setError(error.message || "Failed to verify account");
        },
    }));

    useEffect(() => {
        verify();
    }, [verify]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="max-w-md w-full space-y-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                    <div className="flex gap-2">
                        <Button 
                            onClick={() => window.location.href = "/"}
                            variant="outline"
                        >
                            Go Home
                        </Button>
                        <Button 
                            onClick={() => {
                                setError(null);
                                verify();
                            }}
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center space-y-4">
                <LoaderIcon className="animate-spin text-muted-foreground mx-auto"/>
                <p className="text-muted-foreground">
                    {isPending ? "Creating verification link..." : "Redirecting to Stripe..."}
                </p>
            </div>
        </div>
    );
}

export default Page;