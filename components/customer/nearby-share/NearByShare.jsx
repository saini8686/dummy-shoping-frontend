'use client';

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { getShopDetails } from "../../../services/shop.service";
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
        const res = await getShopDetails(search, page);
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
              onClick={() => setSelectedCategory(obj.name.toLowerCase())}
              className={`group text-center flex-shrink-0 ${selectedCategory === obj.name.toLowerCase() ? "border-greens-900 border" : ""
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
          <div className="h-[175px] mt-6 shadow-category rounded-lg py-4 px-3">
            <div className="flex items-start gap-5">
              <img
                src={
                  obj.shop_front_image === null
                    ? "/assets/images/png/shop/shop-1.png"
                    : `${process.env.NEXT_PUBLIC_API_BASE}/${obj.shop_front_image}`
                }
                alt="shopImage"
                height={140}
                width={121}
                className="object-cover rounded w-[121px] h-[140px]"
              />
              <div className="w-full">
                <h2 className="text-lg font-medium text-blacks-200 mb-2">
                  {obj.name}
                </h2>
                <p className="text-lg font-medium text-blacks-200">
                  {obj.category}
                </p>
                <CustomButton
                  url={`../customer/${obj.path}`}
                  customClass="mt-2 w-fit text-sm mb-5"
                >
                  View Shop
                </CustomButton>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
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
                  <p className="text-reds-900 italic font-semibold text-xs">
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
