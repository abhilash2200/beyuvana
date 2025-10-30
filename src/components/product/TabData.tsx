"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { CiCircleCheck } from "react-icons/ci";
import { fallbackProducts, TabItem } from "@/app/data/fallbackProducts";
import { useState } from "react";

interface TabDataProps {
    productId: number;
}

const TabData = ({ productId }: TabDataProps) => {
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

    return (
        <Tabs value={active || tabItems[0].id} onValueChange={setActive} className="w-full md:py-10">
            <div className="flex gap-6">
                <TabsList
                    className={`flex flex-col items-start justify-center w-[30%] h-auto rounded-[20px] shadow-lg p-4 space-y-3`}
                    style={{ backgroundColor: tabItems[0].bgColor }}
                >
                    {tabItems.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex items-center justify-start gap-x-4 text-[20px] font-medium py-2 px-5 h-auto w-full cursor-pointer data-[state=active]:shadow-none border-0 border-b last:border-b-0 border-[#acacac]"
                            style={{
                                color: active === tab.id ? (tab.headingColor ?? "#017933") : "#000000",
                            }}
                        >
                            <Image
                                src={tab.icon}
                                alt={`${tab.label} icon`}
                                width={28}
                                height={28}
                            />
                            <span>{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="w-[68%]">
                    {tabItems.map((tab) => (
                        <TabsContent
                            key={tab.id}
                            value={tab.id}
                            className="flex gap-8"
                        >
                            <div className="w-[40%] flex items-center justify-center shadow-lg rounded-[20px]">
                                <Image
                                    src={tab.img}
                                    alt={tab.label}
                                    width={420}
                                    height={320}
                                    className="rounded-[20px] object-contain"
                                />
                            </div>

                            <div
                                className="w-[55%] flex items-center shadow-lg rounded-[20px] p-6"
                                style={{ backgroundColor: tab.bgColor }}
                            >
                                <div className="w-full">
                                    <CiCircleCheck
                                        className="w-8 h-8 mb-4"
                                        style={{ color: tab.headingColor }}
                                    />
                                    <p className="text-[15px]">{tab.description}</p>

                                    <hr className="my-4" />
                                    <div className="flex items-center gap-4">
                                        {tab.stats.map((stat, i) => (
                                            <div
                                                key={i}
                                                className={`w-1/2 ${i === 0 ? "border-r" : ""} pr-2`}
                                            >
                                                <h2
                                                    className="text-[30px] font-[Grafiels] mb-2"
                                                    style={{ color: tab.headingColor }}
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

                                    {product.design_type !== "PINK" && (
                                        <>
                                            <hr className="my-4" />
                                            <div>
                                                <h2
                                                    className="text-[30px] font-[Grafiels] mb-2"
                                                    style={{ color: tab.headingColor }}
                                                >
                                                    {tab.extra.title}
                                                </h2>
                                                <p className="text-[16px] mb-2">{tab.extra.description}</p>
                                                <p className="text-[12px] text-gray-500">
                                                    Source: {tab.extra.source}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </div>
            </div>
        </Tabs>
    );
};

export default TabData;
