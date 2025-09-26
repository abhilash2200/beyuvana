"use client"

const AdvancedPlant = () => {
  return (
    <div>
        <div className="w-full">
      <Splide
        options={{
          perPage: 3,
          gap: "1rem",
          padding: { left: "12rem", right: "2rem" },
          autoplay: false,
          interval: 5000,
          pauseOnHover: true,
          arrows: true,
          pagination: false,
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
        aria-label="deal Carousel"
      >
        {deals.map((deal, index) => (
          <SplideSlide key={index}>
            <Link
              href={deal.link}
              className="flex items-center justify-center overflow-hidden rounded-xl relative w-full h-full cursor-pointer"
            >
              <div className="w-full h-full">
                <Image
                  src={deal.img}
                  width={435}
                  height={343}
                  alt={`deal ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="w-full absolute inset-0 z-10">
                <div className="absolute top-2.5 2xl:top-3 left-2.5 2xl:left-3 rounded-[8px] lg:rounded-[10px] bg-white overflow-hidden ">
                  {/* Brand Img */}
                  <Image
                    src={brands[index]?.img || ""}
                    width={100}
                    height={60}
                    alt={`brand ${index + 1}`}
                    className="!border-[1.5px] !border-[#F5F7F9] p-[2px] object-contain w-[72px] h-10 lg:w-[84px] lg:h-12 2xl:w-[108px] 2xl:h-[60px] rounded-[8px] lg:rounded-[10px] overflow-hidden "
                  />

                </div>
                <div className="flex h-8 justify-end absolute top-0 right-0">
                  <div className=" w-auto h-[18px] md:h-[26px] bg-red-500 rounded-tr-[20px] !px-5 rounded-bl-[20px] !relative flex justify-center items-center z-0">
                    <p className=" text-white text-[9px] md:text-base  line-clamp-1 font-semibold text-center">Sale Live Now</p>
                  </div>
                </div>
                <Button variant="default" className="absolute bottom-2.5 2xl:bottom-3 right-2.5 2xl:right-3 bg-white rounded-[5px] font-semibold text-[15px] border-none text-blue-500 cursor-pointer">
                  Grab Deal
                </Button>
              </div>

            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </div>
    </div>
  )
}

export default AdvancedPlant