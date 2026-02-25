"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { influencerVideos } from "@/data/influencerVideos";

export default function InfluencerVideo() {
  return (
    <div className="w-full">
      <Splide
        aria-label="Influencer videos"
        options={{
          perPage: 4,
          gap: "1rem",
          padding: { left: "12rem", right: "2rem" },
          autoplay: false,
          interval: 5000,
          pauseOnHover: true,
          arrows: false,
          pagination: true,
          breakpoints: {
            1024: {
              perPage: 2,
              padding: { left: "1rem", right: "1rem" },
            },
            640: {
              perPage: 1,
              padding: { left: "0.5rem", right: "0.5rem" },
            },
          },
        }}
        className="custom-splide"
      >
        {influencerVideos.map((video, idx) => (
          <SplideSlide key={idx}>
            <div className="flex flex-col items-center">
              <div className="w-full h-[650px] bg-black rounded-xl overflow-hidden">
                <video
                  src={video.src}
                  title={video.title}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
