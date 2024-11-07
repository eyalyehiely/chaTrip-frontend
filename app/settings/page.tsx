"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import checkToken from '../utils/api/config/checkToken';
import getUserDetails from '../utils/api/user/getUserDetails';
import jwt, { JwtPayload } from "jsonwebtoken"; 
import deleteUser from '../utils/api/user/deleteUser';
import sendContactUsMail from '../utils/api/mail/sendContactUsMail';

interface DecodedToken extends JwtPayload {
  user_id?: string;
}

export default function SettingsPage() {
  checkToken();
  const [username, setUsername] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ username?: string }>({});

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      
      // Decode token using jsonwebtoken and cast as DecodedToken
      const decodedToken = jwt.decode(storedToken) as DecodedToken; // Decode without verification
      const user_id = decodedToken?.user_id;

      // Fetch user details using decoded user_id
      if (user_id) {
        getUserDetails(storedToken, setUser, user_id);
      }
    }
  }, []);

  // Handle form submission (e.g., sending a contact message)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactUsMail(contactMessage, contactSubject, token);
      console.log('Message sent:', contactMessage, 'subject', contactSubject);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async () => {
    setLoading(true);
    try {
      if (token) {
        const decodedToken = jwt.decode(token) as DecodedToken; // Decode without verification
        const user_id = decodedToken?.user_id;

        if (user_id) {
          await deleteUser(token, setUser, user_id);
          console.log('User deleted');
        } else {
          console.error('User ID not found in token.');
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Settings</h1>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Username Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Username</h2>
          <Input
            type="text"
            value={user.username || ''}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
            placeholder="Update your username"
          />
          <Button className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-150">
            Update Username
          </Button>
        </div>
  
        {/* Payment Settings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Payment Settings</h2>
          <Input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Enter payment method (e.g., Credit Card)"
            className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
          />
          <Button className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-150">
            Update Payment Method
          </Button>
        </div>
  
        {/* Contact Us Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contact Us</h2>
          <form onSubmit={handleContactSubmit}>
            <Input
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              placeholder="Subject"
              className="w-full border-gray-300 mb-4 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
            />
            <Textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Message"
              className="w-full border-gray-300 mb-4 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              rows={4}
            />
            <Button type="submit" className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-150" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
  
      {/* Remove Account Button */}
      <Button
        type="button"
        className="mt-8 w-full md:w-auto bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-150 ease-in-out flex items-center justify-center space-x-2"
        onClick={handleUserDelete}
        disabled={loading}
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
            <span>Remove Account</span>
          </>
        )}
      </Button>
    </div>
  );
}