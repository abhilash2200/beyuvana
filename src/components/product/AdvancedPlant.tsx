"use client";

import PlantCard from "./PlantCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useParams } from "next/navigation";
import { Product, fallbackProducts, Plant } from "@/app/data/fallbackProducts";

interface AdvancedPlantProps {
  product?: Product;
}

const AdvancedPlant = ({ product }: AdvancedPlantProps) => {
  const params = useParams();
  const routeId = typeof params?.id === "string" ? params.id : undefined;
  const resolvedProduct: Product | undefined = product ? product : fallbackProducts.find(p => p.id.toString() === routeId);
  const plants: Plant[] = resolvedProduct?.plants || [];

  if (!plants.length) return null;

  return (
    <div className="w-full">
      <Splide
        options={{
          perPage: 3,
          padding: { left: "12rem", right: "2rem" },
          perMove: 1,
          gap: "1rem",
          arrows: false,
          pagination: false,
          rewind: true,
          breakpoints: {
            1024: { perPage: 2 },
            640: { perPage: 1, padding: { left: "1rem", right: "1rem" } },
          },
        }}
        aria-label="Advanced Plant Slider"
      >
        {plants.map((plant) => (
          <SplideSlide key={plant.id} className="flex items-center justify-center">
            <PlantCard
              title={plant.title}
              description={plant.description}
              img={plant.img}
              bgColor={plant.bgColor}
              headingColor={plant.headingColor}
              paragraphColor={plant.paragraphColor}
              plusColor={plant.plusColor}
              xColor={plant.xColor}
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default AdvancedPlant;
