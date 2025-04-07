"use client";
import { GROSERY_SLIDER_LIST } from "@/utils/helper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const OfferSliderCategory = () => {
  return (
    <div className="mt-4 slider-grocery mb-10">
      <Swiper
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1}
        spaceBetween={16}
        modules={[EffectFade, Autoplay, Pagination]}
      >
        {GROSERY_SLIDER_LIST.map((obj, i) => (
          <SwiperSlide key={i}>
            <div
              style={{
                backgroundImage: `url(${obj.bgImage})`,
              }}
              className={`bg-100 bg-no-repeat bg-contain relative overflow-hidden min-h-[115px] pt-6 pb-4 px-4  rounded-lg`}
            >
              <div className="flex items-center justify-center gap-4">
                <Image
                  src={obj.image}
                  width={133}
                  height={105}
                  alt="cart"
                  className="w-[113px] h-[105px] object-contain"
                />
                <div>
                  <h3 className="font-aclonica text-center text-lg leading-130 text-blacks-300">
                    {obj.productName}
                  </h3>
                  <p className="text-greens-100 text-center text-xs font-medium">
                    {obj.offer}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default OfferSliderCategory;
