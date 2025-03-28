"use client";
import Icon from "@/components/common/Icons";
import { GROSERY_LIST } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ScrollProduct = () => {
  const [show, setShow] = useState(false);
  const showToggle = () => {
    setShow(!show);
  };
  return (
    <div>
      <div className="flex justify-between mt-8 mb-6">
        <h3 className="font-semibold line-clamp-1 text-black text-2xl max-w-[244px] !leading-[124%]">
          Groceries
        </h3>
        <button
          onClick={() => showToggle()}
          className="flex text-nowrap items-center gap-2.5 text-base font-medium !leading-130 text-reds-900"
        >
          See {show ? "Less" : "ALL"} <Icon icon="seeMore" />
        </button>
      </div>
      <div
        className={`flex overflow-scroll flex-nowrap scroll-none gap-3.5 ${
          show && "!flex-wrap"
        }`}
      >
        {GROSERY_LIST.map((obj, i) => (
          <Link
            key={i}
            href={obj.path}
            className={`h-[105px] bg-black/15 min-w-[248px] gap-3.5  flex justify-center items-center rounded-2xl ${
              i % 2 === 0 ? "bg-yellows-200/15" : "bg-greens-100/15"
            } ${show && "min-w-[unset] w-full"}`}
          >
            <Image
              src={obj.image}
              width={71}
              height={71}
              sizes="100vw"
              className="w-[71px] h-[71px] object-contain"
            />
            <p className="text-xl font-semibold leading-130 text-greys-1000">
              {obj.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScrollProduct;
