"use client";

import { useState } from "react";
import Image from "next/image";
import { CiCircleCheck } from "react-icons/ci";
import { fallbackProducts, TabItem } from "@/app/data/fallbackProducts";

interface ResDropdownProps {
    productId: number;
}

const ResDropdown = ({ productId }: ResDropdownProps) => {
    const [active, setActive] = useState<string>("");
    const product = fallbackProducts.find((p) => p.id === productId);

    if (!product || !product.tabItems || product.tabItems.length === 0) {
        return <p className="text-red-500">Product not found</p>;
    }

    const derivedBg = product.actionItems?.[0]?.bgColor || "#F8FFF9";
    const derivedHeading = product.actionItems?.[0]?.headingColor || "#017933";

    const tabItems: TabItem[] = product.tabItems.map((t: TabItem, idx: number) => ({
        ...t,
        bgColor: t.bgColor ?? product.actionItems?.[idx]?.bgColor ?? derivedBg,
        headingColor: t.headingColor ?? product.actionItems?.[idx]?.headingColor ?? derivedHeading,
    }));

    const selected = active
        ? tabItems.find((tab) => tab.id === active)
        : tabItems[0];

    return (
        <div className="w-full py-6 md:hidden">
            {/* Dropdown */}
            <select
                value={active || tabItems[0].id}
                onChange={(e) => setActive(e.target.value)}
                className="w-full px-4 py-2 rounded-[12px] border shadow-md text-[15px] font-normal"
                style={{ backgroundColor: selected?.bgColor }}
            >
                {tabItems.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                        {tab.label}
                    </option>
                ))}
            </select>

            {/* Selected Content */}
            {selected && (
                <div className="mt-6 flex flex-col gap-6">
                    <div className="w-full flex items-center justify-center shadow-lg rounded-[20px]">
                        <Image
                            src={selected.img}
                            alt={selected.label}
                            width={420}
                            height={320}
                            className="rounded-[20px] object-contain"
                        />
                    </div>

                    <div
                        className="w-full shadow-lg rounded-[20px] p-6"
                        style={{ backgroundColor: selected.bgColor }}
                    >
                        <div className="w-full">
                            <CiCircleCheck
                                className="w-8 h-8 mb-4"
                                style={{ color: selected.headingColor }}
                            />
                            <p className="text-[15px]">{selected.description}</p>

                            <hr className="my-4" />
                            <div className="grid grid-cols-2 gap-4">
                                {selected.stats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className={`pr-2 ${i === 0 ? "border-r" : ""}`}
                                    >
                                        <h2
                                            className="text-[30px] font-[Grafiels] mb-2"
                                            style={{ color: selected.headingColor }}
                                        >
                                            {stat.value}
                                        </h2>
                                        <p className="text-[16px] mb-2">{stat.description}</p>
                                        <p className="text-[12px] text-gray-500">
                                            Source: {stat.source}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-4" />
                            <div>
                                <h2
                                    className="text-[30px] font-[Grafiels] mb-2"
                                    style={{ color: selected.headingColor }}
                                >
                                    {selected.extra.title}
                                </h2>
                                <p className="text-[16px] mb-2">{selected.extra.description}</p>
                                <p className="text-[12px] text-gray-500">
                                    Source: {selected.extra.source}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResDropdown;
