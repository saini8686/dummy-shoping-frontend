"use client";

import { OptionWay } from "@/components/auth/common/common";
import { CustomInput } from "@/components/auth/common/CustomInput";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { BAISC_DETAILS_FORM } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { submitBasicDetails } from "../../../services/basic-details.service";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { getAllBasicDetails } from "@/services/basic-details.service"

const BasicDetailForm = () => {
  const router = useRouter();

  const [formDetails, setFormDetails] = useState({
    username: "Not Provided",
    village: "",
    city: "",
    district: "",
    state: "",
    shopname: "",
    category: "",
    gst_number: "",
    smp: "",
    number: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);

        // ✅ Also update formDetails
        setFormDetails((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const {
            house_number,
            road,
            suburb,
            city,
            town,
            village,
            state,
            postcode,
            country,
          } = data.address;

          const fullAddress = `
          ${house_number ? house_number + ", " : ""}${road ? road + ", " : ""}${suburb ? suburb + ", " : ""}
          ${city || town || village ? (city || town || village) + ", " : ""}
          ${state ? state + ", " : ""}${country ? country + ", " : ""}${postcode || ""}
        `
            .replace(/\s+/g, " ")
            .trim();

          setAddress(fullAddress || "Address not found");
        } catch (err) {
          console.error("Geocoding failed", err);
          toast.error("Failed to retrieve address");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };


  const submitHandler = async (e) => {
    e.preventDefault();

    // Inside submitHandler, after validation
    try {
      const allShops = await getAllBasicDetails();
      const isShopnameTaken = allShops.some(
        (shop) => shop.shopname?.toLowerCase() === formDetails.shopname.trim().toLowerCase()
      );

      if (isShopnameTaken) {
        toast.error("This shop name is already taken. Please choose another.");
        return;
      }
    } catch (err) {
      console.error("Failed to check shop name uniqueness", err);
      toast.error("Something went wrong while checking shop name uniqueness.");
      return;
    }

    const { gst_number, ...requiredFields } = formDetails;

    const isAnyFieldEmpty = Object.values(requiredFields).some(
      (value) => value.trim?.() === ""
    );
    const isPhoneValid = /^\d{10}$/.test(formDetails.number);

    if (!lat || !lng) {
      toast.error("Please choose your location");
      return;
    }

    if (!isAnyFieldEmpty && isPhoneValid) {
      setError(false);

      const payload = {
        ...formDetails,
        userId: Cookies.get("userId"),
        latitude: lat,
        longitude: lng,
      };

      try {
        await submitBasicDetails(payload);
        toast.success("Details submitted successfully");

        // Reset form
        setFormDetails({
          username: "Not Provided",
          village: "",
          city: "",
          district: "",
          state: "",
          shopname: "",
          category: "",
          gst_number: "",
          smp: "",
          number: "",
          latitude: "",
          longitude: "",
        });

        setAddress("");
        setLat(null);
        setLng(null);
        router.push("/shopkepper/upload-image");
      } catch (err) {
        console.error("Submission error", formDetails);
        console.error("Submission failed", err);
        toast.error("Failed to submit. Please try again.");
      }
    } else {
      setError(true);
      console.error("Submission error", formDetails);
      if (isAnyFieldEmpty) toast.error("Please fill in all required fields");
      if (!isPhoneValid) toast.error("Phone number must be exactly 10 digits");
    }
  };

  return (
    <form onSubmit={submitHandler} className="w-full mx-auto mt-6">
      <ToastContainer />
      {BAISC_DETAILS_FORM.map((section, index) => (
        <div
          key={index}
          className={`mb-4 border overflow-hidden rounded-lg ${openIndex === index ? "border-greys-600" : "border-transparent"
            }`}
        >
          <button
            type="button"
            onClick={() => toggleAccordion(index)}
            className={`w-full flex justify-between duration-300 items-center text-left text-xl font-semibold px-5 py-3 text-blacks-200 ${openIndex === index
              ? "bg-transparent !text-greens-900"
              : "bg-[#F1FEF8]"
              }`}
          >
            {section.title}
            <Icon
              icon="back"
              className={`duration-300 ${openIndex === index ? "rotate-90" : "rotate-270"
                }`}
            />
          </button>

          <div
            className={`grid overflow-hidden duration-300 ${openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
          >
            <div className="overflow-hidden">
              <div className="px-4 py-4 bg-white rounded-b-lg space-y-4">
                {index === 0 && (
                  <>
                    {/* <CustomInput
                      placeholder="Name"
                      name="username"
                      type="text"
                      error={!formDetails.username && error}
                      errorText="Name is required"
                      value={formDetails.username}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          username: e.target.value,
                        })
                      }
                    /> */}
                    <CustomInput
                      placeholder="Village"
                      name="village"
                      type="text"
                      error={!formDetails.village && error}
                      errorText="Village is required"
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
                      errorText="City is required"
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
                      errorText="District is required"
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
                      errorText="State is required"
                      value={formDetails.state}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          state: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {index === 1 && (
                  <>
                    <CustomInput
                      placeholder="Shop Name"
                      name="shopname"
                      type="text"
                      error={!formDetails.shopname && error}
                      errorText="Shop name is required"
                      value={formDetails.shopname}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          shopname: e.target.value,
                        })
                      }
                    />

                    <CustomInput
                      placeholder="Select Category"
                      name="category"
                      type="select"
                      options={[
                        { label: "Grocery Store", value: "grocery" },
                        { label: "Electronic Store", value: "electronics" },
                        { label: "Fashion Store", value: "fashion" },
                        { label: "Stationery Store", value: "stationery" },
                        { label: "Hardware Store", value: "hardware" },
                        { label: "Fruits & Vegetables Store", value: "fruits_vegetables" },
                        { label: "Restaurant / Dhaba", value: "restaurant" },
                        { label: "Medical Store", value: "medical" },
                        { label: "Furniture Store", value: "furniture" },
                        { label: "Kitchen Store", value: "kitchen" },
                        { label: "Cosmetic Store", value: "cosmetic" },
                        { label: "Jewellery Shop", value: "jewellery" },
                        { label: "Sweets Store", value: "sweets" },
                      ]}
                      error={!formDetails.category && error}
                      errorText="Category is required"
                      value={formDetails.category}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          category: e.target.value,
                        })
                      }
                    />

                    <CustomInput
                      placeholder="Select SMP"
                      name="smp"
                      type="select"
                      options={[
                        { label: "1%", value: "3" },
                        { label: "2%", value: "5" },
                        { label: "3%", value: "10" },
                        { label: "4%", value: "12" },
                        { label: "5%", value: "15" },
                        { label: "8%", value: "20" },
                        { label: "10%", value: "25" },
                        { label: "15%", value: "30" },
                        { label: "20%", value: "40" },
                        { label: "25%", value: "50" },
                      ]}
                      error={!formDetails.smp && error}
                      errorText="SMP is required"
                      value={formDetails.smp}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          smp: e.target.value,
                        })
                      }
                    />

                    <CustomInput
                      placeholder="GST Number (optional)"
                      name="gst_number"
                      type="text"
                      value={formDetails.gst_number}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          gst_number: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {index === 2 && (
                  <>
                    <CustomInput
                      placeholder="+91 Number"
                      name="number"
                      type="number"
                      error={
                        error &&
                        (!formDetails.number || formDetails.number.length !== 10)
                      }
                      errorText="Number is required and must be 10 digits"
                      value={formDetails.number}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          number: e.target.value,
                        })
                      }
                    />
                    <CustomButton
                      onClick={getLocation}
                      customClass="w-full gap-3 justify-center flex items-center !py-3.5"
                    >
                      <Icon icon="locationWhite" />
                      {loading
                        ? "Fetching Location..."
                        : address === ""
                          ? "Choose Location from Google"
                          : address}
                    </CustomButton>
                  </>
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
