import { Product } from "@/app/data/fallbackProducts";
import ProductImg from "./ProductImg";
import ProductDetails from "./ProductDetails";
import SelectPack from "./SelectPack";
import Image from "next/image";
import Action from "./Action";
import { FaRegCheckSquare } from "react-icons/fa";
import HeaderText from "../common/HeaderText";
import WhyBeyuvana from "./WhyBeyuvana";
import Compare from "./Compare";
import Builder from "./Builder";
import TabData from "./TabData";
import AdvancedPlant from "./AdvancedPlant";
import DetailsOfGreenCollagen from "./DetailsOfGreenCollagen";
import CustomerReviews from "./CustomerReviews";
import ProductFaq from "./ProductFaq";
import ResProductImg from "./ResponsiveV/ResProductImg";
import ResSelectPack from "./ResponsiveV/ResSelectPack";
import ResDropdown from "./ResponsiveV/ResDropdown";

const data = [
    {
        img: "/assets/img/g1.png",
        text: "Boosts Skin Elasticity<br /> by up to 53%",
    },
    {
        img: "/assets/img/g2.png",
        text: "Fast Absorption with<br/> Bioavailable Plant Actives",
    },
    {
        img: "/assets/img/g3.png",
        text: "Reduces Visible Wrinkles &<br/> Fine Lines by 30%",
    },
    {
        img: "/assets/img/g4.png",
        text: "Improves Skin Hydration &<br/> Moisture Retention by 45%",
    },
    {
        img: "/assets/img/g5.png",
        text: "Promotes Hair Strength<br/> & Growth Naturally",
    },
    {
        img: "/assets/img/g6.png",
        text: "Fades Pigmentation<br/> & Brightens Skin Tone",
    },
    {
        img: "/assets/img/g7.png",
        text: "Combats Environmental<br/> Stress & Toxins",
    },
    {
        img: "/assets/img/g8.png",
        text: "Supports Clearer Skin Through<br/> Gut & Hormonal Balance",
    },
]

interface BenefitItem {
    text: string
}

const benefits: BenefitItem[] = [
    { text: "Hydration surges 75%, leaving skin plump and supple." },
    { text: "Glow rises 70%, restoring luminous radiance." },
    { text: "Elasticity improves 68%, for a firmer, lifted feel." },
    { text: "Pigmentation reduces by 60%, revealing clearer, even skin tone." },
    { text: "Wrinkle depth reduces 62%, visibly softening fine lines." },
    { text: "Overall ageing markers drop 61%, showcasing comprehensive renewal." },
]

interface StatCard {
    percent: string
    title: string
    subtitle: string
}

const stats: StatCard[] = [
    { percent: "75%", title: "Increase in", subtitle: "Skin Hydration" },
    { percent: "70%", title: "Increase in", subtitle: "Skin Glow" },
    { percent: "68%", title: "Increase in", subtitle: "Skin Elasticity" },
    { percent: "60%", title: "Reduce in", subtitle: "Pigmentation" },
    { percent: "62%", title: "Reduce in", subtitle: "Wrinkle Depth" },
    { percent: "61%", title: "Reduce in", subtitle: "Visible Signs of Aging" },
]

