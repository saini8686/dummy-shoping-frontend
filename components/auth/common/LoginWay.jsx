"use client";
import useAuthStore from "@/store/useAuthStore";
import Image from "next/image";

const LoginWay = () => {
  const { signInWithGoogle } = useAuthStore();
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/customer");
    } catch (err) {
      console.error(err);
    } finally {
    }
  };
  const LOGIN_WAY_LIST = [
    {
      image: "/assets/images/png/google.png",
      name: "Google",
      onClick: handleGoogleSignIn,
    },
  ];
  return (
    <div className="flex items-center mt-8 justify-center  gap-5">
      {LOGIN_WAY_LIST.map((obj, i) => (
        <div
          key={i}
          onClick={() => {
            if (obj.onClick) {
              obj.onClick();
            }
          }}
          className="border rounded flex justify-center items-center w-[100px] h-[72px] border-greys-700 cursor-pointer">
          <div className="text-center">
            <Image
              src={obj.image}
              width={20}
              height={25}
              sizes="100vw"
              className="object-contain flex mx-auto"
              alt="logo"
            />
            <p className="text-sm font-semibold mt-2 text-black !leading-130">
              {obj.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoginWay;
