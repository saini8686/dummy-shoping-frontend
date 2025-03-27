import Link from "next/link";

export const AgreementConfirm = () => {
  return (
    <p className="text-greys-dark-400 text-center mt-[72px] text-xs !leading-130">
      By continuing, you agreeing to our&nbsp;
      <Link href="#" className="text-greens-900 underline hover:no-underline">
        Terms & Conditions
      </Link>
    </p>
  );
};
export const OptionWay = () => {
  return (
    <p className="text-greens-900 my-8 font-medium leading-130 text-center">
      Or
    </p>
  );
};
