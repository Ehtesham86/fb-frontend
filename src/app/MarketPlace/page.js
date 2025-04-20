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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        <CreateGroupPage getgroups={setGroups} getRefresh={setRefresh} />
        <div className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-3xl xl:max-w-4xl mx-auto" style={{marginLeft:'13rem'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 mb-4">
        {posts?.map((post) => (
  <Link href={`/Details?id=${post._id}`} key={post._id}>
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer">
      {post.imageUrl ? (
        <img
          src={post.imageUrl[0]}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="px-1">
        <h2 className="font-semibold text-lg truncate">{post.title}</h2>
        <p className="text-blue-600 font-bold text-md">${post.price}</p>
        <p className="text-sm text-gray-600">{post.condition}</p>
        <p className="text-sm text-gray-500 truncate">{post.category?.join(', ')}</p>
      </div>
    </div>
  </Link>
))}
</div>

        </div>

        <div className="hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4" style={{width:"31%"}}  >
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default MarketPlace;
