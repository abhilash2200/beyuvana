"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";

interface TabItem {
    id: string;
    icon: string;
    label: string;
    content: React.ReactNode;
    img: string;
}

const tabItems: TabItem[] = [
    {
        id: "tab1",
        icon: "",
        label: "Aging",
        content: <p>This is the overview content.</p>,
        img: "/assets/img/product-details/aging-1.png",
    },
    {
        id: "tab2",
        icon: "",
        label: "Stress",
        content: <p>Here are some features of the product.</p>,
        img: "/assets/img/product-details/aging-1.png",
    },
    {
        id: "tab3",
        icon: "",
        label: "Pollution",
        content: <p>User reviews will appear here.</p>,
        img: "/assets/img/product-details/aging-1.png",
    },
    {
        id: "tab4",
        icon: "",
        label: "UV Radiation",
        content: <p>User reviews will appear here.</p>,
        img: "/assets/img/product-details/aging-1.png",
    },
    {
        id: "tab5",
        icon: "",
        label: "Disrupted Sleep Pattern",
        content: <p>User reviews will appear here.</p>,
        img: "/assets/img/product-details/aging-1.png",
    },
    {
        id: "tab6",
        icon: "",
        label: "Poor Gut Health",
        content: <p>User reviews will appear here.</p>,
        img: "/assets/img/product-details/aging-1.png",
    },
];

const TabData = () => {
    return (
        <Tabs defaultValue={tabItems[0].id} className="w-full">
            <div className="flex gap-4">
                {/* Left menu */}
                <TabsList
                    className="flex flex-col w-[20%] space-y-2 bg-white p-2 rounded-md shadow"
                >
                    {tabItems.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="text-left py-2 px-3 rounded-md border hover:bg-gray-100"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Right content */}
                <div className="w-[78%]">
                    {tabItems.map((tab) => (
                        <TabsContent
                            key={tab.id}
                            value={tab.id}
                            className="flex gap-6 bg-white p-6 rounded-lg shadow"
                        >
                            {/* Image Section */}
                            <div className="w-1/2 flex items-center justify-center">
                                <Image
                                    src={tab.img}
                                    alt={tab.label}
                                    width={400}
                                    height={300}
                                    className="rounded-lg object-contain"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="w-1/2 flex items-center">
                                <div>{tab.content}</div>
                            </div>
                        </TabsContent>
                    ))}
                </div>
            </div>
        </Tabs>
    );
};

export default TabData;
