"use client"

import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import {usePathname } from "next/navigation";
import React from "react";
import NavbarSidebar from "./navbar-sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";


const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

interface NavbarItemProps {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
};

const NavbarItem = ({
    href,
    children,
    isActive,
}: NavbarItemProps) => {
    return(
        <Button
        asChild
        variant="outline"
        className={cn(
            "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
            isActive && "bg-black text-white hover:bg-black hover:text-white"
        )}
        >
            <Link href={href}>
                {children}
            </Link>
            
        </Button>
    );
};

const navbarItems = [
    { href: "/", children: "Home" },
    { href: "/about", children: "About" },
    { href: "/features", children: "Features" },
    { href: "/pricing", children: "Pricing" },
    { href: "/contact", children: "Contact" },
];

export const Navbar = () => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <nav className="h-20 flex border-b justify-between font-medium bg-white">
            <Link href="/" className="pl-6 flex items-center">
                <span className={cn("text-3xl font-semibold", poppins.className)}>
                    4rchived_g4rments
                </span>
            </Link>

            <NavbarSidebar
                items = {navbarItems}
                open = {isSidebarOpen}
                onOpenChange = {setIsSidebarOpen}
            />

            <div className="items-center gap-4 hidden lg:flex p-4">
                {navbarItems.map((item) => (
                    <NavbarItem
                        key={item.href}
                        href={item.href}
                        isActive={pathname === item.href}
                    >
                        {item.children}
                    </NavbarItem>
                ))}
            </div>


            {/* Log in button and Start selling button */}
            <div className="hidden lg:flex">
                <Button
                    asChild
                    variant="secondary"
                    className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
                >
                    <Link href="/sign-in">
                        Log in
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="secondary"
                    className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black hover:bg-pink-400 hover:text-black transition-colors text-lg text-white"
                >
                    <Link href="/sign-up">
                        Start selling
                    </Link>
                </Button>
            </div>

            <div className="flex lg:hidden items-center justify-center">
                <Button
                    variant = "ghost"
                    className = "size-12 border-transparent bg-white"
                    onClick = {() => setIsSidebarOpen(true)}
                >
                    <MenuIcon />
                </Button>
            </div>
        </nav>
    );
};