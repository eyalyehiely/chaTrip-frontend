"use client";

import { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import checkToken from '../utils/config/checkToken';
import getUserDetails from '../utils/api/getUserDetails'
import jwt from "jsonwebtoken"; 
import deleteUser from '../utils/api/deleteUser';


export default function SettingsPage() {
  checkToken()
  const [username, setUsername] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState({}); // Initial state as null for better handling

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      
      // Decode token using jsonwebtoken
      const decodedToken = jwt.decode(storedToken); // Decode without verification
      const user_id = decodedToken?.user_id;

      // Fetch user details using decoded user_id
      if (user_id) {
        getUserDetails(storedToken, setUser, user_id);
      }
    }
  }, []);


  // Handle form submission (this could be an API call)
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Here you would make an API call to send the contact message
      console.log('Message sent:', contactMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const storedToken = localStorage.getItem('authToken');
      if (token){
      const decodedToken = jwt.decode(storedToken); // Decode without verification
      const user_id = decodedToken?.user_id;
      deleteUser(token, setUser, user_id)
      console.log('User deleted');
    }
      } catch (error) {
        console.error('Error deleting user:', error);
        } finally {
          setLoading(false);
        }
  }

  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username Section */}
        <div className="bg-background p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Username</h2>
          <Input
            type="text"
            value={user.username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full"
          />
          <Button className="mt-4">Update Username</Button>
        </div>

        {/* Payment Settings Section */}
        <div className="bg-background p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Payment Settings</h2>
          <Input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Enter payment method (e.g., Credit Card)"
            className="w-full"
          />
          <Button className="mt-4">Update Payment Method</Button>
        </div>

        {/* Contact Us Section */}
        <div className="bg-background p-6 rounded-lg shadow-lg md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <form onSubmit={handleContactSubmit}>
            <Textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Write your message here"
              className="w-full"
              rows={4}
            />
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
      <Button
        type="submit"
        className="mt-6 flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
        onClick={handleUserDelete}
        disabled={loading} // Disable when loading
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Deleting...</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.137 21H7.863a2 2 0 01-1.996-1.858L5 7m5-3h4a2 2 0 012 2v1H8V6a2 2 0 012-2z" />
            </svg>
            <span>Delete User</span>
          </>
        )}
      </Button>
    </div>
  );
}