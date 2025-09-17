export type Product = {
    id: string;
    name: string;
    shortdescription: string;
    description: string;
    descriptiontext: string;
    price: { 1: number; 2: number; 4: number };
    benefits: { img: string; text: string }[];
    mainImage: string;
};

export const products: Product[] = [
    {
        id: "collagen-powder",
        name: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
        shortdescription: "Aging is Natural — Radiance is a Choice",
        description:
            "Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid.",
        descriptiontext: "",
        price: { 1: 1199, 2: 2029, 4: 3519 },
        benefits: [
            { img: "/assets/img/c1.png", text: "Boosts Skin Elasticity by up to 53%" },
            { img: "/assets/img/c2.png", text: "Fast Absorption with Bioavailable Plant Actives" },
            { img: "/assets/img/c3.png", text: "Reduces Visible Wrinkles & Fine Lines by 30%" },
            { img: "/assets/img/c4.png", text: "Promotes Hair Strength & Growth Naturally" },
        ],
        mainImage: "/assets/img/collagen-green-product.png",
    },
    {
        id: "collagen-booster",
        name: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
        shortdescription: "",
        description:
            "Glow Essence is an advanced, 100% vegetarian, skin-nourishing formula enriched with 18 synergistic plant-based actives, designed to unlock visible clarity and radiance from within. Infused with 4X Liposomal",
        descriptiontext: "Glutathione and clinically studied Vitamin C, it works deep at the cellular level to visibly reduce dark spots, pigmentation, and dullness — revealing a brighter, more even-toned complexion. ",
        price: { 1: 1999, 2: 2029, 4: 3519 },
        benefits: [
            { img: "/assets/img/gl1.png", text: "Glow & Brightening" },
            { img: "/assets/img/gl2.png", text: "Gut Health" },
            { img: "/assets/img/gl3.png", text: "Dark Spots & Pigmentation" },
            { img: "/assets/img/gl4.png", text: "Acne & Clear Skin" },
        ],
        mainImage: "/assets/img/collagen-pink-product.png",
    },
];
