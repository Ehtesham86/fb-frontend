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
import FriendRequest from "../friends-list/FriendRequest";
import FriendsSuggestion from "../friends-list/FriendsSuggestion";

const Updates = () => {
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
    {/* Heading */}
    <h1 className="text-3xl font-bold mt-24 ml-6 sm:ml-4">New Friend Request</h1>
  
    <main className="flex flex-1 flex-col lg:flex-row gap-6 px-4 lg:px-8">
      {/* Left side: FriendRequest and FriendsSuggestion */}
      <aside className="hidden md:flex flex-col gap-6 mt-6 w-full max-w-xs">
        <FriendRequest />
  
        <div>
          <h2 className="text-xl font-semibold mb-2">Friend Suggestions</h2>
          <FriendsSuggestion />
        </div>
      </aside>
  
      {/* Center content: NewPostForm and Post List */}
      <section className="w-full lg:flex-1 mt-6">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <NewPostForm
            groups={groups}
            isPostFormOpen={isPostFormOpen}
            setIsPostFormOpen={setIsPostFormOpen}
          />
          <div className="mt-6 space-y-6 mb-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                isLiked={likePosts.has(post?._id)}
                onLike={() => handleLike(post?._id)}
                onComment={async (comment) => {
                  await handleCommentPost(post?._id, comment.text);
                  await fetchPost();
                }}
                onShare={async () => {
                  await handleSharePost(post?._id);
                  await fetchPost();
                }}
              />
            ))}
          </div>
        </div>
      </section>
  
      {/* Right sidebar */}
      <aside className="hidden lg:block w-full max-w-sm xl:max-w-md mt-6 lg:mt-0 lg:sticky lg:top-20">
        <RightSideBar />
      </aside>
    </main>
  </div>
  
  
  );
};

export default Updates;
