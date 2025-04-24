"use client"
import React, { useEffect, useState } from "react";
 import RightSideBar from "../components/RightSideBar";
import StorySection from "@/app/story/StorySection";
import NewPostForm from "../posts/NewPostForm";
import PostCard from "../posts/PostCard";
import { usePostStore } from "@/store/usePostStore";
import toast from "react-hot-toast";
import { Send } from 'lucide-react';
import LeftSideBar from "./CreateGroupPage ";
import CreateGroupPage from "./CreateGroupPage ";
import Link from 'next/link';

const MarketPlace = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [Refresh, setRefresh] = useState(false);
   const [likePosts,setLikePosts] = useState(new Set());
  const {fetchPost,handleLikePost,handleCommentPost,handleSharePost} = usePostStore();
  const [groups, setGroups] = useState([]);
  const [posts, setposts] = useState([]);
 
  useEffect(() => {
     const fetchListings = async () => {
      try {
        const response = await fetch('https://fb-backend.vercel.app/MarketPlace/marketplace');
        const data = await response.json();
        console.log('Fetched data:', data);
        if (data.status === 'success') {
          setposts(data.data);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
      }
    };
  
    fetchListings();
  }, [Refresh]);
  
  
  
console.log(groups,'groups_________1')
console.log(posts,'groups_________1posts')


  useEffect(() =>{
    fetchPost()
  },[fetchPost])

  useEffect(() =>{
    const saveLikes = localStorage.getItem('likePosts');
    if(saveLikes){
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  },[]);


  const handleLike = async(postId)=>{
    const updatedLikePost = new Set(likePosts);
    if(updatedLikePost.has(postId)){
      updatedLikePost.delete(postId);
      toast.error('post disliked successfully')
    }else {
      updatedLikePost.add(postId)
      toast.success('post like successfully')
    }
    setLikePosts(updatedLikePost);
    localStorage.setItem('likePosts',JSON.stringify(Array.from(updatedLikePost)))

    try {
      await handleLikePost(postId);
      await fetchPost();
    } catch (error) {
       console.error(error);
       toast.error('failed to like or unlike the post')
    }
  }


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground mt-4">
    <main className="flex flex-1 pt-16 relative">
      
      {/* Left Sidebar - Create Group */}
      <div className="hidden md:block fixed left-0 top-16 bottom-0 w-52 px-4 py-6 overflow-y-auto border-r bg-white dark:bg-gray-900">
        <CreateGroupPage getgroups={setGroups} getRefresh={setRefresh} />
      </div>
  
      {/* Main Content */}
      <div className="flex-1 md:ml-52 lg:ml-64 xl:ml-72 px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts?.map((post) => (
            <Link href={`/Details?id=${post._id}`} key={post._id}>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 cursor-pointer">
                {post.imageUrl?.[0] ? (
                  <img
                    src={post.imageUrl[0]}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No Image
                  </div>
                )}
  
                <div className="space-y-1">
                  <h2 className="font-semibold text-base truncate">{post.title}</h2>
                  <p className="text-blue-600 font-bold text-sm">${post.price}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{post.condition}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                    {post.category?.join(', ')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
  
      {/* Right Sidebar */}
      <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-72 xl:w-80 overflow-y-auto p-4 border-l bg-white dark:bg-gray-900">
        <RightSideBar />
      </div>
    </main>
  </div>
  
  );
};

export default MarketPlace;
