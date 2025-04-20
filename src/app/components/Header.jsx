"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
 
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
    <header className=" dark:bg-[rgb(36,37,38)] text-foreground  h-16 fixed top-0 left-0 right-0 z-50 p-2" >
      <div className="mx-auto flex justify-between items-center p-2">
      <div className="flex items-center gap-2 md:gap-4">
      <div
      className="cursor-pointer flex items-center"
      onClick={() => router.push("/")}
    >
      <Image
        src="/images/image.png" // Make sure this image exists in /public/images
        alt="App Logo"
        width={260} // adjust size as needed
        height={90}
        className="object-contain"
      />
    </div>

  <div className="relative" ref={searchRef}>
    <form onSubmit={handleSearchSubmit}>
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50 ">
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
<div className="flex justify-center items-center space-x-6 md:space-x-8">
  {[
    { label: "GROUPS", path: "/Groupspage", tab: "groups" },
    { label: "PAGES", path: "/Pages", tab: "pages" },
    { label: "MARKET", path: "/MarketPlace", tab: "market" },
    { label: "SERVICES", path: "/Services", tab: "services" },
    { label: "MEDIA", path: "/Media", tab: "media" },
    // { label: "BRIEF", path: "/brief", tab: "brief" },
    // { label: "GATHER", path: "/gather", tab: "gather" },
    { label: "UPDATES", path: "/Updates", tab: "updates" },
  ].map(({ label, path, tab }) => (
    <button
      key={tab}
      onClick={() => handleNavigation(path, tab)}
      className={`flex flex-col items-center justify-center px-2 py-1 transition duration-200 ${
        activeTab === tab ? "text-blue-500 bg-blue-600" : "text-gray-600 dark:text-gray-400"
      } hover:text-blue-600`}
    >
      {/* Top Icon - only shown when tab is active */}
      {/* {activeTab === tab && ( */}
        <img
          src="/images/icontop.png"
          alt="Top Icon"
          className="w-6 h-6 mb-1"
        />
      {/* )} */}
      {/* Tab Label */}
      <span className="text-xs font-medium">{label}</span>
    </button>
  ))}
</div>


        {/* user profile menu yaha se start hai  */}
        <div className="flex space-x-2 md:space-x-4 items-center">
        <div className="flex items-center rounded-xl overflow-hidden" style={{ background: "#dcdbcf" }}>
  <div className="p-2">
    <Search className="text-gray-500" />
  </div>
  <input
    type="text"
    // placeholder="Search..."
    className="px-3 py-2 w-full focus:outline-none bg-[#dcdbcf]"
  />
</div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 mr-2">
                      {user?.profilePicture ? (
                        <AvatarImage
                          src={user?.profilePicture}
                          alt={user?.username}
                        />
                      ) : (
                        <AvatarFallback className="dark:bg-gray-400">
                          {userPlaceholder}
                        </AvatarFallback>
                      )}
                    </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 z-50" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center ">
                    <Avatar className="h-8 w-8 mr-2">
                      {user?.profilePicture ? (
                        <AvatarImage
                          src={user?.profilePicture}
                          alt={user?.username}
                        />
                      ) : (
                        <AvatarFallback className="dark:bg-gray-400">
                          {userPlaceholder}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="">
                      <p className="text-sm font-medium leading-none">
                        {user?.username}
                      </p>
                      <p className="text-xs mt-2 text-gray-600 leading-none">
                       {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleNavigation(`/user-profile/${user?._id}`)}
              >
                <Users /> <span className="ml-2">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <MessageCircle /> <span className="ml-2">Messages</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="cursor-pointer"
              >
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
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut /> <span className="ml-2">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
