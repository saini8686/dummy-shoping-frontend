import Icon from "@/components/common/Icons";
import moment from "moment"; // For formatting date (optional, if you use it)

const TransitionList = ({ transition, isshopkepper }) => {
  console.log(isshopkepper,"isS");
  
  return (
    <div className="flex justify-between border-b mt-4 pb-2 border-white-100 items-center w-full">
      <div className="flex gap-3 items-center">
        <Icon icon="transitionCome" />
        <p>
          <span className="block text-base !leading-130 font-normal text-greys-1500">
            {isshopkepper ? "Payment Approved"  : transition.message || "Referral Reward"}
          </span>
          <span className="block text-sm !leading-130 mt-1 font-normal text-greys-1400">
            {isshopkepper ? `User Name: ${transition.userName}` : `Earned From: ${transition.earnUserName || transition.earnType || "Unknown"}`}
          </span>
        </p>
      </div>
      <p className="text-right">
        {isshopkepper ? <span className="block text-base !leading-130 font-semibold text-reds-900">
          - {transition.totalAmount?.toFixed(2) || "0.00"} SMP
        </span> : <span className="block text-base !leading-130 font-semibold text-greens-900">
          + {transition.earnCoin?.toFixed(2) || "0.00"} SMP
        </span>}
        <span className="block text-sm !leading-130 mt-1 font-normal text-greys-1400">
          {moment(transition.createdAt).format("DD MMM YYYY, hh:mm A")}
        </span>
      </p>
    </div>
  );
};

export default TransitionList;
