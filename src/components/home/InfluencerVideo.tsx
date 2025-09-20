"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const videos = [
  { src: "/assets/videos/influencer1.mp4", title: "Influencer 1" },
  // { src: "/assets/videos/influencer2.mp4", title: "Influencer 2" },
  // { src: "/assets/videos/influencer3.mp4", title: "Influencer 3" },
  // { src: "/assets/videos/influencer4.mp4", title: "Influencer 4" },
  // { src: "/assets/videos/influencer5.mp4", title: "Influencer 5" },
  // { src: "/assets/videos/influencer6.mp4", title: "Influencer 6" },
  // { src: "/assets/videos/influencer7.mp4", title: "Influencer 7" },
];

const InfluencerVideo = () => {
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
        {videos.map((video, idx) => (
          <SplideSlide key={idx}>
            <div className="flex flex-col items-center">
              <div className="w-full h-[250px] bg-black rounded-xl overflow-hidden">
                <video
                  src={video.src}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default InfluencerVideo;
