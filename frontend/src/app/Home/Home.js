"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ProductGrid from "@/Component/ProductGrid";
import Image from "next/image";

export default function Home() {
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  return (
    <>
      {/* Banner Image at Top */}
      <div className="w-full relative h-[300px] md:h-[400px] overflow-hidden shadow-lg mb-6">
        <Image
          src="/assets/Sidebar-right.png"
          alt="Industrial Automation Banner"
          fill
          className="object-cover"
          priority
        />
      </div>
         <section className="mx-4 md:mx-12">
    <div className="flex flex-col-reverse md:flex-row md:p-8 gap-12">
      {/* Sticky Sidebar */}
      <div className="md:w-1/4 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-auto">
        <Sidebar
          activeCategoryId={activeCategoryId}
          onCategorySelect={setActiveCategoryId}
        />
      </div>

      {/* Main content area */}
      <div className="w-full md:w-3/4">
        <ProductGrid activeCategoryId={activeCategoryId} />
      </div>
    </div>
  </section>

    </>
  );
}
