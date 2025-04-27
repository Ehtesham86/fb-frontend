"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useInputStore } from "@/store/useInputStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Loader from "@/lib/Loader";
import { logout } from "@/service/auth.service";
import { getAllUsers } from "@/service/user.service";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import {
  Bell,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  Users,Skull ,
  Video,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery,setSearchQuery] = useState("");
  const [userList,setUserList] = useState([])
  const [filterUsers,setFilterUsers] = useState([])
  const [loading,setLoading] = useState(false);
  const [activeTab,setActiveTab] = useState("home");
  const searchRef = useRef(null)
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const { user, clearUser } = userStore();

  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");
    const { setInputValue } = useInputStore();

    const handleChange = (e) => {
      setInputValue(e.target.value); // save input value in Zustand store
    };
  const handleNavigation = (path, item) => {
    router.push(path);
    setActiveTab(item)
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


  useEffect(() =>{
    const fetchUsers = async () => {
       try {
         setLoading(true);
         const result = await getAllUsers()
         setUserList(result);
       } catch (error) {
         console.log(error);
       }finally{
        setLoading(false);
       }
    }
    fetchUsers();
  },[])

  useEffect(() =>{
    if(searchQuery){
      const filterUser = userList.filter(user => {
       return  user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      })
      setFilterUsers(filterUser);
      setIsSearchOpen(true)
    }else{
      setFilterUsers([])
      setIsSearchOpen(false)
    }
  },[searchQuery,userList])

  const handleSearchSubmit = (e) =>{
     e.preventDefault()
     setIsSearchOpen(false)
  }
  
  const handleUserClick = async(userId) =>{
     try {
       setLoading(true)
       setIsSearchOpen(false)
       setSearchQuery("")
       await router.push(`user-profile/${userId}`)
     } catch (error) {
       console.log(error)
     }finally{
      setLoading(false)
     }
  }

  const handleSearchClose = (e) =>{
        if(!searchRef.current?.contains(e.target)){
          setIsSearchOpen(false)
        }
  }
   useEffect(() =>{
    document.addEventListener("click",handleSearchClose)
    return () => {
      document.removeEventListener("click",handleSearchClose)
    }
   })


   if(loading){
    return <Loader/>
   }


  return (
<header className="bg-white dark:bg-gray-900text-foreground h-24 fixed top-0 left-0 right-0 z-50 p-2">
<div className="mx-auto flex justify-between items-center p-2">
<div className="flex items-center gap-2 md:gap-4">
        <div className="cursor-pointer flex items-center" onClick={() => router.push("/")}>
          <Image
            src="/images/image.png"
            alt="App Logo"
            width={260}
            height={90}
            className="object-contain"
          />
        </div>
  
        <div className="relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            {isSearchOpen && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50">
                <div className="p-2">
                  {filterUsers.length > 0 ? (
                    filterUsers.map((user) => (
                      <div
                        className="flex items-center space-x-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                        key={user._id}
                        onClick={() => handleUserClick(user?._id)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {user?.profilePicture ? (
                              <AvatarImage src={user?.profilePicture} alt={user?.username} />
                            ) : (
                              <AvatarFallback>{userPlaceholder}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{user?.username}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No user Found</div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
  
      <div className="flex justify-center dark:bg-[rgb(36,37,38)]  items-center flex-wrap gap-3 md:gap-6 py-2">
        {[
          { label: "GROUPS", path: "/Groupspage", tab: "groups" },
          { label: "PAGES", path: "/Pages", tab: "pages" },
          { label: "MARKET", path: "/MarketPlace", tab: "market" },
          { label: "SERVICES", path: "/Services", tab: "services" },
          { label: "MEDIA", path: "/Media", tab: "media" },
          { label: "UPDATES", path: "/Updates", tab: "updates" },
        ].map(({ label, path, tab }) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleNavigation(path, tab)}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              {isActive && (
                <img src="/images/icontop.png" alt="Top Icon" className="w-5 h-5 mb-1" />
              )}
              <span className="text-sm font-semibold tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
  
      <div className="flex space-x-2 md:space-x-4 items-center">
        <div className="flex items-center rounded-xl overflow-hidden" style={{ background: "#dcdbcf" }}>
          <div className="p-2">
            <Search className="text-gray-500" />
          </div>
          <input
            type="text"
            onChange={handleChange}

            className="px-3 py-2 w-full focus:outline-none bg-[#dcdbcf]"
          />
        </div>
  
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 mr-2">
                {user?.profilePicture ? (
                  <AvatarImage src={user?.profilePicture} alt={user?.username} />
                ) : (
                  <AvatarFallback className="dark:bg-gray-400">
                    {userPlaceholder}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
  
          <DropdownMenuContent
            className="w-64 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md z-[9999]"
            align="end"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    {user?.profilePicture ? (
                      <AvatarImage src={user?.profilePicture} alt={user?.username} />
                    ) : (
                      <AvatarFallback className="dark:bg-gray-400">
                        {userPlaceholder}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-300 leading-none">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
  
            <DropdownMenuSeparator />
  
            <DropdownMenuItem onClick={() => handleNavigation(`/user-profile/${user?._id}`)}>
              <Users className="mr-2" /> <span>Profile</span>
            </DropdownMenuItem>
  
            <DropdownMenuSeparator />
  
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "light" ? (
                <>
                  <Moon className="mr-2" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="mr-2" />
                  <span>Light Mode</span>
                </>
              )}
            </DropdownMenuItem>
  
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2" /> <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
  
  );
};

export default Header;
