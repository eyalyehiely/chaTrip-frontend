"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from '../utils/config/axiosConfig';
import ChatSidebar from '@/components/ChatSideBar';

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());  // Track last interaction
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset inactivity timer on new messages
  const resetInactivityTimer = () => {
    setLastInteractionTime(Date.now());
  };

  // Send message to backend and get AI response
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    resetInactivityTimer();  // Reset inactivity timer on sending a message

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/auth/chat/', 
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMessage = { role: 'assistant', content: response.data.ai_message };
      setMessages((prev) => [...prev, botMessage]);
      resetInactivityTimer();  // Reset inactivity timer on receiving a message

    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Error connecting to the AI. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save conversation after 10 minutes of inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const fiveMinutes = 5 * 60 * 1000;
      if (Date.now() - lastInteractionTime >= fiveMinutes) {
        saveConversation();  // Automatically save the conversation after 10 minutes
      }
    };

    const interval = setInterval(checkInactivity, 60000);  // Check every minute
    return () => clearInterval(interval);  // Clear interval on component unmount
  }, [lastInteractionTime]);

  // Function to save the conversation
  const saveConversation = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/auth/end-conversation/', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Conversation saved due to inactivity.");
    } catch (error) {
      console.error("Error saving the conversation:", error);
    }
  };

  // Scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main flex container to align sidebar and chat area side by side */}
      <div className="flex">
        {/* Sidebar on the left */}
        <ChatSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Chat area on the right */}
        <div className="flex-grow bg-card rounded-lg shadow-lg p-4 h-[600px] flex flex-col ml-4">
          <h1 className="text-3xl font-bold mb-6">Chat with AI ChaTrip</h1>
          
          {/* Scroll area for messages */}
          <ScrollArea className="flex-grow mb-4" ref={scrollRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {msg.content}
                </span>
              </div>
            ))}
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tourist attractions..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


