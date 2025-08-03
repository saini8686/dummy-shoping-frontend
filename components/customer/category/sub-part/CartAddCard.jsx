import Icon from "@/components/common/Icons";
import Image from "next/image";
import Link from "next/link";

const CartAddCard = ({ product }) => {
  return (
    <Link
      href={product.path ? product.path : "#"}
      className="border relative border-greys-300 overflow-hidden hover:shadow-category duration-300 rounded-2xl pt-7 pb-2 px-2.5"
    >
      <div>
        <Image
          src={product.image}
          alt="product"
          width={103}
          height={62}
          className="w-[103px] h-[62px] object-contain mb-6 mx-auto flex"
        />
        <p className="mt-2.5 font-semibold !leading-130 text-blacks-100">
          {product.productName}
        </p>
        <p className="font-normal !leading-130 text-sm text-greys-200 mt-2">
          {product.amount}, {product.price}
        </p>
        <button className="w-8 flex justify-center items-center ml-auto h-8 bg-greens-900 rounded-2xl">
          <Icon icon="plus" />
        </button>
      </div>
    </Link>
  );
};

export default CartAddCard;
