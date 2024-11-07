"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import getUserDetails from './utils/api/user/getUserDetails';
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import { Telescope, MessageSquare } from 'lucide-react';
import FAQs from '@/components/Faqs'; // Import the FAQ component
import checkToken from "./utils/api/config/checkToken";

export default function Home() {
  checkToken();
  const [user, setUser] = useState<any>(null); // Use `any` or a custom type based on user structure
  const [token, setToken] = useState<string | null>(null); // Allow `token` to be a string or `null`

  // useEffect for setting token and decoding
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      
      // Decode token using jsonwebtoken
      const decodedToken = jwt.decode(storedToken) as { user_id?: string }; // Add type annotation for better type safety
      const user_id = decodedToken?.user_id;

      // Fetch user details using decoded user_id
      if (user_id) {
        getUserDetails(storedToken, setUser, user_id);
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        {user?.username
          ? `Welcome ${(user.username.split('@')[0].charAt(0).toUpperCase() + user.username.split('@')[0].slice(1))}`
          : 'Welcome'} to Your Tourist Guide
      </h1>

      <p className="text-xl mb-8">
        Discover new places and plan your perfect trip with our AI-powered guide.
      </p>

      <div className="space-x-4 mb-8">
        <Button asChild>
          <Link href="/chat">
            <MessageSquare className="mr-1" />
            Start Chatting
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/explore">
            <Telescope className="mr-1" />
            Explore Nearby
          </Link>
        </Button>
      </div>

      {/* Add FAQ Section */}
      <FAQs />
    </div>
  );
}