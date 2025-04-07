import Link from "next/link";
import Icon from "./Icons";

const SearchBar = () => {
  return (
    <div className="flex mt-8 w-full items-center gap-2.5">
      <div className="bg-greys-100 w-full pr-4 flex items-center gap-3.5 h-[52px] rounded-lg">
        <input
          type="text"
          placeholder="Search Anything"
          className="py-4 text-sm border-0 w-full outline-0 pl-6 !leading-130 font-normal placeholder:text-greys-400 text-greys-400"
        />
        <span className="h-6  w-[1px] bg-greys-500"></span>
        <Link href="#">
          <Icon icon="mic" />
        </Link>
      </div>
      <button className="bg-greys-100 flex justify-center items-center rounded-lg min-w-[60px] h-[52px]">
        <Icon icon="filter" />
      </button>
    </div>
  );
};

export default SearchBar;
