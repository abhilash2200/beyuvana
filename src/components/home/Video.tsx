"use client";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

const Video = () => {
    return (
        <section className="w-full bg-white flex justify-center items-center px-4">
            <div className="max-w-6xl w-full grid grid-cols-1 gap-6 rounded-2xl overflow-hidden shadow-lg">
                <div className="relative h-auto w-full md:h-[33vw] overflow-hidden">
                    <video
                        src="/assets/videos/banner-video.mov"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="md:w-full md:h-full w-full h-[250px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent hidden md:block"></div>
                    <div className="absolute bottom-6 left-6 max-w-md hidden md:block">
                        <h2 className="text-3xl font-[Grafiels] mb-2 text-white leading-tight">
                            Discover the Power <br /> of Plant-Based Collagen
                        </h2>
                        <hr className="mb-2 border-white/60 w-[50%]" />
                        <p className={`${workSans.className} !text-[12px] md:text-base text-gray-200 leading-tight`}>
                            At Beyuvana, we are committed to providing high-quality, plant-based collagen
                            products that support your health and beauty goals.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Video;
