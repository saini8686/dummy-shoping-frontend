"use client";
import { TOPBAR_ITEM_LIST, VEDIO_LIST } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CustomButton } from "../common/CustomButton";
const TopBarProduct = () => {
  const [isPlaying, setIsPlaying] = useState([]);
  const videoRefs = useRef([]);
  const togglePlay = (index) => {
    const updatedPlaying = Array(videoRefs.current.length).fill(false);
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === index) {
          if (video.paused) {
            video.play();
            updatedPlaying[i] = true;
          } else {
            video.pause();
            updatedPlaying[i] = false;
          }
        } else {
          video.pause();
        }
      }
    });

    setIsPlaying(updatedPlaying);
  };
  useEffect(() => {
    setIsPlaying(Array(VEDIO_LIST.length).fill(false));
  }, [VEDIO_LIST]);
  return (
    <div>
      <div className="flex gap-2.5 mt-8 items-center justify-between">
        {TOPBAR_ITEM_LIST.map((obj, i) => (
          <Link key={i} href={obj.url} className="group">
            <Image
              src={obj.image}
              width={59}
              height={59}
              sizes="100vw"
              alt="product"
              className="w-[59px] h-[59px] rounded-md group-hover:border-greens-900 border border-transparent duration-300 shadow_low_black"
            />

            <p className="text-black mt-2 text-sm text-center !leading-130 font-semibold">
              {obj.name}
            </p>
          </Link>
        ))}

        {/* vedio */}
      </div>
      <Swiper
        loop={true}
        slidesPerView={1}
        spaceBetween={16}
        modules={[EffectFade, Autoplay]}
      >
        {VEDIO_LIST.map((obj, i) => (
          <SwiperSlide key={i} className="h-full">
            <div className="relative max-w-[540px] w-full mx-auto mt-8">
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                height={160}
                className="h-[160px] object-cover w-full"
                src={obj}
                loop
                muted
                onClick={() => togglePlay(i)}
              />
              {!isPlaying[i] && (
                <button
                  onClick={() => togglePlay(i)}
                  className="absolute inset-0 flex items-center justify-center bg-[#D1D1D1]/80 "
                >
                  <Image
                    src="/assets/images/svg/play.svg"
                    width={56}
                    height={56}
                    sizes="100vw"
                    alt="product"
                    className="w-[56px] h-[56px]"
                  />
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <CustomButton
        customClass="ml-auto flex w-fit mt-6"
        url="/customer/nearby-shop"
      >
        Nearby Shops
      </CustomButton>
    </div>
  );
};

export default TopBarProduct;
