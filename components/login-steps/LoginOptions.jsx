"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const LoginOptions = () => {
  const searchParams = useSearchParams();
  let auth = searchParams.get("auth");
  return (
    <div>
      <p className="max-w-[319px] mx-auto text-sm text-center text-white">
        Buy And Sell Anything Faster With The sowpay mart App
      </p>
      <Link
        href={`/sign-up?auth=${auth}`}
        className="block mt-[35px] py-[15px] w-full border-white border rounded-lg text-center text-white font-semibold hover:bg-white duration-300 hover:!text-greens-900"
      >
        Sign up
      </Link>
      <Link
        href={`/sign-in?auth=${auth}`}
        className="block py-[15px] w-full border-white border rounded-lg text-center text-white font-semibold mt-3 hover:bg-white duration-300 hover:!text-greens-900"
      >
        Log in
      </Link>
    </div>
  );
};

export default LoginOptions;
