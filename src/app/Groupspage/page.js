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

const Groupspage = () => {
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
    <div className="min-h-screen bg-background text-foreground pt-16">
    <main className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,3fr)_1fr]">
      {/* Left Sidebar (Visible on lg+) */}
      <div className="hidden lg:block   p-4">
        <CreateGroupPage getgroups={setGroups} />
      </div>
  
      {/* Center Content */}
      <div className="w-full px-4 py-6">
        <div className="w-full max-w-3xl mx-auto">
          <NewPostForm
            groups={groups}
            pages={'groups'}

            isPostFormOpen={isPostFormOpen}
            setIsPostFormOpen={setIsPostFormOpen}
          />
          <div className="mt-6 space-y-6 mb-4">
            {posts
  .filter(post => post.pages==='groups') // filters out posts where group is null, empty string, or undefined
  .map((post) => (
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
      </div>
  
      {/* Right Sidebar (Visible on lg+) */}
      <div className="hidden lg:block   p-4">
        <RightSideBar />
      </div>
    </main>
  </div>
  
  );
};

export default Groupspage;
