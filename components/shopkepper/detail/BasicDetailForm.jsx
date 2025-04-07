"use client";
import { OptionWay } from "@/components/auth/common/common";
import { CustomInput } from "@/components/auth/common/CustomInput";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { BAISC_DETAILS_FORM } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
const BasicDetailForm = () => {
  const router = useRouter();
  const [formDetails, setFormDetails] = useState({
    name: "",
    village: "",
    city: "",
    district: "",
    state: "",
    shopName: "",
    category: "",
    gstNumber: "",
    number: "",
    address: "",
  });
  const [error, setError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const isAnyFieldEmpty = Object.values(formDetails).some(
      (value) => value.trim() === ""
    );
    const isPhoneValid = /^\d{10}$/.test(formDetails.number);
    if (!isAnyFieldEmpty && isPhoneValid) {
      setError(false);
      console.log(formDetails, "formDetails formDetails");
      toast.success("Details submitted successfully");
      setFormDetails({
        name: "",
        village: "",
        city: "",
        district: "",
        state: "",
        shopName: "",
        category: "",
        gstNumber: "",
        number: "",
        address: "",
      });
      router.push("/shopkepper/upload-image");

    } else {
      setError(true);

      if (isAnyFieldEmpty) {
        toast.error("Please fill in all required fields");
      } else if (!isPhoneValid) {
        toast.error("Phone number must be exactly 10 digits");
      }
    }
  };
  return (
    <form onSubmit={(e) => submitHandler(e)} className="w-full  mx-auto mt-6">
      <ToastContainer />
      {BAISC_DETAILS_FORM.map((section, index) => (
        <div
          key={index}
          className={`mb-4 border overflow-hidden rounded-lg ${
            openIndex === index ? "border-greys-600" : "border-transparent"
          }`}
        >
          <button
            type="button"
            onClick={() => toggleAccordion(index)}
            className={`w-full flex  justify-between duration-300 items-center text-left text-xl font-semibold  px-5 py-3  text-blacks-200 ${
              openIndex === index
                ? "bg-transparent !text-greens-900"
                : "bg-[#F1FEF8]"
            } `}
          >
            {section.title}
            <Icon
              icon="back"
              className={` duration-300 ${
                openIndex === index ? "rotate-90" : "rotate-270"
              } `}
            />
          </button>

          <div
            className={`grid overflow-hidden duration-300 ${
              openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-4 py-4 bg-white rounded-b-lg">
                {index === 0 ? (
                  <div className="space-y-4">
                    <CustomInput
                      placeholder="Name"
                      name="name"
                      type="text"
                      error={!formDetails.name && error}
                      errorText="Name Is Required"
                      value={formDetails.name}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          name: e.target.value,
                        })
                      }
                    />
                    <CustomInput
                      placeholder="Village"
                      name="village"
                      type="text"
                      error={!formDetails.village && error}
                      errorText="Village Is Required"
                      value={formDetails.village}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          village: e.target.value,
                        })
                      }
                    />
                    <CustomInput
                      placeholder="City"
                      name="city"
                      type="text"
                      error={!formDetails.city && error}
                      errorText="City Is Required"
                      value={formDetails.city}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          city: e.target.value,
                        })
                      }
                    />
                    <CustomInput
                      placeholder="District"
                      name="district"
                      type="text"
                      error={!formDetails.district && error}
                      errorText="District Is Required"
                      value={formDetails.district}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          district: e.target.value,
                        })
                      }
                    />
                    <CustomInput
                      placeholder="State"
                      name="state"
                      type="text"
                      error={!formDetails.state && error}
                      errorText="State Is Required"
                      value={formDetails.state}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          state: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : index === 1 ? (
                  <div className="space-y-4">
                    <CustomInput
                      placeholder="shop Name"
                      name="shopName"
                      type="text"
                      error={!formDetails.shopName && error}
                      errorText="shop Name Is Required"
                      value={formDetails.shopName}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          shopName: e.target.value,
                        })
                      }
                    />
                    <CustomInput
                      placeholder="Category"
                      name="category"
                      type="text"
                      error={!formDetails.category && error}
                      errorText="Category Is Required"
                      value={formDetails.category}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          category: e.target.value,
                        })
                      }
                    />
                    <CustomInput
                      placeholder="Gst Number"
                      name="gstNumber"
                      type="number"
                      error={!formDetails.gstNumber && error}
                      errorText="Gst Number Is Required"
                      value={formDetails.gstNumber}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          gstNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <CustomInput
                      placeholder="+91  Number"
                      name="number"
                      type="number"
                      error={
                        error &&
                        (!formDetails.number || formDetails.number.length != 10)
                      }
                      errorText="Number is Required Or must be 10 digit"
                      value={formDetails.number}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          number: e.target.value,
                        })
                      }
                    />
                    <CustomInput
                      customClass="mt-4"
                      placeholder="Address"
                      name="address"
                      type="text"
                      error={!formDetails.address && error}
                      errorText={"Address Is Required"}
                      value={formDetails.address}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          address: e.target.value,
                        })
                      }
                    />
                    <OptionWay className="!my-4" />
                    <CustomButton customClass="w-full gap-3 justify-center flex items-center !py-3.5">
                      <Icon icon="locationWhite" /> Choose Location from Google
                    </CustomButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <CustomButton isSubmit customClass="w-full">
        Continue
      </CustomButton>
    </form>
  );
};

export default BasicDetailForm;
