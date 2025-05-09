"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import userStore from "@/store/userStore";
import { getAllUsers ,getAllUsers1} from "@/service/user.service";
import Image from 'next/image';
import { Send } from 'lucide-react';

const users = [
  { _id: "6686f5dc61546b507649caf2", username: "Ali" },
  { _id: "6687efd3f8864be659bd5c16", username: "Naseem" },
  { _id: "66abea2c05eb45a8c5f2a141", username: "Ehtesh" },
  { _id: "66abea6005eb45a8c5f2a144", username: "ehtesham" },
];

const connections = [
  { name: "HAYLEY SAUNDERS", img: "https://i.pravatar.cc/40?img=1" },
  { name: "ALEGRA KAMISI", img: "https://i.pravatar.cc/40?img=2", ring: true },
  { name: "RACHEL AKASHA", img: "https://i.pravatar.cc/40?img=3" },
  { name: "EMILY HABS", img: "https://i.pravatar.cc/40?img=4", ring: true },
  { name: "DOUG HAYLEY", img: "https://i.pravatar.cc/40?img=5" },
  { name: "FRIEND OFEM", img: "https://i.pravatar.cc/40?img=6" },
  { name: "JEN FREEMAN", img: "https://i.pravatar.cc/40?img=7" },
];
const RightSideBar = () => {
    const [showAllSponsers,setShowAllSponsers]= useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    console.log(selectedUser,'selectedUser')
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
     const [userList,setUserList] = useState([])
     const [userList1,setUserList1] = useState([])

  const { user, clearUser } = userStore();
    const [loading,setLoading] = useState(false);
  console.log(userList1,'user_______1__')
  console.log(userList,'user_______12')
   const [showChatModal, setShowChatModal] = useState(false);
  
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
      const fetchUsers = async () => {
         try {
           setLoading(true);
           const result = await getAllUsers1()
           setUserList1(result);
         } catch (error) {
           console.log(error);
         }finally{
          setLoading(false);
         }
      }
      fetchUsers();
    },[])
    useEffect(() => {
      if (selectedUser) {
        axios
          .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/messages/${user._id}/${selectedUser._id}`)
          .then(res => setMessages(res.data.data))
          .catch(err => console.error(err));
      }
    }, [selectedUser]);
    const sendMessage = () => {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/send`, {
          senderId: user._id,
          receiverId: selectedUser._id,
          text
        })
        .then(res => {
          setMessages(prev => [...prev, res.data.message]);
          setText('');
        });
    };
  
  return (
    <div className="w-[500px] h-auto   border-r border-gray-300 p-4 flex flex-col justify-between" style={{width:'auto'}} >
      <div>
        {/* LIGHT FORMS SECTION */}
        <div
  className="p-4  border-l-4 border-b-4"
  style={{ borderColor: '#d3c19a' }} // lighter shade of #b79f68
>
  <h2 className="text-center text-[#c9aa71] font-medium tracking-wider text-sm mb-4">
    LIGHT FORMS
  </h2>

  <div className="grid grid-cols-3 gap-3 mb-3">
    <div className="overflow-hidden rounded-md">
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3qmBuBERRMhoFTvvNUWw7Kr9iicoxC4c8ZQ&s"
        alt="People sitting in a circle outdoors"
        width={120}
        height={120}
        className="rounded object-cover"
      />
    </div>
    <div className="overflow-hidden rounded-md">
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3qmBuBERRMhoFTvvNUWw7Kr9iicoxC4c8ZQ&s"
        alt="People in a field"
        width={120}
        height={120}
        className="rounded object-cover"
      />
    </div>
    <div className="overflow-hidden rounded-md">
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3qmBuBERRMhoFTvvNUWw7Kr9iicoxC4c8ZQ&s"
        alt="Person with a sign"
        width={120}
        height={120}
        className="rounded object-cover"
      />
    </div>
  </div>
  <div className="flex justify-between px-2 text-[#c9aa71] text-xs font-medium">
  <span className="ml-24">PHOTOS</span>
  <span className="mr-24">VIDEOS</span>
</div>


  {/* <div className="mt-2 border-t border-[#c9aa71]/30"></div> */}
</div>

<div className="flex h-screen overflow-y-auto">

<div className="flex h-screen justify-center items-start   bg-white">
  {/* Sidebar */}
  <div
    className="w-full max-w-md p-6 border border-yellow-700 rounded-lg shadow-md"
    style={{ borderColor: "#d3c19a" }}
  >
    <h2 className="text-sm tracking-widest text-yellow-700 font-semibold mb-4 text-center">
      CONNECTIONS
    </h2>

    <ul className="space-y-2 w-full">
      {userList.map((userItem) => (
        <li
          key={userItem._id}
          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-all w-full ${
            selectedUser?._id === userItem._id
              ? "bg-yellow-100"
              : "hover:bg-gray-100"
          }`}
          onClick={() => {
            setSelectedUser(userItem);
            setShowChatModal(true);
          }}
        >
          <img
            src={
              userItem.profilePicture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.username)}`
            }
            alt={userItem.username}
            className="w-10 h-10 rounded-full border-2 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700 break-words">
            {userItem.username}
          </span>
        </li>
      ))}
    </ul>
  </div>
</div>


{/* Placeholder to occupy remaining space */}
{/* <div className="w-2/3"></div> */}

{/* Chat Modal */}
{showChatModal && selectedUser && (
  <div className="fixed bottom-10 right-24 w-full max-w-sm bg-white rounded-lg shadow-lg z-50 border border-gray-200 flex flex-col h-[70vh]">
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-100 rounded-t-lg">
      <div className="flex items-center space-x-2">
        <img
          src={
            selectedUser.profilePicture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.username)}`
          }
          alt={selectedUser.username}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-semibold text-gray-700">{selectedUser.username}</span>
      </div>
      <button
        onClick={() => setShowChatModal(false)}
        className="text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>

    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-4 py-2 rounded-lg text-sm max-w-[75%] break-words ${
                msg.senderId === user._id
                  ? "bg-blue-500 text-white"
                  : "bg-green-400 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No messages yet.</p>
      )}
    </div>

    {/* Message Input */}
    <div className="p-3 border-t border-gray-200 flex">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded text-sm"
        placeholder="Type your message..."
      />
      <button
        onClick={sendMessage}
        className="ml-2 px-4 py-2 bg-yellow-300 text-white rounded text-sm hover:bg-yellow-400"
      >
        <Send />
      </button>
    </div>
  </div>
)}
</div>


      {/* TRANSMISSIONS */}
      <div className="mt-6 border-t border-yellow-700 pt-3 pl-3 flex justify-center items-center space-x-2   font-semibold text-sm tracking-widest" style={{color:"#b79f68"}}>
  <Image 
    src="/images/icontop.png" 
    alt="Transmission Icon"
    width={20}
    height={20}
  />
  <span>TRANSMISSIONS</span>
</div>
      </div>
      
    </div>
  )
}
  {/* CONNECTIONS */}
        {/* <div className="pl-3">
          <h2 className="text-xs tracking-widest text-yellow-700 font-semibold mb-3">
            CONNECTIONS
          </h2>
          
          <ul className="space-y-3">
            {userList.map((conn, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conn.profilePicture}
                    alt={conn.username}
                    className={`w-10 h-10 rounded-full border-2 ${
                      conn.ring ? "border-yellow-500" : "border-gray-300"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {conn.username}
                </span>
              </li>
            ))}
          </ul>
        </div> */}
export default RightSideBar