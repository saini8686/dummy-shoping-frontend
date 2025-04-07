"use client";
import { INSTRUCTION_LIST } from "@/utils/helper";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const InstructionStep = ({ activeIndex, setActiveIndex }) => {
  const totalSlides = INSTRUCTION_LIST.length;
  return (
    <div>
      <Swiper
        allowTouchMove={false}
        spaceBetween={30}
        pagination={{
          el: ".swiper-pagination",
          clickable: false,
        }}
        navigation={{
          prevEl: "#prevDetail",
          nextEl: "#nextDetail",
        }}
        effect={"fade"}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        modules={[EffectFade, Navigation, Autoplay, Pagination]}
      >
        {INSTRUCTION_LIST.map((obj, i) => (
          <SwiperSlide key={i}>
            <div className="bg-greens-900">
              <h2 className="text-2xl font-semibold mb-3.5 text-white text-center !leading-130">
                {obj.title}
              </h2>
              <p className="max-w-[319px] mx-auto text-center text-sm  text-white">
                {obj.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex text-lg font-semibold text-white !leading-130 justify-between mt-[68px] relative">
        <button id="prevDetail" className="border-0 outline-0 bg-transparent">
          Prev
        </button>
        <div className="swiper-pagination justify-center  !static !bottom-0 flex items-center"></div>
        <button id="nextDetail" className="border-0 outline-0 bg-transparent">
          Next
        </button>
        {activeIndex === totalSlides - 1 && (
          <Link
            href="?steps=1"
            className="border-0 hidden outline-0 bg-transparent text-nowrap"
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
};

export default InstructionStep;
