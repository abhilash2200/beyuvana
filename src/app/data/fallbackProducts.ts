export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

export interface ActionItem {
  id: number;
  title: string;
  description: string;
  bgColor: string;
  hoverBgColor: string;
  headingColor: string;
  hoverHeadingColor: string;
  paragraphColor: string;
  hoverParagraphColor: string;
}

export interface WhyItem {
  id: number;
  img: string;
  hoverImg?: string;
  title: string;
  desc: string;
  bgColor: string;
  hoverBgColor: string;
  headingColor: string;
  hoverHeadingColor: string;
  paraColor: string;
  hoverParaColor: string;
}

export interface Compare {
  id: number;
  img: string;
  title: string;
  desc: string;
  bgColor: string;
  headingColor: string;
  paraColor: string;
}

export interface Builder {
  id: number;
  img: string;
  title: string;
  desc: string;
  bgColor: string;
  headingColor: string;
  paraColor: string;
}



export interface Product {
  id: number;
  name: string;
  tagline?: string;
  description?: string;
  certificateImg?: string;
  images: string[];
  faq?: FaqItem[];
  actionItems?: ActionItem[];
  whyItems?: WhyItem[];
  compare?: Compare[];
  builder?: Builder[];
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
    actionItems: [
      {
        id: 1,
        title: "Youthful Skin Powered by Plants and Modern Science",
        description: "This transformation is powered by a synergy of botanicals, antioxidants, and Ayurvedic adaptogens — uniting nature and science for timeless, radiant skin.",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9"
      },
      {
        id: 2,
        title: "11 Holistic Functions in Every Serving",
        description: "Collagen Boost from Within, Skin Hydration & Plumping, Brightens Skin Tone & Fades Pigmentation, Reduces Fine Lines & Wrinkles, Balances Stress-Aging & Hormones, UV & Pollution Defense, Anti-Inflammatory.",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9"
      },
      {
        id: 3,
        title: "Formulated for Maximum Absorption",
        description: "Crafted with clinically backed, plant-based actives—absorbed deeply to deliver real, visible results from within. No added sugar, no shortcuts—just pure, purposeful nutrition your skin genuinely responds to.",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9"
      },
    ],
    whyItems: [
      {
        id: 1,
        img: "/assets/img/product-details/hydrated-skin.png",
        title: "Stimulates Natural\nCollagen Production",
        desc: "Unlike animal collagen powders that simply supply broken peptides, BEYUVANA™ uses amino acids (L-Lysine, L-Proline), Vitamin C, and bamboo silica to naturally boost your body’s own collagen-building process — from within.",
        bgColor: "#F8FFF9",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#000000",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 2,
        img: "/assets/img/product-details/hydrated-skin.png",
        title: "Deep Hydration &\nSkin Barrier Repair",
        desc: "With Hyaluronic Acid and Amla the formula restores moisture balance, plumps the skin, and strengthens the barrier — essential for smooth, youthful skin.",
        bgColor: "#F8FFF9",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/img/product-details/acne-treatment.png",
        title: "Deep Hydration &\nSkin Barrier Repair",
        desc: "Clinically studied actives like Glutathione, Licorice, and Grape Seed Extract gently reduce oxidative stress and pigmentation, giving your skin a radiant glow.",
        bgColor: "#F8FFF9",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
    ],
    compare: [
      {
        id: 1,
        img: "/assets/img/product-details/compare-11.png",
        title: "Lines that used to stay... started to fade.",
        desc: "I noticed the difference by week 4. My skin felt tighter, especially around the eyes and mouth. Now, even without makeup, the fine lines are visibly reduced.",
        bgColor: "#122014",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 2,
        img: "/assets/img/product-details/compare-11.png",
        title: "Lines that used to stay... started to fade.",
        desc: "I noticed the difference by week 4. My skin felt tighter, especially around the eyes and mouth. Now, even without makeup, the fine lines are visibly reduced.",
        bgColor: "#122014",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/img/product-details/compare-11.png",
        title: "Lines that used to stay... started to fade.",
        desc: "I noticed the difference by week 4. My skin felt tighter, especially around the eyes and mouth. Now, even without makeup, the fine lines are visibly reduced.",
        bgColor: "#122014",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
    ],
    builder: [
      {
        id: 1,
        img: "/assets/img/product-details/builder.png",
        title: "Noticing early signs of aging",
        desc: "BEYUVANA™ is designed for modern individuals who want results without compromise —using only clean, plant-based ingredients that are backed by science and safe for everyday use.",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 2,
        img: "/assets/img/product-details/builder.png",
        title: "Young Professionals dealing with stress, screen time & pollution",
        desc: "Ashwagandha, Green Tea, and Astaxanthin combat oxidative stress, pollution damage, and fatigue-related skin aging — while balancing internal stress hormones.",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 3,
        img: "/assets/img/product-details/builder.png",
        title: "Lines that used to stay... started to fade.",
        desc: "I noticed the difference by week 4. My skin felt tighter, especially around the eyes and mouth. Now, even without makeup, the fine lines are visibly reduced.",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
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
    description: "Glow Essence is an advanced, 100% vegetarian, skin-nourishing formula enriched with 18 synergistic plant- based actives, designed to unlock visible clarity and radiance from within. Infused with 4X Liposomal Glutathione and clinically studied Vitamin C, it ",
    certificateImg: "/assets/img/product-details/certificate.png",
    images: [
      "/assets/img/product-details/collagen-pink-product.png",
      "/assets/img/product-details/collagen-pink-side.png",
      "/assets/img/product-details/collagen-pink-info.png",
      "/assets/img/product-details/collagen-pink-ingredients.png",
    ],
    actionItems: [
      {
        id: 1,
        title: "Radiant Skin, Backed by Nature and Science",
        description: "Including 4X Liposomal Glutathione, Vitamin C, and Hyaluronic Acid—for powerful results from the inside out.It targets dark spots, dullness, acne, hydration, and gut balance—delivering visible clarity, glow, and even tone in just 6–8 weeks.",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF"
      },
      {
        id: 2,
        title: "10 Advanced Skin-Optimizing Actions",
        description: "Brightens skin tone, enhances radiance, and visibly fades pigmentation and dark spots. Combats acne, soothes breakouts, and repairs the skin barrier for stronger, healthier skin. Reduces redness, sensitivity, and inflammation while deeply hydrating and plumping from within.",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF"
      },
      {
        id: 3,
        title: "Fast-Acting Formula, Better Absorption",
        description: "Expertly absorbed for faster to target skin concerns from deep within. No sugar. No fillers. Just pure, high-performance skin nutrition your body truly recognizes and responds to.",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF"
      },
    ],
    whyItems: [
      {
        id: 1,
        img: "/assets/img/product-details/hydrated-skin.png",
        title: "Brightens Skin & Fades\nPigmentation",
        desc: "L-Glutathione + Vitamin C: Reduce melanin, boost glow, Licorice Extract, Amla, Lemon Powder: Naturally fade dark spots, Vitamin B3 : Evens out skin tone, improves radiance. Visible glow & reduced pigmentation",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#000000",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 2,
        img: "/assets/img/product-details/hydrated-skin.png",
        title: "Hydrates & Plumps\nSkin",
        desc: "Hyaluronic Acid : Deep hydration. Inulin + Bamboo Extract: Locks moisture, improves texture. Skin feels dewy, hydrated, and elastic",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/img/product-details/acne-treatment.png",
        title: "Fights Acne &\nInflammation",
        desc: "Neem, Green Tea, Curcuma, Guava Leaf: Clear acne & calm redness. Ashwagandha: Reduces stress- triggered breakouts. Clearer, calmer skin",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
    ],
    compare: [
      {
        id: 1,
        img: "/assets/img/product-details/compare-12.png",
        title: "“My skin started glowing from within — no filters needed.”",
        desc: "I began noticing a visible difference in just 2 weeks. The dark spots around my cheeks started fading, my skin felt more hydrated, and even my gut felt lighter. By week 4, people were asking what I’m using — and I haven’t changed my skincare. It’s just Glow Essence.",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 2,
        img: "/assets/img/product-details/compare-12.png",
        title: "Lines that used to stay... started to fade.",
        desc: "I began noticing a visible difference in just 2 weeks. The dark spots around my cheeks started fading, my skin felt more hydrated, and even my gut felt lighter. By week 4, people were asking what I’m using — and I haven’t changed my skincare. It’s just Glow Essence.",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/img/product-details/compare-12.png",
        title: "Lines that used to stay... started to fade.",
        desc: "I began noticing a visible difference in just 2 weeks. The dark spots around my cheeks started fading, my skin felt more hydrated, and even my gut felt lighter. By week 4, people were asking what I’m using — and I haven’t changed my skincare. It’s just Glow Essence.",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
    ],
    builder: [
      {
        id: 1,
        img: "/assets/img/product-details/builder.png",
        title: "If you’re tired of dark spots, tanning, or uneven skin tone",
        desc: "Glow Essence targets pigmentation from the root, giving visibly brighter, even-toned skin. Glutathione, Amla, Licorice, and Vitamin C reduce melanin and fade stubborn pigmentation. This blend helps restore a more luminous complexion without needing harsh creams or peels.",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 2,
        img: "/assets/img/product-details/builder.png",
        title: "If your skin looks dull and lacks glow",
        desc: "For those who feel their skin looks tired or lifeless — this restores that fresh, healthy glow. Guava Leaf, Lemon Powder, and Niacinamide work together to increase natural radiance.They boost cellular energy and circulation, helping your skin glow from within.",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/img/product-details/builder.png",
        title: "Lines that used to stay... started to fade.",
        desc: "I noticed the difference by week 4. My skin felt tighter, especially around the eyes and mouth. Now, even without makeup, the fine lines are visibly reduced.",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
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