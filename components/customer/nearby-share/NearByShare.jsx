'use client';

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { getBasicDetails } from "../../../services/shop.service";
import OfferSlider from "@/components/customer/OfferSlider";
import Cookies from "js-cookie";
import { getDistanceFromLatLonInKm } from "@/utils/geo";
import { TOPBAR_ITEM_LIST, VEDIO_LIST } from "@/utils/helper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const NearByShare = ({ search }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAdsOnce, setShowAdsOnce] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableCategories, setAvailableCategories] = useState([]);

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
  }, []);

  useEffect(() => {
    const lat = Cookies.get("latitude");
    const lng = Cookies.get("longitude");

    if (lat && lng) {
      setUserCoords({
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      });
    }
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const res = await getBasicDetails(search, page);
        const allShops = res.data || [];
        setShops(allShops);
        setTotalPages(res.totalPages || 1);

        const categories = Array.from(new Set(allShops.map(shop => shop.category)));
        setAvailableCategories(categories);

        if (!showAdsOnce) setShowAdsOnce(true);
      } catch (err) {
        console.error("Failed to fetch shops", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [search, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredShops = shops.filter((shop) =>
    selectedCategory === "all" ? true : shop.category === selectedCategory
  );

  return (
    <>
      {/* Category Buttons */}
      {TOPBAR_ITEM_LIST.length > 0 && (
        <div className="flex gap-2.5 mt-8 items-center justify-between overflow-auto">
          {TOPBAR_ITEM_LIST.map((obj, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(obj.value)}
              className={`group text-center flex-shrink-0 ${selectedCategory === obj.value ? "border-greens-900 border" : ""
                }`}
            >
              <Image
                src={obj.image}
                width={59}
                height={59}
                sizes="100vw"
                alt={obj.name}
                className="w-[59px] h-[59px] rounded-md group-hover:border-greens-900 border border-transparent duration-300 shadow_low_black"
              />
              <p className="text-black mt-2 text-sm text-center font-semibold">
                {obj.name}
              </p>
            </button>

          ))}
        </div>
      )}


      {/* Optional dropdown filter */}
      {/* {availableCategories.length > 0 && (
        <div className="mt-4 flex justify-center">
          <select
            className="px-4 py-2 border border-greys-300 rounded text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {availableCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )} */}

      {/* No shop message */}
      {filteredShops.length === 0 && !loading && (
        <p className="mt-6 text-center text-greys-400">No shops found.</p>
      )}

      {/* Video Ads */}
      {showAdsOnce && (
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
                      alt="Play"
                      className="w-[56px] h-[56px]"
                    />
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Shops */}
      {filteredShops.map((obj, i) => (
        <div key={i}>
          <div className="h-auto mt-6 rounded-xl shadow-lg p-4 bg-white transition hover:shadow-xl">
            <div className="flex gap-4">
              {/* Image + Ribbon */}
              <div className="relative w-[121px] h-[140px] overflow-hidden rounded-lg">
                <img
                  src={
                    obj.shop_front_image === null
                      ? "/assets/images/png/shop/shop-1.png"
                      : `${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${obj.shop_front_image}`
                  }
                  alt="shopImage"
                  className="object-cover w-full h-full rounded-lg"
                />

                {/* Clean Diagonal Ribbon */}
                <span className="absolute top-2 left-[-25px] w-[100px] bg-reds-900 text-white text-[10px] font-bold py-[2px] text-center rotate-[-45deg] shadow-md z-10">
                  {obj.smp}% FS
                </span>
              </div>

              {/* Info Block */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold text-blacks-200 truncate">
                      {obj?.name}
                    </h2>
                    <h2 className="text-lg font-semibold text-blacks-200 truncate">
                      #{obj?.userId}
                    </h2>
                  </div>
                  <p className="text-sm text-blacks-200">{obj?.category}</p>
                  {/* <small className="text-sm text-green-600 font-medium block mt-1">
                    {obj?.smp}% Future saving
                  </small> */}
                  <small className="text-sm text-green-600 font-medium block mt-1">
                    {obj?.address}
                  </small>
                </div>

                <div className="mt-3">
                  <CustomButton
                    url={`../customer/${obj.path}`}
                    customClass="w-fit text-sm"
                  >
                    View Shop
                  </CustomButton>
                </div>

                <div className="flex justify-between items-center mt-3">
                  {/* Stars */}
                  <div className="flex items-center gap-[2px]">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={
                          index < Math.round(obj.review)
                            ? "text-yellows-100"
                            : "text-greys-800"
                        }
                      >
                        <Icon icon="star" />
                      </span>
                    ))}
                  </div>

                  {/* Distance */}
                  <p className="text-xs italic font-medium text-reds-900">
                    {userCoords
                      ? `${getDistanceFromLatLonInKm(
                        obj.latitude,
                        obj.longitude,
                        userCoords.lat,
                        userCoords.lng
                      ).toFixed(1)} km away`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {i === filteredShops.length - 2 && <OfferSlider />}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="text-sm px-3 py-1 rounded bg-greys-200"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm text-blacks-200">
            Page {page} of {totalPages}
          </span>
          <button
            className="text-sm px-3 py-1 rounded bg-greys-200"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default NearByShare;
