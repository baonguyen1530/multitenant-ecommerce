"use client";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { PriceFilter } from "./price-filter";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ProductFilter = ({ title, className, children }:ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn(
      "p-4 border-b flex flex-col gap-2",
      className
    )}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center justify-between cursor-pointer"
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5"/>
      </div>
      {isOpen && children}
    </div>
  );
};

export const ProductFilters = () => {
    return (
      <div className="border rounded-md bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <p className="font-medium">Filters</p>
          <button className="underline" onClick={() => {}} type="button">
            Clear
          </button>
        </div>
        <ProductFilter title="Price" className="border-b-0">
          <PriceFilter />
        </ProductFilter>
      </div>
    );
};