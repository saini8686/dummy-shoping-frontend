import { useRef } from "react";

const OtpInput = ({ length = 6, onChange }) => {
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = inputsRef.current.map((input, i) =>
      i === index ? value : input?.value || ""
    );

    onChange(newOtp.join(""));

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !inputsRef.current[index]?.value &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center mt-10 gap-5 items-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          ref={(el) => (inputsRef.current[i] = el)}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-13 h-13 rounded-lg text-center text-greys-dark-400 outline-0 border-0 bg-greys-100"
        />
      ))}
    </div>
  );
};

export default OtpInput;
