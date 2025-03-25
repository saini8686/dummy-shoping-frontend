import Link from "next/link";
import React from "react";
import Icon from "./Icons";

const SearchBar = () => {
  return (
    <div className="flex w-full items-center gap-2.5">
      <div className="bg_grey_100 w-full pr-4 flex items-center gap-3.5 h-[52px] rounded-lg">
        <input
          type="text"
          placeholder="Search Anything"
          className="py-4 text-sm border-0 w-full outline-0 pl-6 leading_100 font-normal placeholder:text_grey_400 text_grey_400"
        />
        <span className="h-6 w-[1px] bg_grey_500"></span>
        <Icon icon="mic" />
      </div>
      <button className="bg_grey_100 flex justify-center items-center rounded-lg min-w-[60px] h-[52px]">
        <Icon icon="filter" />
      </button>
    </div>
  );
};

export default SearchBar;
