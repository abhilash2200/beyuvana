"use client"

import Image from "next/image"

const DetailsOfGreenCollagen = () => {
    return (
        <div>
            <div className="bg-[#1A2819] rounded-[20px] md:p-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-y-10">
                    <div className="w-full md:w-[48%]">
                        <h2 className="text-white font-[Grafiels] md:text-[23px] text-[18px] leading-tight mb-5">Why Choose BEYUVANA™ Premium Collagen Builder?</h2>
                        <p className="text-white mb-6 md:leading-relaxed text-[15px] leading-tight font-light">A Smarter, Safer Path to Ageless Skin. Not Just Collagen — A Complete Skin Nutrition Ritual.</p>
                        <p className="text-white mb-6 md:leading-relaxed text-[15px] leading-tight font-light">BEYUVANA™ is more than a collagen supplement. Its a powerful, plant-based formula that activates your skin’s natural renewal systems from within. We don’t just give you collagen — we help your body create, protect, and preserve its own.</p>
                        <p className="text-white mb-6 md:leading-relaxed text-[15px] leading-tight font-light">100% vegetarian, sugar-free, gelatin-free — crafted for those who want visible results, naturally. Every ingredient has a purpose, and every sachet is a step toward long-term skin health.</p>

                        <Image src="/assets/img/product-details/green-1.png" width={772} height={684} alt="detail info" className="w-full h-auto mb-6" />
                        <div className="flex items-center justify-start gap-x-2 mt-4">
                            <Image src="/assets/img/product-details/certificate.png" width={77} height={77} alt="detail info" className="w-auto h-auto" />
                            <p className="text-white">View Lab Certificates</p>
                        </div>
                        <ul className="mt-4 list-disc list-inside text-white font-light text-[15px]">
                            <li>Each Sachet Delivers 21 Synergistic Plant-Based Actives.</li>
                            <li>Designed for Multi-Action Skin Nutrition from Within.</li>
                            <li>Targets Collagen, Glow, Hydration & Visible Ageing Signs—Naturally.</li>
                        </ul>
                    </div>
                    <div className="w-full md:w-[48%]">
                        <h2 className="text-[#22014] font-[Grafiels] md:text-[23px] text-[18px] leading-tight mb-5 bg-white text-center rounded-[20px] py-4">10 Core Actions. 1 Intelligent Sachet</h2>
                        <div className="p-4 bg-[#000000]/50 rounded-[20px]">
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Activates Natural Collagen Production</p>
                                <div className="font-light text-[13px]">
                                    <p className="mb-1">Boosts collagen synthesis for firmer, younger-looking skin — without marine or bovine collagen.</p>
                                    <p><span className="font-medium">Key Ingredients: </span>L-Lysine · L-Proline · Amla (Vit C) · Bamboo Extract (Silica)</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Delivers Deep Skin Hydration</p>
                                <div className="font-light text-[13px]">
                                    <p>Hydrates from within to smooth lines and restore skin bounce and suppleness.</p>
                                    <p><span className="font-medium">Key Ingredients: </span> Hyaluronic Acid · Amla · Vitamin E</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Fades Pigmentation & Enhances Glow</p>
                                <div className="font-light text-[13px]">
                                    <p>Brightens skin tone, reduces dark spots, and supports a radiant complexion.</p>
                                    <p><span className="font-medium">Key Ingredients: </span>Glutathione · Grape Seed Extract · Vitamin C · Pomegranate · Licorice (via base)</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Smooths Fine Lines & Wrinkles</p>
                                <div className="font-light text-[13px]">
                                    <p>Minimizes wrinkle depth, strengthens skin texture, and reduces visible signs of aging. </p>
                                    <p><span className="font-medium"    >Key Ingredients: </span>CoQ10 · Astaxanthin · Resveratrol · Horsetail (Silica) · Vitamin E</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Combats Stress-Induced Aging</p>
                                <div className="font-light text-[13px]">
                                    <p>Reduces cortisol impact, improves skin resilience, and balances stress-aging responses. </p>
                                    <p><span className="font-medium">Key Ingredients: </span>Ashwagandha · Shatavari · Gotu Kola</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Protects from UV & Pollution Damage</p>
                                <div className="font-light text-[13px]">
                                    <p>Defends against environmental aggressors that accelerate premature aging. </p>
                                    <p><span className="font-medium">Key Ingredients: </span> Green Tea (EGCG) · Astaxanthin · Amla · Grape Seed </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Strengthens the Gut-Skin Axis</p>
                                <div className="font-light text-[13px]">
                                    <p>Promotes gut balance to support clearer, healthier, inflammation-free skin. </p>
                                    <p><span className="font-medium">Key Ingredients: </span> Amla · Shatavari · Ashwagandha</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Fights Inflammation & Breakouts</p>
                                <div className="font-light text-[13px]">
                                    <p>Soothes skin, reduces sensitivity, and calms flare-ups.</p>
                                    <p><span className="font-medium">Key Ingredients: </span>Green Tea · Licorice (via base) · Selenium · Zinc</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-white border-dashed text-white py-4">
                                <p className="font-light text-[15px]">Supports Cellular Detox & Skin Repair</p>
                                <div className="font-light text-[13px]">
                                    <p>Flushes toxins, promotes clarity, and accelerates natural skin repair cycles.</p>
                                    <p><span className="font-medium">Key Ingredients: </span>Glutathione · Grape Seed · Selenium · Zinc · Vitamin C</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailsOfGreenCollagen
