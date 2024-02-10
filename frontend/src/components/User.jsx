import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from'../img.jpg'

const UserDisplay = ({ user }) => (
  <div>
    <div className="flex justify-center mb-6">
      <img src={img} alt="User" className="w-40 h-40 rounded-full border border-gray-600" />
    </div>
    {user.name ? (
      <div className='flex flex-col items-center'>
        <p className='text-black text-4xl font-normal'> {user.name}</p>
        <p className='text-neutral-800 font-normal text-xl'> {user.city}</p>
        <br></br>
        <p className='text-3xl'>University Name</p>
        <p>{user.university}</p>
        <br/>
        <p className='text-3xl'>Contact Details</p>
        <p>{user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <hr></hr>
      </div>
    ) : (
      <p>Login First</p>
    )}
  </div>
);

const UserEdit = ({ formData, handleChange, handleSubmit }) => (
  <form className = "px-80"  onSubmit={handleSubmit}>
    <div className="mb-4">
      <input
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        required
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Name"
        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-black"
      />
    </div>
    <div className="mb-4">
      <input
        id="city"
        name="city"
        type="text"
        autoComplete="city"
        required
        value={formData.city || ''}
        onChange={handleChange}
        placeholder="City"
        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-black"
      />
    </div>
    <div className="mb-4">
      <input
        id="university"
        name="university"
        type="text"
        autoComplete="university"
        required
        value={formData.university || ''}
        onChange={handleChange}
        placeholder="University"
        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-black"
      />
    </div>
    <div className="mb-4">
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={formData.email || ''}
        onChange={handleChange}
        placeholder="Email"
        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-black"
      />
    </div>
    <div className="mb-4">
      <input
        id="phone"
        name="phone"
        type="text"
        autoComplete="phone"
        required
        value={formData.phone || ''}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-black"
      />
    </div>
    <div className="flex items-center justify-center mb-6">
      <button type="submit" className="bg-purple-600 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Save Changes
      </button>
    </div>
  </form>
);
const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://backend-7gx2.onrender.com/api/user/`);
        setUser(response.data);
        setFormData({ ...response.data });
        setError('');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('User not found');
        } else {
          setError('Error fetching user data');
        }
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://backend-7gx2.onrender.com/api/user/`, formData);
      setUser(response.data);
      setFormData({ ...response.data });
      setEditing(false);
      
      // Fetch updated user data
      const updatedResponse = await axios.get(`https://backend-7gx2.onrender.com/api/user/`);
      setUser(updatedResponse.data);
      setFormData({ ...updatedResponse.data });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error updating user data');
      }
    }
  };
  

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-900 to-fuchsia-950">
      <div className="max-w-4xl w-full absolute bg-white bg-opacity-40 rounded-[90px] shadow py-10 m-40">
        <h2 className="text-3xl font-bold mb-6 text-center  font-serif">User Details</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {editing ? (
          <UserEdit formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
        ) : (
          <UserDisplay user={user} />
        )}
<div className="flex items-center justify-center mb-6">
          {!editing && (
            <>
              
              <button onClick={handleEdit} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 mt-3 ">Edit</button>

              {localStorage.getItem('token') ? (
              
                <button onClick={handleSignOut} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 mt-3 ml-7">Sign Out</button>

                
              ) : (
                <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline">
                  Login First
                </Link>
              )}
            </>
          )}
        </div>
        <div className="text-center text-sm">
          <Link to="/" className="text-lime-50 hover:text-yellow-950">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};


export default User;
