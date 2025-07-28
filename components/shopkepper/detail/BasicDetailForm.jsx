"use client";
import { OptionWay } from "@/components/auth/common/common";
import { CustomInput } from "@/components/auth/common/CustomInput";
import { CustomButton } from "@/components/common/CustomButton";
import LocationPicker from "@/components/common/GetLocation";
import Icon from "@/components/common/Icons";
import { BAISC_DETAILS_FORM } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { submitBasicDetails } from "../../../services/basic-details.service";
import Cookies from 'js-cookie';

const BasicDetailForm = () => {
  const router = useRouter();
  const [formDetails, setFormDetails] = useState({
    username: "",
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
    longitude: ""
  });
  const [error, setError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        setLat(latitude);
        setLng(longitude);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        console.log('Reverse Geocode Data:', data);

        const { house_number, road, suburb, city, town, village, state, postcode, country } = data.address;

        const fullAddress = `
          ${house_number ? house_number + ', ' : ''}${road ? road + ', ' : ''}${suburb ? suburb + ', ' : ''}
          ${city || town || village ? (city || town || village) + ', ' : ''}
          ${state ? state + ', ' : ''}${country ? country + ', ' : ''}${postcode ? postcode : ''}
        `.replace(/\s+/g, ' ').trim();

        setAddress(fullAddress || 'Address not found');
        setLoading(false);
      },
      (error) => {
        console.error(error);
        alert('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(formDetails, "formDetails");
    const isAnyFieldEmpty = Object.values(formDetails).some(
      (value) => value.trim() === ""
    );
    console.log(isAnyFieldEmpty, 'isAnyFieldEmpty');

    const isPhoneValid = /^\d{10}$/.test(formDetails.number);
    // if (!isAnyFieldEmpty && isPhoneValid) {
    setError(false);
    console.log(formDetails, "formDetails formDetails");
    toast.success("Details submitted successfully");
    setFormDetails({
      username: "",
      village: "",
      city: "",
      district: "",
      state: "",
      shopname: "",
      category: "",
      smp: "",
      gst_number: "",
      number: "",
      latitude: "",
      longitude: ""
    });
    formDetails.userId = Cookies.get('userId');
    formDetails.latitude = lat;
    formDetails.longitude = lng;
    submitBasicDetails(formDetails);
    router.push("/shopkepper/upload-image");

    // } else {
    //   setError(true);

    //   if (isAnyFieldEmpty) {
    //     toast.error("Please fill in all required fields");
    //   } else if (!isPhoneValid) {
    //     toast.error("Phone number must be exactly 10 digits");
    //   }
    // }
  };
  return (
    <form onSubmit={(e) => submitHandler(e)} className="w-full  mx-auto mt-6">
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
            className={`w-full flex  justify-between duration-300 items-center text-left text-xl font-semibold  px-5 py-3  text-blacks-200 ${openIndex === index
              ? "bg-transparent !text-greens-900"
              : "bg-[#F1FEF8]"
              } `}
          >
            {section.title}
            <Icon
              icon="back"
              className={` duration-300 ${openIndex === index ? "rotate-90" : "rotate-270"
                } `}
            />
          </button>

          <div
            className={`grid overflow-hidden duration-300 ${openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
          >
            <div className="overflow-hidden">
              <div className="px-4 py-4 bg-white rounded-b-lg">
                {index === 0 ? (
                  <div className="space-y-4">
                    <CustomInput
                      placeholder="Name"
                      name="username"
                      type="text"
                      error={!formDetails.username && error}
                      errorText="Name Is Required"
                      value={formDetails.username}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          username: e.target.value,
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
                      name="shopname"
                      type="text"
                      error={!formDetails.shopname && error}
                      errorText="shop Name Is Required"
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
                        "Grocery Store",
                        "Electronic Store",
                        "Fashion Store",
                        "Stationery Store",
                        "Hardware Store",
                        "Fruits & Vegetables Store",
                        "Restaurant / Dhaba",
                        "Medical Store",
                        "Furniture Store",
                        "Kitchen Store",
                        "Cosmetic Store",
                        "Jewellery Shop",
                        "Sweets Store",
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
                      options={['3', '5', '10', '12', '15', '20', '25', '30', '40', '50']} // Replace with actual SMP options
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
                      placeholder="Gst Number"
                      name="gst_number"
                      type="text"
                      error={!formDetails.gst_number && error}
                      errorText="Gst Number Is Required"
                      value={formDetails.gst_number}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          gst_number: e.target.value,
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
                    {/* <LocationPicker/> */}
                    <CustomButton
                      onClick={getLocation}
                      customClass="w-full gap-3 justify-center flex items-center !py-3.5"
                    >

                      <Icon icon="locationWhite" /> {loading ? 'Fetching Location...' : address === '' ? 'Choose Location from Google' : address}
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
