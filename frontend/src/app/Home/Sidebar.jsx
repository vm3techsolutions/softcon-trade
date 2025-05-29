"use client";

import { useState } from "react";
import Image from "next/image";

import Rockwell from "@/app/categories/Rockwel";
import Vacon from "@/app/categories/Vacon";
import Danfoss from "@/app/categories/Danfoss";
import BoschRexroth from "@/app/categories/BoschRexroth";
import HeatExchanger from "@/app/categories/HeatExchanger";
import IECCubic from "@/app/categories/IECCubic";

const categories = [
  "Rockwell Automation",
  "Vacon",
  "Danfoss",
  "Bosch Rexroth",
  "Heat Exchanger",
  "IEC-61439 Cubic Panels",
];

export default function MicroControlComponent() {
  const [active, setActive] = useState("Rockwell Automation");

  const renderComponent = () => {
    switch (active) {
      case "Rockwell Automation":
        return <Rockwell />;
      case "Vacon":
        return <Vacon />;
      case "Danfoss":
        return <Danfoss />;
      case "Bosch Rexroth":
        return <BoschRexroth />;
      case "Heat Exchanger":
        return <HeatExchanger />;
      case "IEC-61439 Cubic Panels":
        return <IECCubic />;
      default:
        return null;
    }
  };

  return (
    <section>
    <div className="flex flex-col md:flex-row p-8">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 bg-white p-4 border shadow-md rounded-xl">
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category} className="border-b border-gray-300">
              <button
                onClick={() => setActive(category)}
                className={`w-full text-left py-2 text-lg font-bold transition-colors duration-200 text-[#044E78] ${
                  active === category ? "text-yellow-400" : "bg-white hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side content */}
      <div className="w-full md:w-4/5 pl-10">
        <div className="w-full h-[350px] relative overflow-hidden shadow-lg">
          <Image
            src="/assets/Sidebar-right.png"
            alt="Industrial Automation"
            layout="fill"
            objectFit="cover"
          />
        </div>

       
        
      </div>
    </div>

     {/* Dynamic Component */}
        <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
          {renderComponent()}
        </div>
    </section>
  );
}
