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
  const [userCoords, setUserCoords] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [sortByDistance, setSortByDistance] = useState(true);

  const [isPlaying, setIsPlaying] = useState([]);
  const videoRefs = useRef([]);

  // 🎬 Video toggle
  const togglePlay = (index) => {
    const updatedPlaying = Array(videoRefs.current.length).fill(false);

    videoRefs.current.forEach((video, i) => {
      if (!video) return;

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
    });

    setIsPlaying(updatedPlaying);
  };

  // Init video state
  useEffect(() => {
    setIsPlaying(Array(VEDIO_LIST.length).fill(false));
  }, []);

  // 📍 Get location: first try geolocation, fallback to cookies
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          // Save to cookies
          Cookies.set("latitude", latitude, { sameSite: "Lax" });
          Cookies.set("longitude", longitude, { sameSite: "Lax" });

          // Save to state
          setUserCoords({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);

          // Fallback: cookies
          const lat = Cookies.get("latitude");
          const lng = Cookies.get("longitude");
          if (lat && lng) {
            setUserCoords({ lat: parseFloat(lat), lng: parseFloat(lng) });
          }
        }
      );
    } else {
      // Browser doesn’t support geolocation
      const lat = Cookies.get("latitude");
      const lng = Cookies.get("longitude");
      if (lat && lng) {
        setUserCoords({ lat: parseFloat(lat), lng: parseFloat(lng) });
      }
    }
  }, []);

  // 🏪 Fetch shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const res = await getBasicDetails(search, page);
        const allShops = res.data.filter((item) => item.status === "approved") || [];

        // Add distance if location known
        if (userCoords) {
          allShops.forEach((shop) => {
            if (shop.latitude && shop.longitude) {
              shop.distance = getDistanceFromLatLonInKm(
                shop.latitude,
                shop.longitude,
                userCoords.lat,
                userCoords.lng
              );
            } else {
              shop.distance = null;
            }
          });
        }

        setShops(allShops);
        setTotalPages(res.totalPages || 1);

        const categories = Array.from(new Set(allShops.map((shop) => shop.category)));
        setAvailableCategories(categories);
      } catch (err) {
        console.error("Failed to fetch shops", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [search, page, userCoords]);

  // Reset page on new search
  useEffect(() => {
    setPage(1);
  }, [search]);

  // 🪄 Filter + sort
  const filteredShops = shops
    .filter((shop) =>
      selectedCategory === "all" ? true : shop.category === selectedCategory
    )
    .sort((a, b) => {
      if (!sortByDistance || !userCoords) return 0;

      // Handle cases where distance might be null or undefined
      const aDistance = a.distance !== null && a.distance !== undefined ? a.distance : Infinity;
      const bDistance = b.distance !== null && b.distance !== undefined ? b.distance : Infinity;

      return aDistance - bDistance;
    });

  // Function to check if we should show video after a specific shop index
  const shouldShowVideoAfter = (index) => {
    // Show video after shop indices 1, 3, 5, 7 (which are 0-indexed: 0, 2, 4, 6)
    const videoPositions = [0, 3, 6];
    return videoPositions.includes(index);
  };

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
              <p className="text-black mt-2 text-md text-center font-semibold">
                {obj.name}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Sort by distance toggle */}
      {/* {userCoords && (
        <div className="mt-4 flex items-center justify-end">
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-sm font-medium text-blacks-200">
              Sort by distance
            </span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={sortByDistance}
                onChange={() => setSortByDistance(!sortByDistance)}
              />
              <div
                className={`block w-10 h-6 rounded-full ${sortByDistance ? "bg-greens-900" : "bg-greys-300"
                  }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${sortByDistance ? "translate-x-4" : ""
                  }`}
              ></div>
            </div>
          </label>
        </div>
      )} */}

      {/* No shop message */}
      {filteredShops.length === 0 && !loading && (
        <p className="mt-6 text-center text-greys-400">No shops found.</p>
      )}

      {/* Shops and Videos */}
      {filteredShops.map((obj, i) => (
        <div key={i}>
          <div className="h-auto mt-6 rounded-xl shadow-lg p-4 bg-white transition hover:shadow-xl">
            <div className="flex gap-4">
              {/* Image + Ribbon */}
              <div className="relative w-[263px] h-[198px] overflow-hidden rounded-lg">
                <img
                  src={
                    obj.shop_front_image === null
                      ? "/assets/images/png/shop/shop-1.png"
                      : `${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${obj.shop_front_image
                      }`
                  }
                  alt="shopImage"
                  className="object-cover w-full h-full rounded-lg"
                />
                <span className="absolute top-2 left-[-25px] w-[100px] bg-reds-900 text-white text-[12px] font-bold py-[2px] text-center rotate-[-45deg] shadow-md z-10">
                  {obj.smp}% FS
                </span>
              </div>

              {/* Info Block */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-blacks-200 truncate">
                    Shop ID: #<span className="text-green-600">{obj?.userId}</span>
                  </h2>
                  <h2 className="text-lg font-semibold text-blacks-200 w-[143px] truncate">
                    {obj?.shopName}
                  </h2>
                  <p className="text-sm text-blacks-200">{obj?.category}</p>
                  <small className="text-sm text-green-600 font-medium block mt-1">
                    {obj?.address}
                  </small>

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
                </div>

                <div className="mt-3">
                  <CustomButton url={`../customer/${obj.path}`} customClass="w-fit text-sm">
                    View Shop
                  </CustomButton>
                </div>

                <div className="flex justify-between items-center mt-1 mb-2">
                  {/* Stars */}
                  {obj.latitude && obj.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${obj.latitude},${obj.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm font-medium mt-2 inline-block"
                    >
                      📍 View on Map
                    </a>
                  )}

                  {/* {obj.latitude && obj.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${obj.latitude},${obj.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm font-medium mt-2 inline-block"
                    >
                      📍 View on Map
                    </a>
                  )} */}

                  {/* Distance */}
                  <p className="text-xs italic font-medium text-reds-900">
                    {obj.distance ? `${obj.distance.toFixed(1)} km away` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Show video after specific shop indices (1, 3, 5, 7) */}
          {shouldShowVideoAfter(i) && i < VEDIO_LIST.length && (
            <div className="relative max-w-[540px] w-full mx-auto mt-8">
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                height={160}
                className="h-[263px] object-cover w-full"
                src={VEDIO_LIST[i]}
                loop
                onClick={() => togglePlay(i)}
              />
              {!isPlaying[i] && (
                <button
                  onClick={() => togglePlay(i)}
                  className="absolute inset-0 flex items-center justify-center bg-[#D1D1D1]/80"
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
          )}

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