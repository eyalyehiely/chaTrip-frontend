"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import getUserDetails from './utils/api/getUserDetails';
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import { Telescope, MessageSquare } from 'lucide-react';
import FAQs from '@/components/Faqs'; // Import the FAQ component

export default function Home() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // useEffect for setting token and decoding
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      
      // Decode token using jsonwebtoken
      const decodedToken = jwt.decode(storedToken);
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
        {user?.username ? `Welcome ${user.username.split('@')[0]}` : 'Welcome'} to Your Tourist Guide
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