"use client";
import { TOPBAR_ITEM_LIST } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { CustomButton } from "../common/CustomButton";
const TopBarProduct = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  return (
    <div>
      <div className="flex gap-2.5 mt-8 items-center justify-content-between">
        {TOPBAR_ITEM_LIST.map((obj, i) => (
          <Link key={i} href={obj.url}>
            <Image
              src={obj.image}
              width={59}
              height={59}
              sizes="100vw"
              alt="product"
              className="w-[59px] h-[59px] rounded-md shadow_low_black"
            />

            <p className="text-black mt-2 text-sm text-center !leading-130 font-semibold">
              {obj.name}
            </p>
          </Link>
        ))}

        {/* vedio */}
      </div>
      <div className="relative max-w-[311px] w-full mx-auto mt-8">
        <video
          ref={videoRef}
          height={160}
          className="h-[160px] object-cover w-full"
          src="/assets/video/sow-pay.mp4"
          loop
          muted
          onClick={togglePlay}
        />
        {!isPlaying && (
          <button
            onClick={togglePlay}
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
      <CustomButton customClass="ml-auto flex w-fit mt-6" url="#">
        Nearby Shops
      </CustomButton>
    </div>
  );
};

export default TopBarProduct;
