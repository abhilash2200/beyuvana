export interface Product {
    id: number;
    name: string;
    tagline?: string;
    description: string[];
    price: number;
    originalPrice: number;
    discount: string;
    image: string;
    bgColor: string;
  }
  
  export const fallbackProducts: Product[] = [
    {
      id: 1,
      name: "BEYUVANA™ Collagen Builder",
      tagline: "Aging is Natural — Radiance is a Choice",
      description: [
        "Crafted with 21 synergistic, clinically studied botanicals...",
      ],
      price: 5999,
      originalPrice: 10000,
      discount: "40% Off",
      image: "/assets/img/green-product.png",
      bgColor: "#FAFAFA",
    },
    {
      id: 2,
      name: "BEYUVANA™ Advanced Glow Formula",
      description: [
        "Glow Essence is an advanced, 100% vegetarian formula...",
      ],
      price: 5999,
      originalPrice: 10000,
      discount: "40% Off",
      image: "/assets/img/pink-product.png",
      bgColor: "#FFE2E2",
    }
  ];
  