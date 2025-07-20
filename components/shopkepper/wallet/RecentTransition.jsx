import Link from "next/link";
import React from "react";
import TransitionList from "./TransitionList";
import Image from "next/image";

const RecentTransition = (params) => {
  const TRANSITION_LIST = params.transactions  || [];
  return (
    <>
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-lg font-normal !leading-130 text-greys-1500">
          Recent Transaction
        </h2>
        {TRANSITION_LIST.length !== 0 && (
          <Link
            href="#"
            className="text-greens-900 text-base font-normal !leading-130 hover:text-black duration-300"
          >
            View all
          </Link>
        )}
      </div>
      {TRANSITION_LIST.length === 0 && (
        <div className="mt-20">
          <Image
            src="/assets/images/png/empty-money.png"
            width={246}
            height={169}
            alt="confirm"
            className="flex mx-auto mb-4 "
          />
          <p className="font-medium text-blacks-200 text-base text-center !leading-130">
            Nothing to show yet.
          </p>
          <p className="font-medium text-[#666666] mx-auto text-center text-sm max-w-[239px] !leading-130">
            Your transactions will appear here
          </p>
        </div>
      )}
      {TRANSITION_LIST.map((obj, i) => (
        <TransitionList transition={obj} key={i} />
      ))}
    </>
  );
};

export default RecentTransition;
