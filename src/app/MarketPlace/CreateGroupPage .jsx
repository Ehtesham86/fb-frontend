"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentButton from '../Details/PaymentButton';
import StripeWrapper from '../Details/StripeWrapper';

const CreateGroupPage = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [title, settitle] = useState('');
  const [description, setDescription] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
// Add at the top in your component state declarations
const [isFeatured, setIsFeatured] = useState(null); // true or false
const [PaymentDone, setPaymentDone] = useState(null); // true or false
console.log(PaymentDone,'PaymentDone_________1')
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message1, setMessage1] = useState('');
  const [message11, setmessage11] = useState('');


console.log(message1,'Message from child:___1')
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (typeof message1 === 'function') {
      setmessage11(true);
    }
  }, [message1]);
  const handleCheckboxChange = (category) => {
    setSelectedOptions((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleImageUpload = async () => {
    if (!images) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', images);
    formData.append('upload_preset', 'dgmjg9zr4'); // You must create this in your Cloudinary dashboard
    formData.append('cloud_name', 'dgmjg9zr4');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dgmjg9zr4/image/upload', formData);
      setImageUrl(res.data.secure_url);
      return res.data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };
  console.log(groups,'groups_________3')
  const categoryOptions = [
    'Tools', 'Furniture', 'Household', 'Garden', 'Appliances', 'Entertainment',
    'Video Games', 'Books, Films,Music', 'Luggage', "Women's Dressing", "Men's Dressing",
    'Jewellery', 'Health Care', 'Pet supplies', 'Baby Care', 'Toys', 'Games',
    'Electronics', 'Bycicles', 'Arts', 'Sports and Games', 'Cars', 'Cars Parts'
  ];

  const currentUser = JSON.parse(localStorage.getItem('user-storage'));
  const staticUserId = currentUser?.state?.user?._id;
  const sellerName = currentUser?.state?.user?.username;

  console.log(currentUser, 'groups_________39');
  // const staticUserId = '6686f5dc61546b507649caf2';
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `https://fb-backend.vercel.app/PagesRoute/Pages?userId=${staticUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(response.data?.data || []);
      props.getgroups(response.data?.data || [])
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  const [ErrMsg, setErrMsg] = useState('');

  const handleCreateListing = async () => {
    if (isFeatured) {
      if (message1 !== '✅ Payment Successful!') {
        setErrMsg("Please make payment");
        return;
      }
    }
    
    try {
      await axios.post(
        `https://fb-backend.vercel.app/MarketPlace/marketplace`,
        {sellerName:sellerName,
          title,
          sellerId: staticUserId,
          description,
          category: selectedOptions,
          PhoneNumber:PhoneNumber,
          condition,
          isFeatured:isFeatured,
          price,    
                imageUrl: imageUrls,

        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
props.getRefresh(true)
      setMessage('✅ Product Listed Successfully!');
      setShowModal(false);
      settitle('');
      setDescription('');
      setSelectedOptions([]);
      setCondition('');
      setPrice('');
      fetchGroups();
    } catch (err) {
      console.error(err);
      setMessage(`❌ Failed to create group: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axios.post(
        `https://fb-backend.vercel.app/PagesRoute/Pages/join/${groupId}`,
        { userId: staticUserId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`✅ Joined group successfully!`);
      fetchGroups(); // Refresh after joining
    } catch (error) {
      console.error("Error joining group:", error);
      setMessage(`❌ Could not join group: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10" style={{ marginTop: '3rem' }}>
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        + Create Listing
      </button>

      {message && (
        <div className="mt-4 text-center text-lg font-semibold text-gray-700">
          {message}
        </div>
      )}

  
      {/* Modal */}
      {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-scroll mt-24">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg  "style={{marginTop:'19%'}}>
              <h2 className="text-xl font-semibold mb-4">New Listing</h2>
      
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Listing Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => settitle(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                  placeholder="Enter Page name"
                />
              </div>
      
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                  placeholder="Enter description"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={PhoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                  placeholder="Enter Page name"
                />
              </div>
              <div className="mb-4">
  <label className="block font-medium text-gray-700">Feature Listing</label>
  <div className="flex gap-4 mt-2">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={isFeatured === true}
        onChange={() => {
          setIsFeatured(true);
          console.log("Featured: true");
        }}
      />
      <span>Featured</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={isFeatured === false}
        onChange={() => {
          setIsFeatured(false);
          console.log("Featured: false");
        }}
      />
      <span>Not Featured</span>
    </label>
  </div>
  {/* Conditionally show text if featured is true */}
  {isFeatured === true && <p className="mt-2 text-green-600">
   {/* <div className="min-h-screen flex items-center justify-center bg-gray-100"> */}
      <StripeWrapper>
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Pay with Card</h1>
          <PaymentButton amount={5000} getMessage={setMessage1}     /> {/* 5000 = $50 */}
        </div>
      </StripeWrapper>
    {/* </div> */}
    </p>}
</div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700">Categories</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto mt-2 border rounded p-2">
                  {categoryOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
      
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Old">Old</option>
                </select>
              </div>
      
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                  placeholder="Enter price"
                />
              </div>
              <div className="mb-4">
  <label className="block font-medium text-gray-700">Upload Images</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      setImages(files);
      setUploading(true);

      const uploadedUrls = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'gptimages');
        formData.append('cloud_name', 'dgmjg9zr4');

        try {
          const res = await axios.post(
            'https://api.cloudinary.com/v1_1/dgmjg9zr4/image/upload',
            formData
          );
          uploadedUrls.push(res.data.secure_url);
        } catch (err) {
          console.error('Image upload failed:', err);
        }
      }

      setImageUrls(uploadedUrls);
      setUploading(false);
    }}
    className="w-full border px-3 py-2 rounded mt-1"
  />

  {uploading && <p className="text-sm text-blue-600 mt-2">Uploading images...</p>}

  {imageUrls.length > 0 && (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Preview ${index}`}
          className="w-full h-32 object-cover rounded border"
        />
      ))}
    </div>
  )}
</div>


<span style={{color:'red'}}>{ErrMsg}</span>

              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleCreateListing}
                disabled={uploading}
                >
                  {uploading ? 'Uploading...' : '+ Add'}
                </button>
              </div>
            </div>
          </div>
       
      )}
    </div>
  );
};

export default CreateGroupPage;
