"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Poppins } from "next/font/google";
import{ Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";

import { loginSchema } from "../../schemas";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

export const SignInView = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    const login = useMutation(trpc.auth.login.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async () => { 
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
            router.push("/");
        }
    }));

    const form = useForm<z.infer<typeof loginSchema>>({
        mode: "onSubmit",
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        login.mutate(values);
    };
     
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-8 p-4 lg:p-16"
                    >
                        <div className="flex items-center justify-between mb-8">
                            {/* go back */}
                            <Link href="/">
                                <span className={cn("text-2xl font-semibold", poppins.className)}>
                                    4rchivedGarments
                                </span>
                            </Link>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="border-none text-base underline"
                            >
                                <Link prefetch href="/sign-up">
                                    Sign Up
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-4xl font-medium">
                            Welcome back
                        </h1>
                        <FormField
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter email"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem> 
                            )}
                        />
                        <FormField
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="Enter password"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={login.isPending}
                            type="submit"
                            size="lg"
                            variant="elevated"
                            className="bg-black text-white hover:bg-pink-400 hover:text-primary"
                        >
                            Log In
                        </Button>
                    </form>
                </Form>
            </div>
            <div 
                className="h-screen w-full lg:col-span-2 hidden lg:block"
                style={{
                    backgroundImage: "url('/auth-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
        </div>
    );
}