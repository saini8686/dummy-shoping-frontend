'use client';

import { useState } from 'react';
import Icon from './Icons';
import { CustomButton } from './CustomButton';

export default function LocationPicker() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
      <CustomButton
        onClick={getLocation}
        customClass="w-full gap-3 justify-center flex items-center !py-3.5"
      >
        
        <Icon icon="locationWhite" /> {loading ? 'Fetching Location...' : address === ''?  'Choose Location from Google':address}
      </CustomButton>
  );
}
