import { CustomButton } from "@/components/common/CustomButton";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getBasicDetails } from "../../../services/basic-details.service";

const QrCode = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBasicDetails = async () => {
      try {
        const data = await getBasicDetails();
        console.log(data, 'basic details data');
        
        setDetails(data);
      } catch (error) {
        console.error('Error fetching basic details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBasicDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <div className="py-5 px-7 mt-[18px] rounded-lg bg-greys-100 w-full">
        <Image
          src="/assets/images/png/shopkepper/basic-detail-profile.png"
          alt="profile"
          width={63}
          height={63}
          className="size-[63px] object-cover rounded-full mx-auto flex"
        />
        <Image
          src={details.qrCode}
          alt="profile"
          width={263}
          height={263}
          className="h-[263px] w-[263px] object-cover mt-3 mx-auto flex"
        />
        <p className="text-sm mt-3 font-medium text-center leading-[150%] text-blacks-200">
          <span className="text-greens-900">Shop Name:</span> 
          {details.shopname}
        </p>
        <p className="text-sm font-medium mt-2 text-center leading-[150%] text-blacks-200">
          <span className="text-greens-900">Village/City:</span> 
          {details.city}
        </p>
      </div>
      <CustomButton customClass="w-full py-[11px] mt-8">
        Download QR Code
      </CustomButton>
      <button className="transparent-green-border-button w-full !text-greens-900 !py-[11px] hover:!text-white !mt-4">
        Regenerate QR Code
      </button>
    </div>
  );
};

export default QrCode;
