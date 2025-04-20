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
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react";
import { MessageCircleMore } from 'lucide-react';
import userStore from "@/store/userStore";

const Details = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [Refresh, setRefresh] = useState(false);
  const { user } = userStore();

  const [likePosts,setLikePosts] = useState(new Set());
  const {fetchPost,handleLikePost,handleCommentPost,handleSharePost} = usePostStore();
  const [groups, setGroups] = useState([]);
  const [posts, setposts] = useState([]);
  const [IdProduct, setIdProduct] = useState('');
  const [idcallingfrom, setIdcallingfrom] = useState('');

  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [message, setMessage] = useState("");
  const [refresh, setrefresh] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const callingfrom = searchParams.get('callingfrom');

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);

    // ✅ Separate fetch function
  const fetchMessages = () => {
    fetch(`https://fb-backend.vercel.app/api/chat/messages/${posts[0].sellerId}/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setMessages(data.data);
        }
      })
      .catch((err) => console.error("Error fetching messages:", err));
  };
  useEffect(() => {
    if (isChatOpen) {
      fetchMessages();
    }
  }, [isChatOpen,refresh]);
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch("https://fb-backend.vercel.app/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId:user._id,
          receiverId:posts[0].sellerId,
          text: message,
        }),
      });

      const data = await response.json();
      console.log("Message sent:", data);
      setrefresh(!refresh)
      setMessage(""); // Clear input
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (id) {
      setIdProduct(id)
      setIdcallingfrom(callingfrom)

      console.log('ID from URL:', id);
      console.log('ID from URL:', callingfrom);

      // Fetch data with the ID here if needed
    }
  }, [id]);
  useEffect(() => {
     const fetchListings = async () => {
      try {
        const response = await fetch(`http://localhost:8080/marketplace/marketplace/${IdProduct}`);
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
  
  
  
console.log(user,'groups_________1___')
 

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
  const thumbnails = [
    'https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1528148343865-51218c4a13e6?auto=format&fit=crop&w=1080&q=80',
  ];
 
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (posts.length > 0 && posts[0].imageUrl.length > 0) {
      setMainImage(posts[0].imageUrl[0]); // default image
    }
  }, [posts]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        <CreateGroupPage getgroups={setGroups} getRefresh={setRefresh} />
        <div className="container mx-auto px-4 py-8 over mt-16">
      <div className="flex flex-wrap -mx-4">

      <div className="w-full md:w-1/2 px-4 mb-8">
      {/* Main Image */}
      {mainImage && (
        <img
          src={mainImage}
          alt="Main Product"
          className="w-full h-auto rounded-lg shadow-md mb-4"
        />
      )}

      {/* Thumbnail Images */}
      <div className="flex gap-4 py-4 justify-center overflow-x-auto">
        {posts[0]?.imageUrl?.slice(0, 4).map((thumb, index) => (
          <img
            key={index}
            src={thumb}
            alt={`Thumbnail ${index}`}
            onClick={() => setMainImage(thumb)}
            className={`size-16 sm:size-20 object-cover rounded-md cursor-pointer transition duration-300 ${
              mainImage === thumb ? "opacity-100 border-2 border-blue-500" : "opacity-60 hover:opacity-100"
            }`}
          />
        ))}
      </div>
    </div>
    <div className="w-full md:w-1/2 px-4">
  <h2 className="text-3xl font-bold mb-2">{posts[0]?.title}</h2>
  <p className="text-gray-600 mb-4">SKU: WH1000XM4</p>

  <div className="mb-4">
    <span className="text-2xl font-bold mr-2">${posts[0]?.price}</span>
  </div>

  <div className="flex items-center mb-4 text-yellow-500">
    {/* Rating stars can be added here */}
  </div>

  <p className="text-gray-700 mb-6">{posts[0]?.description}</p>

  <div className="flex items-center gap-4 mb-6">
  {/* Eye icon to toggle phone number */}
  <button 
    onClick={() => setShowPhoneNumber(!showPhoneNumber)} 
    className="p-2 rounded-full hover:bg-gray-200"
  >
    {showPhoneNumber ? <EyeOff /> : <Eye />}
  </button>

  {/* Conditionally display the phone number */}
  {showPhoneNumber && (
    <p className="text-gray-700 ml-2">{posts[0]?.PhoneNumber}</p>
  )}

  {/* Add to Cart button */}
  <button
        onClick={toggleChat}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300 "      >
        <MessageCircleMore />
      </button>
      {isChatOpen && (
             <div className="fixed bottom-6 right-6 w-full sm:w-80 md:w-96 h-96 bg-white shadow-lg rounded-lg p-4 z-50">
             <div className="h-full flex flex-col">
               <div className="flex justify-between items-center border-b pb-2">
                 <h2 className="text-lg font-semibold">Chat</h2>
                 <button
                   onClick={toggleChat}
                   className="text-gray-500 hover:text-gray-700"
                 >
                   Close
                 </button>
               </div>
   
               <div className="flex-1 overflow-y-auto p-2 space-y-2">
                 {messages.length === 0 && (
                   <p className="text-gray-500 text-sm">No messages yet.</p>
                 )}
                 {messages.map((msg) => (
                   <div
                     key={msg._id}
                     className={`p-2 rounded-lg max-w-[80%] ${
                       msg.senderId === user._id
                         ? "bg-blue-100 ml-auto text-right"
                         : "bg-gray-200"
                     }`}
                   >
                     {msg.text}
                     <div className="text-[10px] text-gray-500">
                       {new Date(msg.timestamp).toLocaleTimeString()}
                     </div>
                   </div>
                 ))}
               </div>
   
               <div className="mt-auto flex items-center space-x-2 pt-2 border-t">
                 <input
                   type="text"
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   placeholder="Type a message..."
                   className="flex-1 border p-2 rounded-lg"
                 />
                 <button
                   onClick={handleSendMessage}
                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                 >
                   Send
                 </button>
               </div>
             </div>
           </div>
  
      )}
</div>

</div>



      </div>
    </div>

        <div className="hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4" style={{width:"31%"}}  >
          {/* <RightSideBar /> */}
        </div>
      </main>
    </div>
  );
};

export default Details;
