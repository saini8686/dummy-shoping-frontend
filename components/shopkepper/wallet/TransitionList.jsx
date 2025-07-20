import Icon from "@/components/common/Icons";

const TransitionList = ({ transition }) => {  
  return (
    <div className="flex justify-between border-b mt-4 pb-2 border-white-100 items-center w-full">
      <div className="flex gap-3 items-center">
        <Icon icon="transitionCome" />
        <p>
          <span className="block text-base !leading-130 font-normal text-greys-1500">
            Earn Amount: {transition.earnAmount}
          </span>
          <span className="block text-sm !leading-130 mt-1 font-normal text-greys-1400">
            #{transition.payId}
          </span>
        </p>
      </div>
      <p>
        <span className="block text-base text-end !leading-130 font-normal text-blacks-400">
          {transition.totalAmount}
        </span>
        <span className="block text-sm !leading-130 text-end mt-1 font-normal text-greys-1400">
          {transition.createdAt}
        </span>
      </p>
    </div>
  );
};

export default TransitionList;
