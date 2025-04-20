"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateGroupPage = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  console.log(groups,'groups_________3')
   
  const currentUser = JSON.parse(localStorage.getItem('user-storage'));
  const staticUserId = currentUser?.state?.user?._id;
  console.log(staticUserId, 'groups_________39');
  // const staticUserId = '6686f5dc61546b507649caf2';
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `https://fb-backend.vercel.app/MediaRoute/Media?userId=${staticUserId}`,
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

  const handleCreateGroup = async () => {
    try {
      await axios.post(
        `https://fb-backend.vercel.app/MediaRoute/Media?userId=${staticUserId}`,
        {
          pageName: groupName,
          userId: staticUserId,
          description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('✅ Group created successfully!');
      setShowModal(false);
      setGroupName('');
      setDescription('');
      fetchGroups(); // Refresh group list
    } catch (err) {
      console.error(err);
      setMessage(`❌ Failed to create group: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axios.post(
        `https://fb-backend.vercel.app/MediaRoute/Media/join/${groupId}`,
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
      <h1 className="text-3xl font-bold mb-6">Create a New Page</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        + Create Page
      </button>

      {message && (
        <div className="mt-4 text-center text-lg font-semibold text-gray-700">
          {message}
        </div>
      )}

          
{groups.length > 0 && (
  <div className="mt-10">
    <h2 className="text-2xl font-semibold mb-4">Available Pages</h2>
    <div className="flex flex-col gap-4">
      {groups.map((group) => {
        const isJoined =
          Array.isArray(group.members) &&
          group.members.includes(staticUserId);

        return (
          <div
            key={group._id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <span className="font-medium text-lg">{group.pageName}</span>

            {isJoined ? (
              <button
                className="bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed"
                disabled
              >
                ✅ Liked
              </button>
            ) : (
              <button
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                onClick={() => handleJoinGroup(group._id)}
              >
                Like
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">New Group</h2>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Page Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Page name"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleCreateGroup}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroupPage;
