"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/service/auth.service";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  User,
  Users,MoreHorizontal,
  Video,Store
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from 'axios';
 
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/service/url.service";

const LeftSideBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const { user, clearUser } = userStore();
  const [profileData, setProfileData] = useState(null); // Initial state is null
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Make the API call when the component mounts
    const fetchData = async () => {
      try {
        // Set loading state to true before making the request
        setIsLoading(true);

        // Use axios to make the request with the token in the Authorization header
        const response = await axiosInstance.get(`/users/profile/6686f5dc61546b507649caf2`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Pass the token here
          }
        });

        // Check if the response is successful and set the profile data to state
        if (response.data.status === "success") {

          setProfileData(response.data.data.profile.bio); // Set the profile data to state
          console.log(response.data.data.profile.bio,'res________-')
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (error) {
        setError("Error fetching data: " + error.message); // Set the error state
      } finally {
        setIsLoading(false); // Set loading state to false when the request is complete
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error if there's an issue

  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");
  const handleNavigation = (path, item) => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result?.status == "success") {
        router.push("/user-login");
        clearUser();
      }
      toast.success("user logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error("failed to log out");
    }
  };
  return (
    <aside
      className={`fixed top-16 left-0 h-full w-64 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
        isSidebarOpen
          ? "translate-x-0 bg-white dark:bg-[rgb(36,37,38)] shadow-lg "
          : " -translate-x-full"
      } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
    >
      <div className="flex flex-col h-auto shadow-xl   overflow-y-hidden rounded-t-full
  bg-[#e0f7fa]" >
        {/* navigation menu yaha pr */}
        <nav className="space-y-4 flex-grow">
        <div className="flex flex-col items-center justify-center cursor-pointer"  onClick={() => handleNavigation(`/user-profile/${user?._id}`)}>
      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#D29F36] "   > {/* Increased size */}
        <img 
          src={user?.profilePicture}
          alt="User Avatar" 
          className="w-full h-full object-cover" 
        />
      </div>
      <span className="font-semibold mt-2">{user?.lastName}</span>
      <span className="font-semibold mt-1">{user?.firstName}</span>
    </div>
    <div className="p-6 bg-[#e0f7fa] rounded-lg text-center">
      <p className="text-gray-800 mb-4">
      {profileData?.bioText}
        <br />
        {/* and remember sacred knowledge */}
      </p>

      <h3 className="font-bold text-lg mb-2">{profileData?.education}</h3>
      <h3 className="font-bold text-lg mb-2">{profileData?.workplace}</h3>
      <h3 className="font-bold text-lg mb-4">{profileData?.hometown}</h3>
      
      <a 
        href="https://www.akashacom.com" 
        className="text-black font-bold underline uppercase mb-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.akashacom.com
      </a>

      <div className="mt-4"> {/* Adds spacing above the logo */}
        <img 
          src="/images/logob.png" 
          alt="Logo" 
          className="mx-auto h-24 w-auto" // Increased height from h-12 to h-24
        />
      </div>
    </div>
        </nav>

        {/* footer section */}

        {/* <div className="mb-16">
          <Separator className="my-4" />
          <div className="flex items-center space-x-2 mb-4 cursor-pointer "    onClick={() => handleNavigation(`/user-profile/${user?._id}`)}>
            <Avatar className="h-10 w-10">
              {user?.profilePicture ? (
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
              ) : (
                <AvatarFallback className="dark:bg-gray-400">
                  {userPlaceholder}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="font-semibold">{user?.username}</span>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
          <Button variant="ghost" className="cursor-pointer -ml-4 " onClick={handleLogout} >
            <LogOut /> <span className="ml-2 font-bold text-md">Logout</span>
          </Button>
            <p>Privacy · Terms · Advertising ·</p>
            <p>· Svryn Social © 2024</p>
          </div>
        </div> */}
      </div>
    </aside>
  );
};

export default LeftSideBar;
