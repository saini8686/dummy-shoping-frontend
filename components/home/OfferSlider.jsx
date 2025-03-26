"use client";
import { OFFER_LIST } from "@/utils/helper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const OfferSlider = () => {
  return (
    <div className="mt-8">
      <Swiper
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        slidesPerView={1.18}
        spaceBetween={16}
        modules={[EffectFade, Autoplay]}
      >
        {OFFER_LIST.map((obj, i) => (
          <SwiperSlide key={i}>
            <div className="bg-greens-900 relative overflow-hidden min-h-[160px] pt-6 pb-4 px-4  rounded-lg">
              <div>
                <div className="relative w-fit z-[2]">
                  <span className="h-[18px] w-[134px] bg-white absolute -top-0.5 skew-x-[42deg] -left-8 z-[-1]"></span>
                  <p className="text-greens-900 leading-130 font-medium text-xs">
                    New User Offer
                  </p>
                </div>
                <h2 className="text-base max-w-[91px] font-medium w-fit text-white mt-3 after:absolute after:bg-white after:h-px after:left-0 after:-bottom-1  relative after:w-full leading-130">
                  {obj.name}
                </h2>
                <h3 className="text-base font-semibold w-fit text-white mt-4 leading-130">
                  Get Rs {obj.discount} OFF
                </h3>
                <p className="text-xs font-normal w-fit text-white mt-1 leading-130">
                  -On Your Orders
                </p>
              </div>
              <div className="bg-white blur-[100px] w-[130px] h-[130px] absolute left-1/2 top-1/2 z-[1] -translate-y-1/2"></div>
              <Image
                src={obj.image}
                width={163}
                height={163}
                alt="cart"
                className="absolute -translate-y-1/2 z-[2] top-1/2 right-0"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default OfferSlider;
