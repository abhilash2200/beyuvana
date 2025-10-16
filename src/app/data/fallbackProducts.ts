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

export interface Plant {
  id: number;
  img: string;
  title: string;
  description: string;
  bgColor: string;
  headingColor: string;
  paragraphColor: string;
  plusColor: string;
  xColor: string;
}

export interface TabStats {
  value: string;
  description: string;
  source: string;
}

export interface TabExtra {
  title: string;
  description: string;
  source: string;
}

export interface TabItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  img: string;
  stats: TabStats[];
  extra: TabExtra;
  bgColor?: string;
  headingColor?: string;
}

export interface Product {
  id: number;
  name: string;
  tagline?: string;
  description?: string[];
  certificateImg?: string;
  // Optional gallery shown in the certificates dialog
  certificateImages?: string[];
  images: string[];
  faq?: FaqItem[];
  customFaq?: FaqItem[]; // New property for custom FAQ data
  actionItems?: ActionItem[];
  whyItems?: WhyItem[];
  compare?: Compare[];
  builder?: Builder[];
  plants?: Plant[];
  tabItems?: TabItem[];
  // Uppercase design type flag to drive layout selection (GREEN -> Product1Layout, PINK -> Product2Layout)
  design_type?: "GREEN" | "PINK";
}

export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "BEYUVANA™ Premium Collagen Builder— Complete Anti-Aging Solution",
    design_type: "GREEN",
    tagline: "Aging is Natural — Radiance is a Choice",
    description: [
      "Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. ",
      "Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid. Defends against stress-aging, pollution, and hormonal imbalance with powerful adaptogens.",
      "Enriched with antioxidants like Glutathione, CoQ10 & Astaxanthin for visible age reversal. ",
      "100% vegetarian. Sugar-free. No marine or bovine — only clean, conscious skin nutrition. ",
    ],
    certificateImg: "/assets/img/product-details/certificate.png",
    certificateImages: [
      "/assets/img/product-details/Green_1.png",
      "/assets/img/product-details/Green_2.png",
      "/assets/img/product-details/Green_3.png",
    ],
    images: [
      "/assets/img/product-details/Green_1.png",
      "/assets/img/product-details/Green_2.png",
      "/assets/img/product-details/Green_3.png",
      "/assets/img/product-details/Green_4.png",
      "/assets/img/product-details/Green_5.png",
    ],
    actionItems: [
      {
        id: 1,
        title: "Youthful Skin Powered by Plants and Modern Science",
        description:
          "Supports elasticity, hydration, and wrinkle repair with a synergistic blend of bioactive herbs, adaptogens, and amino acids. Naturally boosts collagen production, improves elasticity by up to 53%, and reduces visible signs of aging — without marine or bovine sources.",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 2,
        title: "11 Holistic Functions in Every Serving",
        description:
          "Collagen Boost from Within, Skin Hydration & Plumping, Brightens Skin Tone & Fades Pigmentation, Reduces Fine Lines & Wrinkles, Balances Stress-Aging & Hormones, UV & Pollution Defense, Anti-Inflammatory & Acne Support, Gut-Skin Axis Support, Cellular Detox & Radiance Boost, and Complete Skin Protection — powered by 21 synergistic actives, each with a defined purpose. ",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 3,
        title: "Formulated for Maximum Absorption",
        description:
          "Crafted with clinically backed, plant-based actives—absorbed deeply to deliver real, visible results from within.\nNo added sugar, no shortcuts—just pure, purposeful nutrition your skin genuinely responds to",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 4,
        title: "18 Skin-Loving Ingredients",
        description:
          "Every ingredient works in harmony to hydrate, repair, and revive your natural glow delivering real results within 5 to 10 weeks. ",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 5,
        title: "Naturally Sweetened with Stevia. No Added Sugar",
        description:
          "Enjoy a clean, guilt-free taste without compromising your health or results. Crafted for daily use, with zero sugar spikes, bloating, or aftertaste.",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 6,
        title: "Adaptogens for Stress and Hormone Support",
        description:
          "Ashwagandha, Shatavari, and Gotu Kola help support internal balance and calm.",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 7,
        title: "Supports Gut-Skin Connection",
        description:
          "Botanicals like Amla and Pomegranate gently assist digestive wellness and skin clarity. ",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 8,
        title: "Free from Gelatin and Animal Byproducts",
        description:
          "No collagen from animals. No hidden ingredients. Purely plant-powered. ",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 9,
        title: "100% Vegetarian",
        description:
          "Made without animal collagen, gelatin, or byproducts—just plant-based wellness, thoughtfully crafted for conscious self-care. ",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
      {
        id: 10,
        title: "Designed as a Gentle Daily Ritual ",
        description:
          "A simple mix-and-sip routine to support mindful, plant-powered self-care every day.",
        bgColor: "#E2F9E5",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#E0F2E9",
      },
    ],
    whyItems: [
      {
        id: 1,
        img: "/assets/img/product-details/stimulates.png",
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
        img: "/assets/img/product-details/deep.png",
        title: "Deep Hydration &\nSkin Barrier Repair",
        desc: "With Hyaluronic Acid, Amla, and Aloe Vera, the formula restores moisture balance, plumps the skin, and strengthens the barrier — essential for smooth, youthful skin. ",
        bgColor: "#F8FFF9",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/img/product-details/brightens.png",
        title: "Brightens Skin &\nFades Pigmentation",
        desc: "Clinically studied actives like Glutathione, Licorice, and Grape Seed Extract gently reduce oxidative stress and pigmentation, giving your skin a radiant glow.",
        bgColor: "#F8FFF9",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 4,
        img: "/assets/img/product-details/fights.png",
        title: "Fights Wrinkles &\nFine Lines",
        desc: "Astaxanthin, CoQ10, and Vitamin E support skin elasticity and reduce signs of aging by protecting against free radicals and UV-related damage. ",
        bgColor: "#F8FFF9",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 5,
        img: "/assets/img/product-details/reduces.png",
        title: "Reduces Stress-Aging\n& Balances Hormones",
        desc: "Adaptogens like Ashwagandha and Shatavari help regulate cortisol and hormonal fluctuations — often overlooked contributors to aging skin.",
        bgColor: "#F8FFF9",
        hoverBgColor: "#0C4B33",
        headingColor: "#0C4B33",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 6,
        img: "/assets/img/product-details/supports.png",
        title: "Supports Gut-Skin\nAxis & Detoxification",
        desc: "With herbs like Aloe Vera and Amla, it promotes gentle cleansing and gut health — which reflects visibly on your skin.",
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
        img: "/assets/img/product-details/compare-13.png",
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
        img: "/assets/img/product-details/green-who/1.png",
        title: "Noticing early signs of aging",
        desc: "Fine lines, dryness, and dullness are common after 25. BEYUVANA™ delivers Glutathione, Hyaluronic Acid, and CoQ10 to deeply hydrate, support collagen, and visibly improve texture. ",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 2,
        img: "/assets/img/product-details/green-who/2.png",
        title:
          "Young Professionals dealing with stress, screen time & pollution",
        desc: "Ashwagandha, Green Tea, and Astaxanthin combat oxidative stress, pollution damage, and fatigue-related skin aging — while balancing internal stress hormones.",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 3,
        img: "/assets/img/product-details/green-who/3.png",
        title: "Vegetarians avoiding animal collagen",
        desc: "Formulated with L-Lysine, Vitamin C, and Bamboo Extract, BEYUVANA™ stimulates your natural collagen production — no bovine or marine collagen needed.",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 4,
        img: "/assets/img/product-details/green-who/4.png",
        title: "Wellness Seekers focused on holistic skin health",
        desc: "Adaptogens, antioxidants, and gut-friendly herbs like Amla and Aloe Vera support the gutskin axis, hormone balance, and full-body skin glow from within.",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 5,
        img: "/assets/img/product-details/green-who/5.png",
        title: "Moms & Busy Individuals needing easy, smart self-care",
        desc: "One sachet a day delivers 21 synergistic actives including Licorice, Grape Seed Extract, and Hyaluronic Acid — making glow and firmness part of your daily routine.",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 6,
        img: "/assets/img/product-details/green-who/6.png",
        title: "Anyone avoiding, sugar, or animal-based products",
        desc: "Enriched with plant-based actives, sugar-free, and gelatin-free — every ingredient is purposeful, and designed to nourish your skin at every level. ",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 7,
        img: "/assets/img/product-details/green-who/7.png",
        title: "Those Seeking a Natural, Lasting Glow",
        desc: "Glutathione, Amla, and Astaxanthin work together to brighten dull skin, enhance radiance, and promote even skin tone — naturally and gently. ",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 8,
        img: "/assets/img/product-details/green-who/8.png",
        title: "Those Battling Pigmentation & Uneven Tone",
        desc: "Licorice, Grape Seed Extract, and Vitamin C help reduce hyperpigmentation, sun damage, and dark spots — supporting a more even, luminous complexion over time.",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
      {
        id: 9,
        img: "/assets/img/product-details/green-who/9.png",
        title: "Those with Gut Issues Affecting Skin Health",
        desc: "Amla, and adaptogenic herbs support the gut-skin axis by reducing inflammation, improving digestion, and promoting clearer, healthier-looking skin from within ",
        bgColor: "#CFE9D3",
        headingColor: "#303030",
        paraColor: "#000000",
      },
    ],
    tabItems: [
      {
        id: "tab1",
        icon: "/assets/img/product-details/aging.png",
        label: "Aging",
        description:
          "With age, your skin’s natural production of collagen and hyaluronic acid begins to decline — quietly reducing firmness, suppleness, and radiance. The result? Fine lines, sagging, and a visible loss of youthful glow. ",
        img: "/assets/img/product-details/aging-1.png",
        stats: [
          {
            value: "25%",
            description: "Collagen loss by age 45",
            source: "National Library of Medicine",
          },
          {
            value: "50%",
            description: "Reduction in hyaluronic acid by age 40",
            source: "National Library of Medicine",
          },
        ],
        extra: {
          title: "After 25,",
          description: "collagen declines",
          source: "Shuster et al.",
        },
      },
      {
        id: "tab2",
        icon: "/assets/img/product-details/stress.png",
        label: "Stress",
        description:
          "High cortisol levels from stress quietly slow down your skin’s ability to heal, break down collagen faster, and reduce glow — leading to visible aging and loss of youthful firmness.",
        img: "/assets/img/product-details/mstress.png",
        stats: [
          {
            value: "43.5%",
            description: "Report duller skin during stress",
            source: "Contemporary OB/GYN.",
          },
          {
            value: "40%",
            description: "Slower wound healing under chronic stress",
            source: "The Lancet",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab3",
        icon: "/assets/img/product-details/pollution.png",
        label: "Pollution",
        description:
          "Pollution silently accelerates skin aging by triggering oxidative stress, chronic inflammation, and weakening the skin’s protective barrier — leading to dullness, sensitivity, and premature loss of firmness and radiance. ",
        img: "/assets/img/product-details/mpollution.png",
        stats: [
          {
            value: "20%",
            description: "More pigmentation in women exposed to urban pollution",
            source: "Science Direct",
          },
          {
            value: "1.5x",
            description: "Higher skin barrier damage",
            source: "National Library of Medicin",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab4",
        icon: "/assets/img/product-details/uv.png",
        label: "UV Radiation",
        description:
          "UV Radiation deeply damages the skin by breaking down collagen and elastin — resulting in premature wrinkles, loss of firmness, and uneven tone that dulls your natural radiance over time. ",
        img: "/assets/img/product-details/uv-radiation.png",
        stats: [
          {
            value: "80%",
            description: "Of visible aging is due to sun exposure",
            source: "National Library of Medicine",
          },
          {
            value: "2x",
            description: "More wrinkles in people with high UV exposure",
            source: "National Library of Medicine",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab5",
        icon: "/assets/img/product-details/uv.png",
        label: "Disrupted Sleep Pattern",
        description:
          "Disrupted sleep patterns impair the skin’s overnight renewal cycle, increasing cortisol and accelerating collagen loss — leading to visible dullness, dryness, and early signs of aging. ",
        img: "/assets/img/product-details/disruptive-sleep-pattern.png",
        stats: [
          {
            value: "35%",
            description: "Of visible aging is due to DISRUPTED SLEEP PATTERN",
            source: "National Library of Medicine",
          },
          {
            value: "",
            description: "",
            source: "",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab6",
        icon: "/assets/img/product-details/uv.png",
        label: "Poor Gut Health",
        description:
          "An imbalanced gut disrupts nutrient absorption, triggers inflammation, and weakens the skin barrier — leading to breakouts, uneven tone, and loss of natural glow from within.",
        img: "/assets/img/product-details/poor-gut-health.png",
        stats: [
          {
            value: "40%",
            description: " Of visible aging is due to POOR GUT HEALTH",
            source: "",
          },
          {
            value: "",
            description: "",
            source: "",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
    ],
    faq: [
      {
        id: "item-1",
        question: "Benefits",
        answer: [
          "•  Boosts natural collagen production ",
          "•  Deeply hydrates and plumps skin ",
          "•  Brightens skin tone and fades pigmentation",
          "•  Reduces fine lines and wrinkles",
          "•  Balances hormones and stress-related aging ",
          "•  Protects against UV and pollution damage",
          "•  Improves gut-skin connection for clear skin",
          "•  Fights inflammation and acne breakouts",
          "•  Supports detoxification and skin cell repair",
          "•  100% Vegetarian , sugar-free, and Advance Plant Derived  formulation",
        ],
      },
      {
        id: "item-2",
        question: "Ingredients",
        answer: [
          "•  Amla Extract (25% Vitamin C)",
          "•  Bamboo Extract (70% Silica)",
          "•  L-Lysine (Vegan)",
          "•  L-Proline (Vegan)",
          "•  Coenzyme Q10",
          "•  Astaxanthin",
          "•  Resveratrol",
          "•  Glutathione",
          "•  Hyaluronic Acid",
          "•  Vitamin C",
          "•  Vitamin E",
          "•  Biotin",
          "•  Zinc",
          "•  Selenium",
          "•  Grape Seed Extract",
          "•  Pomegranate Extract",
          "•  Green Tea Extract",
          "•  Ashwagandha Extract",
          "•  Gotu Kola Extract",
          "•  Shatavari Extract",
          "•  Stevia",
          "•  Pineapple Flavor",
        ],
      },
      {
        id: "item-3",
        question: "How to use",
        answer: [
          "Take 1 sachet daily – your effortless daily ritual for youthful, radiant skin. ",
          "Consistency is key – visible transformation begins with regular use over 5–10 weeks.",
          "Best time to consume – enjoy it every morning on an empty stomach or before bedtime for optimal absorption. ",
        ],
      },
    ],
    customFaq: [
      {
        id: "01",
        question: "What is BEYUVANA™ Premium Collagen Builder? ",
        answer: [
          "BEYUVANA™ Premium Collagen Builder is a 100% vegetarian daily supplement formulated with 21 synergistic plant-based actives that support natural collagen production, skin hydration, radiance, and overall skin wellness — without using marine or animal collagen. ",
        ],
      },
      {
        id: "02",
        question: "How does it support collagen production without animal collagen?",
        answer: [
          "Our formula includes nutrients like Amla Extract (Vitamin C), Bamboo Extract (Silica), L-Lysine, and L-Proline, which are essential building blocks for collagen synthesis in the body. ",
        ],
      },
      {
        id: "03",
        question: "What benefits can I expect? ",
        answer: ["Regular use may help:",
          "• Support natural collagen production",
          "• Promote skin hydration and elasticity (Hyaluronic Acid)",
          "• Improve skin radiance and even tone (Glutathione, Vitamin C, Vitamin E)",
          "• Support skin repair and protection (Antioxidants & plant extracts) ",
          "• Aid in overall skin wellness and stress balance (Adaptogens like Ashwagandha, Gotu Kola, Shatavari)",
        ],
      },
      {
        id: "04",
        question: "Is it suitable for vegetarians?",
        answer: ["Yes. BEYUVANA™ is 100% vegetarian, with no marine or bovine collagen and no animal-derived ingredients. "],
      },
      {
        id: "05",
        question:
          "Does it contain sugar or artificial sweeteners?",
        answer: [
          "No. It has no added sugar and uses only natural flavors.",
        ],
      },
      {
        id: "06",
        question:
          "When will I start noticing results?",
        answer: [
          "Results vary per individual, but with daily use, visible skin hydration and glow may be noticed within a few weeks, while deeper collagen support benefits are typically experienced over consistent use. ",
        ],
      },
      {
        id: "07",
        question:
          "Can it help with pigmentation and dull skin?",
        answer: [
          "Yes. Ingredients like Glutathione, Vitamin C, Grape Seed Extract, and Pomegranate Extract support skin radiance and help maintain an even skin tone.",
        ],
      },
      {
        id: "08",
        question:
          "Does it help with stress-related skin issues? ",
        answer: [
          "Yes. Our Ayurvedic Adaptogen Blend (Ashwagandha, Gotu Kola, Shatavari) helps the body adapt to stress, which may positively impact skin health. ",
        ],
      },
      {
        id: "09",
        question:
          "How is it different from ordinary collagen powders?",
        answer: [
          "Unlike marine or bovine collagen powders, BEYUVANA™ contains a complete blend of plant-based nutrients that help your body produce collagen naturally, along with antioxidants, vitamins, minerals, and adaptogens for overall skin wellness.",
        ],
      },
      {
        id: "10",
        question:
          "Can I consume Collagen Builder with other BEYUVANA™ supplements?",
        answer: [
          "Yes. BEYUVANA™ Premium Collagen Builder is made from plant-based actives and can generally be consumed along with other BEYUVANA™ supplements. If you are on medication or have specific health conditions, consult your healthcare professional before combining supplements. ",
        ],
      },
      {
        id: "11",
        question:
          "Is it safe? Are there any side effects? ",
        answer: [
          "BEYUVANA™ Premium Collagen Builder is formulated with well-researched plant-based ingredients that are generally considered safe for daily use within the recommended serving. No side effects are expected when consumed as directed. However, individuals with allergies to any listed ingredients, or those who are pregnant, breastfeeding, or on medication, should consult a healthcare professional before use.",
        ],
      },
    ],
    plants: [
      {
        id: 1,
        img: "/assets/gifs/astaxanthin.gif",
        title: "Ashwagandha Extract",
        description:
          "Rich in natural Vitamin C, it boosts collagen synthesis and combats oxidative stress—promoting firmer, more even-toned skin. ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 2,
        img: "/assets/gifs/bamboo.gif",
        title: "Bamboo Extract",
        description:
          "High in silica, it strengthens skin structure and supports collagen formation, improving elasticity and resilience. ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/gifs/l-lysine.gif",
        title: "L-Lysine",
        description:
          "Essential amino acid that supports collagen cross-linking, enhancing skin firmness and reducing signs of sagging. ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 4,
        img: "/assets/gifs/l-plorine.gif",
        title: "L-Proline",
        description:
          "Vital for collagen regeneration, it helps maintain skin texture, elasticity, and smoothness. ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 5,
        img: "/assets/gifs/horstail-plant.gif",
        title: "Horsetail Extract",
        description:
          "Natural source of silica and antioxidants that reinforce skin structure and combat agerelated degradation.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 6,
        img: "/assets/gifs/coenzyme.gif",
        title: "Coenzyme Q10",
        description:
          "Powers cellular energy, reduces wrinkle depth, and protects skin from oxidative damage.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 7,
        img: "/assets/gifs/astaxanthin.gif",
        title: "Astaxanthin",
        description:
          "One of the most potent natural antioxidants—helps reduce UV damage, boosts elasticity, and fights premature aging. ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 8,
        img: "/assets/gifs/reserveratrol.gif",
        title: "Resveratrol",
        description:
          "A powerful polyphenol that neutralizes free radicals and supports youthful skin regeneration.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 9,
        img: "/assets/gifs/glutathione.gif",
        title: "Glutathione",
        description:
          "Brightens skin, reduces pigmentation, and supports liver detox to promote a clearer, radiant complexion. ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 10,
        img: "/assets/gifs/hyaluronic-acid.gif",
        title: "Hyaluronic Acid",
        description:
          "Holds up to 1000x its weight in water—deeply hydrates and plumps skin for smoother texture and suppleness.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 11,
        img: "/assets/gifs/vitamin-c.gif",
        title: "Vitamin C",
        description:
          "Essential for collagen biosynthesis, it reduces dullness and pigmentation while enhancing glow.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 12,
        img: "/assets/gifs/vitamin-e.gif",
        title: "Vitamin E",
        description:
          "Antioxidant that protects against environmental damage, soothes inflammation, and promotes moisture retention.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 13,
        img: "/assets/gifs/biotin.gif",
        title: "Biotin",
        description:
          "Supports healthy skin, hair, and nails by strengthening keratin structure and maintaining hydration. ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 14,
        img: "/assets/gifs/zinc.gif",
        title: "Zinc",
        description:
          "Promotes healing, reduces acne, and balances sebum production for clearer skin.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 15,
        img: "/assets/gifs/selenium.gif",
        title: "Selenium",
        description:
          "Antioxidant that protects skin cells, enhances elasticity, and supports immune and thyroid health.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 16,
        img: "/assets/gifs/grape.gif",
        title: "Grape Seed Extract",
        description:
          "Rich in flavonoids, it enhances collagen health and defends against sun damage and inflammation.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 17,
        img: "/assets/gifs/pomegranate.gif",
        title: "Pomegranate Extract",
        description:
          "Packed with polyphenols, it boosts regeneration, fights pigmentation, and enhances glow.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 18,
        img: "/assets/gifs/tea.gif",
        title: "Green Tea Extract",
        description:
          "Reduces irritation, shields skin from pollution, and combats premature aging with potent antioxidants.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 19,
        img: "/assets/img/product-details/plant.png",
        title: "Ashwagandha Extract",
        description:
          "Reduces stress-induced aging and cortisol imbalance, supporting hormonal harmony and skin health.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 20,
        img: "/assets/gifs/gotu-kola.gif",
        title: "Gotu Kola Extract",
        description:
          "Enhances collagen production, boosts microcirculation, and accelerates wound healing and skin renewal.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 21,
        img: "/assets/gifs/shatavari.gif",
        title: "Shatavari Extract",
        description:
          "Balances hormones, reduces inflammation, and improves hydration and skin resilience from within. ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 22,
        img: "/assets/img/product-details/plant.png",
        title: "Stevia",
        description:
          "zero sugar or aftertaste—keeping the formulation clean and holistic.",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
      {
        id: 23,
        img: "/assets/img/product-details/plant.png",
        title: "Pineapple Flavor",
        description:
          "Adds a refreshing tropical taste that makes daily consumption enjoyable. Naturally derived ",
        bgColor: "#F0F8F0",
        headingColor: "#057A37",
        paragraphColor: "#666666",
        plusColor: "#057A37",
        xColor: "#FFFFFF",
      },
    ],
  },
  {
    id: 2,
    name: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
    design_type: "PINK",
    tagline: "Aging is Natural — Radiance is a Choice",
    description: [
      "Glow Essence is an advanced, 100% vegetarian, skin-nourishing formula enriched with 18 synergistic plant based actives, designed to unlock visible clarity and radiance from within. Infused with 4X Liposomal Glutathione and clinically studied Vitamin C,",
      "It works deep at the cellular level to visibly reduce dark spots, pigmentation, and dullness — revealing a brighter, more even-toned complexion.",
      "This potent blend of antioxidants, skin-repair nutrients, and gut-supporting botanicals helps restore internal balance and elevates skin vitality.",
    ],
    certificateImg: "/assets/img/product-details/certificate.png",
    certificateImages: [
      "/assets/img/product-details/Artboard_1.png",
      "/assets/img/product-details/Artboard_2.png",
      "/assets/img/product-details/Artboard_3.png",
    ],
    images: [
      "/assets/img/product-details/Artboard_1.png",
      "/assets/img/product-details/Artboard_2.png",
      "/assets/img/product-details/Artboard_3.png",
      "/assets/img/product-details/Artboard_4.png",
      "/assets/img/product-details/Artboard_5.png",
    ],
    actionItems: [
      {
        id: 1,
        title: "Radiant Skin, Backed by Nature and Science",
        description:
          "Including 4X Liposomal Glutathione, Vitamin C, and Hyaluronic Acid—for powerful results from the inside out.It targets dark spots, dullness, acne, hydration, and gut balance—delivering visible clarity, glow, and even tone in just 6–8 weeks. conscious skin nutrition designed to restore youthful luminosity—naturally and effectively. ",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 2,
        title: "10 Advanced Skin-Optimizing Actions",
        description:
          "Brightens skin tone, enhances radiance, and visibly fades pigmentation and dark spots. Combats acne, soothes breakouts, and repairs the skin barrier for stronger, healthier skin. Reduces redness, sensitivity, and inflammation while deeply hydrating and plumping from within. Boosts antioxidant defense, supports detoxification, and balances stress-induced skin triggers. Nourishes the gut-skin axis and delivers cellular-level nutrients for a lasting, luminous glow.FastActing Formula, Better Absorption ",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 3,
        title: "Fast-Acting Formula, Better Absorption",
        description:
          "Expertly absorbed for faster to target skin concerns from deep within. No sugar. No fillers. Just pure, high-performance skin nutrition your body truly recognizes and responds to.",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 4,
        title: "18 Advanced skin loving ingredients",
        description:
          "Each ingredient works in synergy to deeply hydrate, restore, and illuminate your skin—revealing visible results in just 5 to 10 weeks ",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 5,
        title: "No Sugar Added — Just the Goodness of Stevia",
        description:
          "Experience clean, plant-powered sweetness—free from sugar crashes, bloating, or bitterness. Designed for daily wellness with no compromise on taste or results.",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 6,
        title: "Advanced Acne Defence & Redness Control",
        description:
          "Powered by plant-based actives like Licorice, Green Tea, and Zinc, this advanced complex targets acne-causing inflammation, soothes active breakouts, and reduces visible redness—promoting a calm, clear, and balanced complexion. ",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 7,
        title: "Holistic Gut-Skin Balance",
        description:
          "Amla, Shatavari, and Ashwagandha balance the gut microbiome, reducing inflammation and stress-related skin concerns. This gut-skin axis approach ensures true clarity and glow from within. ",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 8,
        title: "Boosts Cellular Detox",
        description:
          "Glutathione and Grape Seed Extract support internal detox pathways, clearing out toxins that affect skin health. This results in clearer, fresher, and more balanced skin over time",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 9,
        title: "Protects from Environmental Stress",
        description:
          "Antioxidants like Amla, Grape Seed, and Green Tea fight oxidative damage from pollution and UV exposure. This protection prevents premature aging and dullness, keeping your skin youthful. ",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
      },
      {
        id: 10,
        title: "Enhances Natural Glow from Within",
        description:
          "Glow Essence blends 18 synergistic plant actives that nourish skin deeply from the inside out. This holistic nutrition approach supports glow, vitality, and long-lasting clarity in just weeks.  ",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paragraphColor: "#2B2B2B",
        hoverParagraphColor: "#FFFFFF",
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
        desc: "Hyaluronic Acid : Deep hydration. Inulin + Bamboo Extract: Locks moisture, improves texture. Skin feels dewy, hydrated, and elastic ",
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
        desc: "Neem, Green Tea, Curcuma, Guava Leaf: Clear acne & calm redness. Ashwagandha: Reduces stresstriggered breakouts. Clearer, calmer skin",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 4,
        img: "/assets/img/product-details/acne-treatment.png",
        title: "Boosts Collagen &\nRepairs Skin",
        desc: "L-Lysine + Vitamin C + Amla + Bamboo + Glutathione: Collagen support. Vitamin E: Barrier repair and skin firmness. Smoother, youthful-looking skin ",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 5,
        img: "/assets/img/product-details/acne-treatment.png",
        title: "Heals Skin\nfrom the Gut",
        desc: "Inulin (2 g): Prebiotic fiber for gut-skin balance. Lemon, Guava Leaf, Ashwagandha: Detox and reduce gut-driven skin issues. Piper Nigrum : Enhances nutrient absorption.  Glow starts from gut health",
        bgColor: "#FFE7E7",
        hoverBgColor: "#B00404",
        headingColor: "#B00404",
        hoverHeadingColor: "#FFFFFF",
        paraColor: "#333333",
        hoverParaColor: "#FFFFFF",
      },
      {
        id: 6,
        img: "/assets/img/product-details/acne-treatment.png",
        title: "Shields Skin from\nOxidative Damage",
        desc: "Glutathione, Vitamin C & E, Green Tea, Turmeric: Strong antioxidant shield. Protects from pollution, UV, and premature aging. ",
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
        title: "“My skin started glowing from within — no filters needed.” ",
        desc: "I began noticing a visible difference in just 2 weeks. The dark spots around my cheeks started fading, my skin felt more hydrated, and even my gut felt lighter. By week 4, people were asking what I’m using — and I haven’t changed my skincare. It’s just Glow Essence. ",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 2,
        img: "/assets/img/product-details/compare-12.png",
        title: "“My skin cleared up… and now it literally glows from within.” ",
        desc: "I started Glow Essence for my breakouts, and within 4 weeks, I could see a real difference — less redness, fewer pimples, and my skin felt calmer. My face feels soft, plump, and dewy even without using any creams. It’s like the Neem, Green Tea, and Hyaluronic Acid are working together from the inside.  ",
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
        desc: "For those who feel their skin looks tired or lifeless — this restores that fresh, healthy glow. Guava Leaf, Lemon Powder, and Niacinamide work together to increase natural radiance.They boost cellular energy and circulation, helping your skin glow from within. ",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/img/product-details/builder.png",
        title: "If you struggle with acne, redness, or breakouts",
        desc: "This is for people facing active acne, clogged pores, or hormonal skin flare-ups. Neem, Green Tea, Curcuma, and Guava Leaf fight acne-causing bacteria and soothe inflammation. They purify the skin internally, helping prevent future breakouts while calming existing ones. ",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 4,
        img: "/assets/img/product-details/builder.png",
        title: "If your skin feels dry, flaky, or dehydrated",
        desc: "If your skin lacks moisture and feels tight — this deeply hydrates from within. Hyaluronic Acid, Bamboo Extract, and Inulin replenish hydration at a cellular level. They lock in moisture and restore your skin barrier, making your skin soft and plump. ",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 5,
        img: "/assets/img/product-details/builder.png",
        title: "If your gut health is affecting your skin",
        desc: "For those dealing with hormonal acne, inflammation, or poor digestion-linked skin issues. Inulin, Ashwagandha, and Lemon Powder restore gut balance and reduce internal stressors. This improves nutrient absorption and skin clarity through the gut-skin axis. ",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 6,
        img: "/assets/img/product-details/builder.png",
        title: "If you want real results without relying on creams or filters",
        desc: "For those who want long-term visible improvement instead of temporary coverups. This is a daily drink that works from within — targeting the root of your skin concerns.It gives you healthier, more radiant skin naturally — without the need for makeup filters. ",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 7,
        img: "/assets/img/product-details/builder.png",
        title: "If stress or lifestyle is ruining your skin",
        desc: "Designed for modern lifestyles — work stress, lack of sleep, or hormonal imbalances. Adaptogens like Ashwagandha and Curcuma reduce cortisol and fight internal inflammation.They calm skin stress, reduce flare-ups, and support hormonal balance.",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
      {
        id: 8,
        img: "/assets/img/product-details/builder.png",
        title: "If you want better nutrient absorption for faster skin transformation",
        desc: "Because even the best actives won’t work if your body can’t absorb them well. Piper Nigrum (Black Pepper Extract) enhances bioavailability of key nutrients. This ensures faster, more visible results — maximizing every ingredient’s power.",
        bgColor: "#B00404",
        headingColor: "#FFFFFF",
        paraColor: "#FFFFFF",
      },
    ],
    tabItems: [
      {
        id: "tab1",
        icon: "/assets/img/product-details/aging.png",
        label: "Antioxidant Deficiency",
        description:
          "Lack of Glutathione, Vitamin C, and Grape Seed Extract can weaken the skin’s defence against dullness and damage. Glow Essence provides powerful antioxidants to fight oxidative stress and support a brighter complexion.",
        img: "/assets/img/product-details/aging-1.png",
        stats: [
          {
            value: "73.9%",
            description: "North India",
            source: "National Library of Medicine",
          },
          {
            value: "45.7%",
            description: "South India",
            source: "National Library of Medicine (PLOS One, 2011)",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab2",
        icon: "/assets/img/product-details/stress.png",
        label: "Chronic Inflammation",
        description:
          "Internal inflammation from stress or lifestyle triggers acne, redness, and uneven skin tone. Ingredients like Aloe Vera, Green Tea , and Ashwagandha in your formula help calm inflammation from within. ",
        img: "/assets/img/product-details/aging-1.png",
        stats: [
          {
            value: "Up to 35%",
            description: "low-grade chronic inflammation",
            source: "Study published in an NLM-indexed journal",
          },
          {
            value: "",
            description: "",
            source: "",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab3",
        icon: "/assets/img/product-details/pollution.png",
        label: "Dehydrated Skin",
        description:
          "When skin lacks moisture, it looks rough, tired, and flaky. Glow Essence contains Hyaluronic Acid and Aloe Vera that hydrate the skin from deep inside.",
        img: "/assets/img/product-details/aging-1.png",
        stats: [
          {
            value: "29%",
            description: "adults suffer from dry skin",
            source: "lPubMed, NLM-indexed journal. ",
          },
          {
            value: "",
            description: "",
            source: "",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab4",
        icon: "/assets/img/product-details/uv.png",
        label: "Weak Skin Barrier",
        description:
          "A damaged barrier lets in toxins and bacteria, leading to breakouts and sensitivity. Zinc, Biotin, and Vitamin E in your blend help strengthen the skin’s natural protective layer.",
        img: "/assets/img/product-details/aging-1.png",
        stats: [
          {
            value: "",
            description: "",
            source: "",
          },
          {
            value: "",
            description: "",
            source: "",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab5",
        icon: "/assets/img/product-details/uv.png",
        label: "Melanin Overproduction",
        description:
          "Overproduction of melanin causes pigmentation, dark spots, and uneven tone. Your formula’s Glutathione, Licorice, and Vitamin C work together to balance melanin levels and reduce pigmentation. ",
        img: "/assets/img/product-details/aging-1.png",
        stats: [
          {
            value: "30%",
            description: "Indian women",
            source: "NLM-indexed dermatology studies ",
          },
          {
            value: " 70%",
            description: "those under 35",
            source: "largely due to poor nutritional conditions.",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
      {
        id: "tab6",
        icon: "/assets/img/product-details/uv.png",
        label: "Nutrient Gaps in Diet",
        description:
          "Poor diet leads to deficiencies that affect skin health and glow. Glow Essence fills those gaps with a plant-based blend rich in vitamins, minerals, and skin-essential nutrients.",
        img: "/assets/img/product-details/aging-1.png",
        stats: [
          {
            value: "61%",
            description: " Vitamin D, B12",
            source:  "NLM-indexed meta-analyses and national nutrition surveys",
          },
          {
            value: "",
            description: "",
            source: "",
          },
        ],
        extra: {
          title: "",
          description: "",
          source: "",
        },
      },
    ],
    faq: [
      {
        id: "item-1",
        question: "Benefits",
        answer: [
          "•  Brightens skin tone & promotes natural radiance",
          "•  Fades dark spots, acne scars, and pigmentation",
          "•  Deeply hydrates skin from within",
          "•  Soothes inflammation & reduces acne flare-ups",
          "•  Balances gut microbiome to enhance skin clarity",
          "•  Fights oxidative stress caused by pollution & UV ",
          "•  Strengthens skin barrier for improved texture",
          "•  Supports collagen synthesis & elasticity",
          "•  Boosts skin repair & resilience",
          "•  Provides holistic skin & gut health synergy",
        ],
      },
      {
        id: "item-2",
        question: "Ingredients",
        answer: [
          "•  Inulin",
          "•  Lemon Powder",
          "•  Amla Dry Extract",
          "•  L-Glutathione",
          "•  Guava Leaf Extract",
          "•  L-Lysine",
          "•  Licorice Extract",
          "•  Neem Extract",
          "•  Green Tea Extract",
          "•  Bamboo Extract",
          "•  Ashwagandha Powder",
          "•  Curcuma Longa (Turmeric)",
          "•  Vitamin C",
          "•  Hyaluronic Acid",
          "•  Vitamin B3",
          "•  Piper Nigrum",
          "•  Vitamin E",
          "•  STEVIA",
        ],
      },
      {
        id: "item-3",
        question: "How to use",
        answer: [
          "• Take 1 sachet daily – your effortless daily ritual for youthful, radiant skin.",
          "• Consistency is key – visible transformation begins with regular use over 5–10 weeks.",
          "• Best time to consume – enjoy it every morning on an empty stomach or before bedtime for optimal absorption. ",
        ],
      },
    ],
    customFaq: [
      {
        id: "01",
        question: "What is BEYUVANA™ Glow Essence? ",
        answer: [
          "Glow Essence is a delicious plant-powered skin brightening drink that helps reduce dark spots, acne, pigmentation, and dullness from within. It contains 18 advanced ingredients, including 4X Liposomal Glutathione, Liposomal Vitamin C, Biotin, Zinc, and powerful Ayurvedic botanicals like Licorice, Amla, Shatavari, and Ashwagandha. ",
        ],
      },
      {
        id: "02",
        question: "What makes Glow Essence different from other skin supplements?",
        answer: [
          "Unlike typical capsules or tablets, Glow Essence is a sachet-based powder that’s more bioavailable and easier to absorb. It combines liposomal antioxidants, gut-supporting botanicals, and adaptogens that treat the root causes of dull, uneven, or acne-prone skin.",
        ],
      },
      {
        id: "03",
        question: " How soon will I start seeing results?",
        answer: [
          "Most users begin to see visible glow and reduced pigmentation from Week 3, with deep skin rejuvenation, hydration, and reduced breakouts by Week 8–10, depending on consistency and lifestyle. ",
        ],
      },
      {
        id: "04",
        question: "How is this better than a skin serum?",
        answer: [
          "Serums work only on the outer layer of your skin. Glow Essence works from the inside out, targeting hormonal imbalances, oxidative stress, poor gut health, and inflammation — the real causes of dull and problematic skin.",
        ],
      },
      {
        id: "05",
        question: "Is this suitable for all skin types?",
        answer: [
          "Yes. Glow Essence is designed for all Indian skin types and tones. It works by supporting your skin from the inside regardless of whether you have oily, dry, acne-prone, or sensitive skin. ",
        ],
      },
      {
        id: "06",
        question: "Are there any side effects?",
        answer: [
          "Glow Essence is carefully formulated using research-backed ingredients like Liposomal Glutathione, Vitamin C, Licorice, Grape Seed Extract, and Ayurvedic botanicals. These ingredients are generally welltolerated and have been studied for their safety and skin benefits. ",
          "Glow Essence does not contain sugar, gelatine, , making it suitable for long-term use.",
          "As with any supplement, individual responses may vary. If you have a medical condition or are on any medication, it’s best to consult your healthcare provider before use.",
        ],
      },
      {
        id: "07",
        question: "Does it help with acne and acne marks? ",
        answer: [
          "Yes. It contains Glutathione, Zinc, Green Tea (50% EGCG), Biotin, and Pomegranate Extract, which together reduce acne-causing inflammation and fade post-acne pigmentation. ",
        ],
      },
      {
        id: "08",
        question: "Can men use Glow Essence too? ",
        answer: [
          "Absolutely! Glow Essence is gender-neutral and effective for both men and women who want clear, bright, and healthy skin.  ",
        ],
      },
      {
        id: "09",
        question: "Is it safe for long-term use? ",
        answer: [
          "Yes. All ingredients are plant-based and clinically studied for long-term use. In fact, consistent daily use gives better results over time.  ",
        ],
      },
      {
        id: "10",
        question: "How do I take it?",
        answer: [
          "Just mix 1 sachet (8g) in a glass of water, stir, and drink it once daily—preferably on an empty stomach or post-meal. The delicious berry flavor makes it a treat you’ll look forward to. ",
        ],
      },
      {
        id: "11",
        question: "Can I take Glow Essence if I am pregnant or breastfeeding?",
        answer: [
          "While there are no known side effects, it's important to consult your doctor before taking Skin Brilliance if you're pregnant, breastfeeding, or lactating.",
        ],
      },
      {
        id: "12",
        question: "Does Glutathione cause weight gain?",
        answer: [
          "No, Glutathione actually supports weight loss by helping the body switch from fat production to muscle development. It can also boost metabolism and aid in detoxification.",
        ],
      },
      {
        id: "13",
        question: "Can I consume GLOW ESSENCE with other BEYUVANA™ supplements? Is it safe? ",
        answer: [
          "Yes, Glow Essence is formulated with research-backed, plant-derived actives and can generally be taken alongside other BEYUVANA™ supplements, provided there is no ingredient overlap or excessive nutrient duplication.",
          "BEYUVANA™ supplements are designed to be safe, and gentle on the body — but personal needs may vary. ",
        ],
      },
    ],
    plants: [
      {
        id: 1,
        img: "/assets/img/product-details/plant.png",
        title: "Inulin",
        description:
          "Supports healthy digestion by feeding good gut bacteria and improving nutrient absorption.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 2,
        img: "/assets/img/product-details/plant.png",
        title: "Lemon Powder",
        description:
          "Gently detoxifies, brightens skin from within, and supports natural collagen synthesis. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 3,
        img: "/assets/img/product-details/plant.png",
        title: "Amla Dry Extract ",
        description:
          "A powerful source of Vitamin C to boost collagen, immunity, and skin radiance. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 4,
        img: "/assets/img/product-details/plant.png",
        title: "L-Glutathione",
        description:
          "The body’s master antioxidant that brightens skin, reduces pigmentation, and fights oxidative stress. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 5,
        img: "/assets/img/product-details/plant.png",
        title: "Guava Leaf Extract",
        description:
          "Rich in antioxidants that support clear skin, reduce inflammation, and help in acne control. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 6,
        img: "/assets/img/product-details/plant.png",
        title: "L-Lysine",
        description:
          "An essential amino acid that helps rebuild collagen and supports youthful, firm skin. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 7,
        img: "/assets/img/product-details/plant.png",
        title: "Liquorice Extract",
        description:
          "Naturally brightens skin, reduces dark spots, and calms inflammation. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 8,
        img: "/assets/img/product-details/plant.png",
        title: "Neem Extract",
        description:
          "Purifies the skin and blood, helps fight acne-causing bacteria, and soothes irritation. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 9,
        img: "/assets/img/product-details/plant.png",
        title: "Green Tea Extract",
        description:
          "Fights free radicals, controls oil, reduces breakouts, and supports clear, calm skin. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 10,
        img: "/assets/img/product-details/plant.png",
        title: "Bamboo Extract ",
        description:
          "A rich plant source of silica, promoting firm skin, strong nails, and healthy hair.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 11,
        img: "/assets/img/product-details/plant.png",
        title: "Ashwagandha Powder",
        description:
          "An adaptogen that balances cortisol, reduces stress, and prevents stress-related skin aging.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 12,
        img: "/assets/img/product-details/plant.png",
        title: "Curcuma Longa (Turmeric) ",
        description:
          "Fights inflammation and pigmentation, helping brighten and even out skin tone.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 13,
        img: "/assets/img/product-details/plant.png",
        title: " Vitamin C",
        description:
          " Boosts natural collagen production, protects skin from damage, and supports a healthy glow.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 14,
        img: "/assets/img/product-details/plant.png",
        title: " Hyaluronic Acid ",
        description:
          "Deeply hydrates from within, plumping the skin and smoothing out fine lines.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 15,
        img: "/assets/img/product-details/plant.png",
        title: "Steviol Glycosides",
        description:
          "A natural plant-based sweetener with zero calories and no blood sugar spikes.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 16,
        img: "/assets/img/product-details/plant.png",
        title: "Vitamin B3 (Niacinamide)",
        description:
          " Improves skin texture, reduces enlarged pores, and enhances skin brightness.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 17,
        img: "/assets/img/product-details/plant.png",
        title: "Piper Nigrum (Black Pepper)",
        description:
          " Enhances the bioavailability of nutrients for better absorption and effectiveness.",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
      {
        id: 18,
        img: "/assets/img/product-details/plant.png",
        title: "Vitamin E",
        description:
          "A skin-protecting antioxidant that supports hydration, repair, and barrier function. ",
        bgColor: "#FFE7E7",
        headingColor: "#B00404",
        paragraphColor: "#666666",
        plusColor: "#B00404",
        xColor: "#FFFFFF",
      },
    ],
  },
];
