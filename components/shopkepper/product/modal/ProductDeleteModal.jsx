import Image from "next/image";
import Link from "next/link";

const ProductDeleteModal = ({ deleteModal }) => {
  return (
    <div className="max-w-[540px] w-full flex items-end mx-auto fixed left-1/2 bottom-0 z-[30] min-h-screen bg-black/30 -translate-x-1/2">
      <div className="h-[390px] px-4 bg-white rounded-t-[30px] w-full">
        <Image
          src="/assets/images/svg/alert.svg"
          width={87}
          height={87}
          alt="confirm"
          className="flex mx-auto mb-4 mt-10"
        />
        <p className="font-medium text-blacks-200 text-base text-center !leading-130">
          Delete Product?
        </p>
        <p className="font-medium text-[#666666] mx-auto text-center text-sm max-w-[290px] !leading-130">
          Are you sure you want to delete this product? You won’t be able to
          undo this.
        </p>
        <Link
          href="/shopkepper/product"
          className="transparent-green-border-button w-full !text-white hover:!bg-reds-900/80 !border-reds-900 !bg-reds-900 !py-2.5 !font-medium hover:!text-white !mt-10"
        >
          Confirm
        </Link>
      </div>
    </div>
  );
};

export default ProductDeleteModal;
