
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mail,Menu } from 'lucide-react'; // Import icons
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from '../utils/api/config/axiosConfig';
import ChatSidebar from '@/components/ChatSideBar';
import sendEmailConversation from '../utils/api/mail/sendEmailConversation';
import swal from 'sweetalert2';


export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; message: string }[]>([]);  // Chat messages state
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null); // Track the selected conversation ID
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

    const userMessage = { role: 'user', message: input };
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

      const botMessage = { role: 'assistant', message: response.data.ai_message };
      setMessages((prev) => [...prev, botMessage]);
      resetInactivityTimer();  // Reset inactivity timer on receiving a message

    } catch (error) {
      const errorMessage = { role: 'assistant', message: 'Error connecting to the AI. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save conversation after 3 minutes of inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const threeMinutes = 1* 60 * 1000;
      if (Date.now() - lastInteractionTime >= threeMinutes) {
        saveConversation();  // Automatically save the conversation after 3 minutes
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

  // Handle sending email conversation
  const handleSendEmailConversation = () => {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
      console.log('email not sent - token error');
      return;
    }
    
    if (!selectedConversationId) {
      swal.fire({
        title: 'Email not sent',
        text: 'No conversation selected.',
        icon: 'error',
        confirmButtonText: 'OK',  // Correct SweetAlert2 option
      });
      console.log('email not sent - no conversation selected');
      return;
    }
    
    // Pass the conversation ID
    sendEmailConversation(selectedConversationId, token);
    console.log('conversation sent');
  };

  // Function to update the chat with the selected conversation
  const handleConversationSelect = (conversation: any) => {
    setMessages(conversation.messages);  // Update the messages with the selected conversation's messages
    setSelectedConversationId(conversation.id);  // Set the conversation ID
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main flex container to align sidebar and chat area side by side */}
      <div className="flex">
        {/* Sidebar on the left */}
        <ChatSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          onConversationSelect={handleConversationSelect}  // Pass the conversation select handler
        />
        
        {/* Chat area on the right */}
        <div className="flex-grow bg-card rounded-lg shadow-lg p-4 h-[600px] flex flex-col ml-4">
          <div className='flex flex-row gap-8'>
            <h1 className="text-3xl font-bold mb-6">Chat with AI ChaTrip</h1>
            <div className='flex flex-row ml-9'>
              <Button className="flex space-x-2" onClick={handleSendEmailConversation}>
                <Mail className='mr-2'/>
                Send Conversation
              </Button>
              {/* <span> {conversation.timestamp|| 'no data'}</span> */}
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Menu />
                </Button>
            </div>
            
          </div>
          
          {/* Scroll area for messages */}
          <ScrollArea className="flex-grow mb-4" ref={scrollRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {msg.message}  {/* Display the message content */}
                </span>
              </div>
            ))}
          </ScrollArea>

          {/* Input area */}
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}  // Close sidebar when clicking on overlay
        />
      )}
    </div>
  );
}