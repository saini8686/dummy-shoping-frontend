import Link from "next/link";

export const CustomButton = ({
  children,
  customClass,
  url,
  isSubmit,
  onClick,
}) => {
  return (
    <>
      {url ? (
        <Link
          className={`p-2.5 block overflow-hidden rounded bg-green_900 text-white font-medium text-base !leading-100 ${customClass}`}
          href={url}
          onClick={onClick}
          aria-label="link"
        >
          {children}
        </Link>
      ) : (
        <button
          className={`p-2.5 block overflow-hidden rounded bg-green_900 text-white font-medium text-base !leading-100 ${customClass}`}
          onClick={onClick}
          type={isSubmit ? "submit" : "button"}
        >
          {children}
        </button>
      )}
    </>
  );
};
