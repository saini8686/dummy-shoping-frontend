"use client";
import UserProfile from "@/components/user/UserProfile";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { userData, fetchUserByUid } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/sign-in");
      return;
    }

    // If we have a user but no user data, fetch it
    if (user && !userData) {
      console.log("Profile page: Fetching user data");
      fetchUserByUid(user.uid);
    }
  }, [user, userData, fetchUserByUid, router]);

  // If no user is logged in, show loading state (will redirect)
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6 p-4">User Profile</h1>
      <UserProfile />
    </div>
  );
}
