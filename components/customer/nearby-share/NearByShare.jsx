'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { getShopDetails } from "../../../services/shop.service";
import OfferSlider from "@/components/customer/OfferSlider";
import TopBarProduct from "@/components/customer/TopBarProduct";
import Cookies from "js-cookie";
import { getDistanceFromLatLonInKm } from "@/utils/geo";

const NearByShare = ({ search }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAdsOnce, setShowAdsOnce] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

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
        setShops(res.data || []);
        setTotalPages(res.totalPages || 1);
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

  return (
    <>
      {shops.length === 0 && !loading && (
        <p className="mt-6 text-center text-greys-400">No shops found.</p>
      )}

      {showAdsOnce && <TopBarProduct />}

      {shops.map((obj, i) => (
        <div key={i}>
          <div className="h-[175px] mt-6 shadow-category rounded-lg py-4 px-3">
            <div className="flex items-start gap-5">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE}/${obj.shop_front_image}`}
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

          {i === shops.length - 2 && <OfferSlider />}
        </div>
      ))}

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
