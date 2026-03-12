"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { LazyVideo } from "@/components/common/LazyVideo";

const POSTER = [
  "/assets/videos/beyu-1.webp",
  "/assets/videos/beyu-3.webp",
  "/assets/videos/beyu-4.webp",
  "/assets/videos/beyu-6.webp",
];

const influencerVideos = [
  { src: "/assets/videos/beyu-1.mp4", title: "Influencer 1" },
  { src: "/assets/videos/beyu-3.mp4", title: "Influencer 3" },
  { src: "/assets/videos/beyu-4.mp4", title: "Influencer 4" },
  { src: "/assets/videos/beyu-6.mp4", title: "Influencer 6" },
];

export default function InfluencerVideosPink() {
  return (
    <div className="w-full">
      <Splide
        aria-label="Influencer videos"
        options={{
          perPage: 3,
          gap: "1rem",
          padding: { left: "2rem", right: "2rem" },
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
                <LazyVideo
                  src={video.src}
                  title={video.title}
                  poster={POSTER[idx]}
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
