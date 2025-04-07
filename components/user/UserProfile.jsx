"use client";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";

const UserProfile = () => {
  const { user } = useAuthStore();
  const { userData, loading, error, fetchUserByUid } = useUserStore();

  useEffect(() => {
    // Debug logging
    console.log("Auth User:", user);
    console.log("User Data:", userData);

    // If we have a user but no userData, try to fetch it
    if (user && !userData) {
      console.log("Attempting to fetch user data for:", user.uid);
      fetchUserByUid(user.uid);
    }
  }, [user, userData, fetchUserByUid]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error loading user data: {error}</div>;
  }

  if (!user) {
    return <div>No user is logged in</div>;
  }

  if (!userData) {
    return <div>User is authenticated but profile data is not available</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <p>Name: {userData?.displayName || "Not set"}</p>
          <p>Email: {userData?.email || "Not set"}</p>
          <p>Address: {userData?.address || "Not set"}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">App Information</h3>
          <p>App ID: {userData?.appId || "Not set"}</p>
          <p>UUID: {userData?.uuid || "Not set"}</p>
        </div>

        {userData.referralCode && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Referral Code</h3>
            <p>{userData.referralCode}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold">Account Timestamps</h3>
          <p>
            Created:{" "}
            {userData.createdAt
              ? new Date(userData.createdAt.toDate()).toLocaleString()
              : "Not available"}
          </p>
          <p>
            Last Login:{" "}
            {userData.lastLoginAt
              ? new Date(userData.lastLoginAt.toDate()).toLocaleString()
              : "Not available"}
          </p>
        </div>
      </div>

      <pre className="mt-4 bg-gray-100 p-2 rounded overflow-auto">
        {JSON.stringify(userData, null, 2)}
      </pre>
    </div>
  );
};

export default UserProfile;
