"use client"
import { useState } from "react";

const Dashboard = () => {
  const [tab, setTab] = useState("users");

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", wallet: 1200 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", wallet: 800 },
  ];

  const payments = [
    { id: 1, name: "John Doe", amount: 500, date: "2025-07-09" },
    { id: 2, name: "Jane Smith", amount: 800, date: "2025-07-08" },
  ];

  const renderContent = () => {
    if (tab === "users") {
      return (
        <div className="p-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-4 mb-2 rounded shadow">
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <div className="text-xs text-green-600 mt-1">
                Wallet: {user.wallet}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (tab === "payments") {
      return (
        <div className="p-4">
          {payments.map((pay) => (
            <div key={pay.id} className="bg-white p-4 mb-2 rounded shadow">
              <div className="font-semibold">{pay.name}</div>
              <div className="text-sm text-gray-600">
                Amount: {pay.amount}
              </div>
              <div className="text-xs text-gray-400">Date: {pay.date}</div>
            </div>
          ))}
        </div>
      );
    }

    if (tab === "wallet") {
      const total = users.reduce((sum, user) => sum + user.wallet, 0);
      return (
        <div className="p-4 text-center">
          <div className="bg-yellow-100 p-6 rounded-xl shadow">
            <div className="text-sm text-gray-600">Total Wallet Balance</div>
            <div className="text-2xl font-bold text-yellow-700">{total}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-4">

      <div className="flex justify-around text-sm bg-white shadow p-2 sticky top-0 z-10">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded ${
            tab === "users"
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setTab("payments")}
          className={`px-4 py-2 rounded ${
            tab === "payments"
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setTab("wallet")}
          className={`px-4 py-2 rounded ${
            tab === "wallet"
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          Wallet
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default Dashboard;