export default function Product1Layout({ product }: { product: Product }) {
    return (
        <>
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-wrap justify-between gap-x-2">
                    <div className="w-full md:w-[30%]">
                        <div className="hidden md:block">
                            <ProductImg images={product.images} />
                        </div>
                        <div className="block md:hidden">
                            <ResProductImg images={product.images} />
                        </div>
                    </div>
                    <div className="w-full md:w-[30%]">
                        <ProductDetails name={product.name} tagline={product.tagline} description={product.description} certificateImg={product.certificateImg} faq={product.faq} productId={product.id} />
                    </div>
                    <div className="w-full md:w-[30%]">
                        <div className="hidden md:block">
                            <SelectPack productId="collagen-green" />
                        </div>
                        <div className="block md:hidden">
                            <ResSelectPack productId="collagen-green" />
                        </div>
                    </div>
                </div>
                <hr className="my-10" />
                <div className="md:py-10 py-6">
                    <div className="flex flex-wrap justify-between items-center text-center gap-y-10">
                        {data.map((item, i) => (
                            <div key={i} className="w-[45%] md:w-[23%] relative">
                                <div className="flex flex-col items-center justify-center gap-y-4">
                                    <Image src={item.img} alt="certificate" width={136} height={136} />
                                    <p
                                        className="text-sm text-gray-500 max-w-[80%]"
                                        dangerouslySetInnerHTML={{ __html: item.text }}
                                    />
                                </div>
                                {(i + 1) % 4 !== 0 && i !== data.length - 1 && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-[#000] hidden md:block"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:py-10 py-6 bg-[#F8FFF9] rounded-[20px]">
                    <div className="flex flex-col">
                        <div className="relative px-4">
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-[50%] md:py-26 md:pl-10">
                                    <div className="mb-6">
                                        <p className="border rounded-[8px] px-4 py-2 text-[15px] inline-flex">10 ACTIONS. 1 SMART SACHET</p>
                                    </div>
                                    <h2 className="font-[Grafiels] md:text-[25px] text-[18px] text-[#1A2819] leading-tight md:leading-relaxed mb-3 max-w-[80%]">A Premium Collagen Builder Powered by 21 Synergistic Plant-Based Actives</h2>
                                </div>
                                <div className="w-full md:w-[50%] hidden md:block">
                                    <div className="absolute bottom-0.5 right-0">
                                        <Image src="/assets/img/product-details/action-green.png" alt="action" width={448} height={368} className="w-full h-auto" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <hr className="w-full" />
                            </div>
                        </div>
                        <div className="py-6 px-4">
                            <Action />
                        </div>
                    </div>
                </div>
                <div className="md:py-10 py-6">
                    <div className="flex flex-wrap items-center gap-y-10 justify-between">
                        <div className="w-full md:w-[48%]">
                            <Image
                                src="/assets/img/product-details/green-detail-info.png"
                                width={880}
                                height={580}
                                alt="detail info"
                                className="w-full h-auto"
                            />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <h2 className="text-[#1A2819] font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-3">Experience Visible Transformation in 10 Weeks</h2>
                            <p className="mb-4 leading-relaxed font-normal text-[15px] ">
                                Our clinical-style progress chart reveals the powerful results of
                                BEYUVANA™’s advanced anti-ageing formula. Within 10 weeks:
                            </p>
                            <ul>
                                {benefits.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-x-2 items-center mb-2 font-normal text-[15px]"
                                    >
                                        <FaRegCheckSquare className="text-[#0C4B33] w-5 h-5 font-normal" /> {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="md:text-center text-left py-6">
                        <p>This transformation is powered by a synergy of botanicals, antioxidants, and Ayurvedic adaptogens — uniting nature and science for timeless, radiant skin.</p>
                    </div>
                </div>
                <div className="md:py-10 py-6">
                    <div className="flex flex-wrap items-center gap-y-10 justify-between">
                        <div className="w-full md:w-[40%]">
                            <HeaderText textalign="text-left" heading="Powered by Research-Backed Ingredients in BEYUVANA™ PREMIUM COLLAGEN BUILDER" textcolor="text-[#1A2819]" />
                            <p className="mb-6">Improvement in just 10 weeks</p>
                            <div className="flex flex-wrap justify-between gap-4">
                                {stats.map((item, index) => (
                                    <div key={index} className="w-[45%] md:w-[47%]">
                                        <div className="flex flex-col items-center gap-y-2 px-4 py-6 bg-[#EDFFF0] rounded-[20px]">
                                            <h2 className="text-[#0C4B33] font-[Grafiels] md:text-[30px] text-[20px] leading-tight">{item.percent}</h2>
                                            <p className="text-center text-[15px] line-clamp-2">
                                                {item.title}
                                                <br /> {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full md:w-[48%]">
                            <Image
                                src="/assets/img/product-details/green-lady.png"
                                width={880}
                                height={580}
                                alt="detail info"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
                <div className="md:py-10 py-6">
                    <HeaderText textalign="text-center" heading="Why the BEYUVANA™ PREMIUM COLLAGEN BUILDER Works" textcolor="text-[#1A2819]" />
                    <p className="text-center mb-4">BEYUVANA™ isn’t just another supplement — it’s a multi-action, plant-powered skin nutrition system designed to target the root causes of aging, not just the symptoms. Heres why it delivers real, visible results:</p>
                    <WhyBeyuvana product={product} />
                </div>
                <div className="md:py-10 py-6">
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="w-full md:w-[48%]">
                            <Image src="/assets/img/product-details/green-288484.png" width={772} height={684} alt="detail info" className="w-full h-auto" />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <Compare />
                        </div>
                    </div>
                </div>
                <div className="md:py-10 py-6 bg-[#F8FFF9] rounded-[20px]">
                    <HeaderText textalign="text-center" heading="Who Is BEYUVANA™ Premium Collagen Builder Made For?" textcolor="text-[#1A2819]" />
                    <p className="text-center mb-4 max-w-[90%] leading-tight">BEYUVANA™ is designed for modern individuals who want results without compromise —using only clean, plant-based ingredients that are backed by science and safe for everyday use.</p>
                    <Builder />
                </div>
                <div className="md:py-10 py-6">
                    <HeaderText textalign="text-center" heading="The Hidden Reasons Your Skin Loses Its Radiance So quickly" textcolor="text-[#1A2819]" />
                    <p className="text-center mb-4 max-w-[90%] leading-tight">Stress, pollution, UV exposure, poor sleep, and nutrient deficiencies silently disrupt your skin’s balance — breaking down collagen, dulling glow, and accelerating aging faster than you realize.</p>
                    <div className="hidden md:block">
                        <TabData productId={product.id} />
                    </div>
                    <div className="block md:hidden">
                        <ResDropdown productId={product.id} />
                    </div>
                </div>
            </div>
            <div className="md:py-10 py-6">
                <HeaderText textalign="text-center" heading="India’s Most Advanced Anti-Aging Innovation" textcolor="text-[#1A2819]" />
                <p className="text-center mb-4 md:w-[90%] w-full mx-auto leading-tight px-4">Collagen Reglow delivers clinically proven ingredients in precision-dosed sachets for maximum skin transformation.</p>
                <div className="py-6">
                    <AdvancedPlant />
                </div>
            </div>
            <div className="md:py-10 py-6">
                <div className="container mx-auto px-4">
                    <DetailsOfGreenCollagen />
                </div>
            </div>
            <div className="md:py-10 py-6">
                <div className="container mx-auto px-4">
                    <HeaderText textalign="text-center" heading="Customer Reviews" textcolor="text-[#1A2819]" />
                    <CustomerReviews />
                </div>
            </div>
            <div className="md:py-10 py-6">
                <div className="container mx-auto px-4">
                    <HeaderText textalign="text-center" heading="Frequently Asked Questions" textcolor="text-[#1A2819]" />
                    <ProductFaq productId={1} />
                </div>
            </div>
        </>
    );
}