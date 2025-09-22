export type Product = {
    id: string;
    name: string;
    shortdescription?: string;
    description: string[];
    descriptiontext?: string;
    price: { 1: number; 2: number; 4: number };
    discount?: string;
    mainImage?: string;
    themeColor?: string;
    benefits?: { img: string; text: string }[];
    faq?: { question: string; answer: string }[];
  };
  
  export const products: Product[] = [
    {
      id: "collagen-powder",
      name: "BEYUVANA™ Collagen Builder",
      shortdescription: "Aging is Natural — Radiance is a Choice",
      description: [
        "Crafted with 21 botanicals to support skin elasticity, hydration, and youthful glow."
      ],
      descriptiontext: "Extra info about collagen powder.",
      price: { 1: 1199, 2: 2029, 4: 3519 },
      discount: "40% Off",
      mainImage: "/assets/img/collagen-green-product.png",
      themeColor: "#FAFAFA",
      benefits: [
        { img: "/assets/img/c1.png", text: "Boosts Skin Elasticity" },
        { img: "/assets/img/c2.png", text: "Fast Absorption" }
      ],
      faq: [
        { question: "How to use?", answer: "Take 1 sachet daily." },
        { question: "Any side effects?", answer: "No known side effects." }
      ]
    },
    {
      id: "collagen-booster",
      name: "BEYUVANA™ Glow Booster",
      description: [
        "Enriched with 18 plant-based actives for visible clarity."
      ],
      descriptiontext: "Extra info about glow booster.",
      price: { 1: 1999, 2: 2029, 4: 3519 },
      mainImage: "/assets/img/collagen-pink-product.png",
      themeColor: "#FFF0F5",
      benefits: [
        { img: "/assets/img/gl1.png", text: "Glow & Brightening" },
        { img: "/assets/img/gl2.png", text: "Gut Health" }
      ]
    }
  ];
  