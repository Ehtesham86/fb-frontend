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
import { useInputStore } from "@/store/useInputStore";
import { X } from 'lucide-react'; // Import the close icon from lucide-react

 const Services = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [Refresh, setRefresh] = useState(false);
   const [likePosts,setLikePosts] = useState(new Set());
  const {fetchPost,handleLikePost,handleCommentPost,handleSharePost} = usePostStore();
  const { inputValue } = useInputStore();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [price, setPrice] = useState(500); // Default middle value
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  
console.log(selectedOption,'selectedOption____-')
console.log(priceTo,'selectedOption____-price')
console.log(priceFrom,'selectedOption____-pricepriceFrom')


  // Function to open the modal
  const openModal = () => {
    setIsFilterModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsFilterModalOpen(false);
  };
  const [groups, setGroups] = useState([]);
  const [posts, setposts] = useState([]);
 
  useEffect(() => {
     const fetchListings = async () => {
      try {
        const response = await fetch('https://fb-backend.vercel.app/Services/Services');
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
  const filteredPosts = posts.filter((post) => {
    const matchesTitle = post.title.toLowerCase().includes(inputValue.toLowerCase());
    const matchesServiceType = selectedOption
      ? post.serviceType.toLowerCase() === selectedOption.toLowerCase()
      : true;
    const matchesPriceFrom = priceFrom ? post.price >= parseFloat(priceFrom) : true;
    const matchesPriceTo = priceTo ? post.price <= parseFloat(priceTo) : true;
  
    return matchesTitle && matchesServiceType && matchesPriceFrom && matchesPriceTo;
  });
  


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
    <main className="flex flex-1 pt-16 relative">
      {/* Left Panel */}
      <CreateGroupPage getgroups={setGroups} getRefresh={setRefresh} />

      {/* Middle Panel */}
      <div className="flex-1 px-4 py-8 md:px-10 lg:px-20 xl:px-32 mx-auto">
        {/* Filters button at the top-left */}
        <div className="flex justify-start mb-6">
          <button
            onClick={openModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Filters
          </button>
        </div>

        {/* Grid of services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link
                href={`/ServicesDetails?id=${post._id}&callingfrom=services`}
                key={post._id}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 cursor-pointer hover:scale-[1.02]">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl[0]}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-xl mb-3 group-hover:opacity-90 transition"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  <div className="px-1 space-y-1">
                    <h2 className="font-semibold text-lg text-gray-800 truncate group-hover:text-blue-600 transition">
                      {post.title}
                    </h2>
                    <p className="text-blue-600 font-bold text-md">${post.price}</p>
                    <p className="text-sm text-gray-600">
                      {post.city}, {post.country}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {post.category?.join(', ')}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              No services found.
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4" style={{ width: "31%" }}>
        <RightSideBar />
      </div>
    </main>

  {/* Modal */}
{isFilterModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg w-11/12 sm:w-96 p-6 relative">
      {/* Close icon */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
      >
        <X size={24} />
      </button>

      {/* Modal Content */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Filter Options</h2>

        {/* Service Type Dropdown */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Service Type</label>
          <select
            className="mt-2 block w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">-- Select a Service Type --</option>
            <option value="Haircut">Haircut</option>
            <option value="Massage Therapy">Massage Therapy</option>
            <option value="Yoga Class">Yoga Class</option>
            <option value="Photography">Photography</option>
            <option value="Content Writing">Content Writing</option>
            <option value="Web Development">Web Development</option>
            <option value="Consultation">Consultation</option>
            <option value="Tutoring">Tutoring</option>
            <option value="Legal Advice">Legal Advice</option>
            <option value="Car Repair">Car Repair</option>
            <option value="House Cleaning">House Cleaning</option>
            <option value="Nail Art">Nail Art</option>
            <option value="Nutrition Coaching">Nutrition Coaching</option>
            <option value="App Design">App Design</option>
            <option value="Event Planning">Event Planning</option>
            <option value="Personal Training">Personal Training</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Price Range</label>
          <div className="flex items-center space-x-4">
            {/* Price From */}
            <input
              type="number"
              min="0"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              placeholder="From"
              className="w-1/2 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Price To */}
            <input
              type="number"
              min="0"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              placeholder="To"
              className="w-1/2 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="mt-6">
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
)}

  </div>
  
  
  );
};

export default Services;
