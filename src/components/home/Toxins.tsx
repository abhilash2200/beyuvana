"use client";

import Image from "next/image";
import React from "react";

interface ToxinItem {
  img: string;
  text: string;
}

const toxinItems: ToxinItem[] = [
  { img: "/assets/img/non-toxic.png", text: "No Toxins\nor chemicals" },
  { img: "/assets/img/non-toxic.png", text: "No Filters\nor chemicals" },
  { img: "/assets/img/non-toxic.png", text: "No Toxins\nor chemicals" },
  { img: "/assets/img/non-toxic.png", text: "No Filters\nor chemicals" },
  { img: "/assets/img/non-toxic.png", text: "No Toxins\nor chemicals" },
];

const Toxins: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-around">
      {toxinItems.map((item, index) => (
        <div
          key={index}
          className={`w-[19%] ${index !== toxinItems.length - 1 ? "border-r border-white" : ""}`}
        >
          <div className="flex gap-x-2 items-center justify-center">
            <Image src={item.img} width={70} height={70} alt={item.text} />
            <p className="whitespace-pre-line text-[#FFF]">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toxins;
