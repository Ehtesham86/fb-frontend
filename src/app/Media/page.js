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

const Media = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [likePosts,setLikePosts] = useState(new Set());
  const {posts,fetchPost,handleLikePost,handleCommentPost,handleSharePost} = usePostStore();
  const [groups, setGroups] = useState([]);

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
    
    {/* Main content - 75% on large screens */}
    <div className="w-full lg:w-3/4 px-4 py-6">
      <div className="w-full lg:w-[90%] xl:w-[85%] mx-auto">
        <NewPostForm
          groups={groups}
          isPostFormOpen={isPostFormOpen}
          setIsPostFormOpen={setIsPostFormOpen}
        />
    {/* Gallery Section */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
  {posts
    .filter((post) => post.mediaUrl) // only posts with media
    .map((post) => (
      <div key={post._id} className="rounded overflow-hidden shadow-md">
        {post.mediaType === "image" ? (
          <img
            src={post.mediaUrl}
            alt={post.content}
            className="w-full h-48 object-cover"
          />
        ) : post.mediaType === "video" ? (
          <video
            controls
            className="w-full h-48 object-cover"
            src={post.mediaUrl}
          />
        ) : null}
      </div>
    ))}
</div>

      </div>
    </div>

    {/* Right Sidebar - 25% on large screens */}
    <div className="hidden lg:block lg:w-1/4 fixed right-0 top-16 bottom-0 overflow-y-auto p-4">
      <RightSideBar />
    </div>

  </main>
</div>

  );
};

export default Media;
