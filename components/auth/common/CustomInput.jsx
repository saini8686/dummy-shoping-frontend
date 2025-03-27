import React from "react";

export const CustomInput = ({
  placeholder,
  type,
  onChange,
  value,
  name,
  customClass,
  errorText,
  error,
}) => {
  return (
    <>
      <input
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className={`px-4 py-3.5 w-full bg-greys-100 border-0 outline-0 h-[52px] rounded-lg text-greys-dark-400 placeholder:text-greys-dark-400 !leading-130 ${customClass}`}
      />
      {error && <p className="text-red-600 text-sm  mt-1">{errorText}</p>}
    </>
  );
};
