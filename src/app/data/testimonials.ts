export interface TestimonialData {
  id: string;
  customerName: string;
  customerImage: string;
  testimonialText: string;
  productImage: string;
  productDescription: string;
  rating: number;
}

export const testimonialsData: TestimonialData[] = [
  {
    id: "ramesh-kumar",
    customerName: "Ramesh Kumar",
    customerImage: "/assets/img/ramesh.png",
    testimonialText: "Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives. Clean, light flavor powered by nature. Just the right hint of sweetness, naturally derived.",
    productImage: "/assets/img/green-box.png",
    productDescription: "BEYUVANA™ Collagen Builder — India's 1st Complete Plant-Based Premium",
    rating: 5,
  },
  {
    id: "shivangi-dhar",
    customerName: "Shivangi Dhar",
    customerImage: "/assets/img/shivangi.png",
    testimonialText: "Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives. Clean, light flavor powered by nature. Just the right hint of sweetness, naturally derived.",
    productImage: "/assets/img/pink-box.png",
    productDescription: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
    rating: 4,
  },
  {
    id: "anjan-dutta",
    customerName: "Anjan Dutta",
    customerImage: "/assets/img/anjan.png",
    testimonialText: "Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives. Clean, light flavor powered by nature. Just the right hint of sweetness, naturally derived.",
    productImage: "/assets/img/green-box.png",
    productDescription: "BEYUVANA™ Collagen Builder — India's 1st Complete Plant-Based Premium",
    rating: 5,
  },
  {
    id: "arjun-mehta",
    customerName: "Arjun Mehta",
    customerImage: "/assets/img/ramesh.png",
    testimonialText: "Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives. Clean, light flavor powered by nature. Just the right hint of sweetness, naturally derived.",
    productImage: "/assets/img/pink-box.png",
    productDescription: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
    rating: 4,
  },
];
