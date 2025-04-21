'use client';

import React from 'react';

const UpiButton = () => {
  const handleUPIClick = () => {
    const upiId = 'yourupi@upi'; // Replace with your UPI ID
    const payeeName = 'Your Name';
    const amount = '10'; // Change amount as needed
    const note = 'Test Payment';

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    // Redirect to UPI payment app
    window.location.href = upiUrl;
  };

  return (
    <button
      onClick={handleUPIClick}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
    >
      Pay with UPI
    </button>
  );
};

export default UpiButton;