export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

export interface Product {
  id: number;
  name: string;
  tagline?: string;
  description?: string;
  certificateImg?: string;
  images: string[];
  faq?: FaqItem[];
}

export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "BEYUVANA™ Premium Collagen Builder— Complete Anti-Aging Solution",
    tagline: "Aging is Natural — Radiance is a Choice",
    description: "Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid.",
    certificateImg: "/assets/img/product-details/certificate.png",
    images: [
      "/assets/img/product-details/collagen-green-product.png",
      "/assets/img/product-details/collagen-green-side.png",
      "/assets/img/product-details/collagen-green-info.png",
      "/assets/img/product-details/collagen-green-ingredients.png",
    ],
    faq: [
      {
        id: "item-1",
        question: "Benefits",
        answer: [
          "Boosts natural collagen production",
          "Deeply hydrates and plumps skin",
          "Brightens skin tone and fades pigmentation",
          "Reduces fine lines and wrinkles",
        ]
      },
      {
        id: "item-2",
        question: "Ingredients",
        answer: [
          "Amla",
          "Bamboo Silica",
          "L-Lysine",
          "Hyaluronic Acid",
        ]
      },
      {
        id: "item-3",
        question: "How to use",
        answer: [
          "Take 1 sachet daily with warm water or as directed by a healthcare professional.",
          "Consume consistently for best results.",
        ]
      }
    ],
  },
  {
    id: 2,
    name: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
    tagline: "Aging is Natural — Radiance is a Choice",
    description: "Glow Essence is an advanced, 100% vegetarian, skin-nourishing formula enriched with 18 synergistic plant- based actives, designed to unlock visible clarity and radiance from within.  Infused with 4X Liposomal Glutathione and clinically studied Vitamin C, it ",
    certificateImg: "/assets/img/product-details/certificate.png",
    images: [
      "/assets/img/product-details/collagen-pink-product.png",
      "/assets/img/product-details/collagen-pink-side.png",
      "/assets/img/product-details/collagen-pink-info.png",
      "/assets/img/product-details/collagen-pink-ingredients.png",
    ],
    faq: [
      {
        id: "item-1",
        question: "Benefits",
        answer: [
          "Brightens skin tone & promotes natural radiance",
          "Fades dark spots, acne scars, and pigmentation",
          "Deeply hydrates skin from within",
          "Soothes inflammation & reduces acne flare-ups",
        ]
      },
      {
        id: "item-2",
        question: "Ingredients",
        answer: [
          "Collagen Peptides",
          "Vitamin C",
          "Hyaluronic Acid",
          "Botanical Extracts",
        ]
      },
      {
        id: "item-3",
        question: "How to use",
        answer: [
          "Mix 1 sachet in a glass of water or smoothie daily.",
          "Use consistently for visible results in 4–6 weeks.",
        ]
      }
    ],
  }
];