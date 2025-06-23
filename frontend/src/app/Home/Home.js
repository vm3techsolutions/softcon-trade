"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ProductGrid from "@/Component/ProductGrid";
import Image from "next/image";

export default function Home() {
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  return (
    <section className="mx-12">
      <div className="flex flex-col-reverse md:flex-row md:p-8 gap-12 md:h-[600px]">
        <Sidebar
          activeCategoryId={activeCategoryId}
          onCategorySelect={setActiveCategoryId}
        />
        <div className="w-full relative h-[200px] md:h-full overflow-hidden shadow-lg mb-4 md:mb-8">
          <Image
            src="/assets/Sidebar-right.png"
            alt="Industrial Automation"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="w-full md:w-4/5">
        <ProductGrid activeCategoryId={activeCategoryId} />
      </div>
    </section>
  );
}
