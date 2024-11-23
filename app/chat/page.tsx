
// "use client";

// import { useState, useRef, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Send, Menu, Smile, Save } from 'lucide-react'; // Import icons
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import axios from '../utils/api/config/axiosConfig';
// import ChatSidebar from '@/components/ChatSideBar';
// import sendEmailConversation from '../utils/api/mail/sendEmailConversation';
// import swal from 'sweetalert2';
// import EmojiPicker from 'emoji-picker-react'; // Import the emoji picker

// export default function ChatPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [messages, setMessages] = useState<{ role: string; message: string }[]>([]);  // Chat messages state
//   const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null); // Track the selected conversation ID
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());  // Track last interaction
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Toggle emoji picker visibility
//   const emojiPickerRef = useRef<HTMLDivElement>(null);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);


//   // Close emoji picker when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
//         setShowEmojiPicker(false);  // Close the emoji picker if clicked outside
//       }
//     };
  
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Reset inactivity timer on new messages
//   const resetInactivityTimer = () => {
//     setLastInteractionTime(Date.now());
//   };

//   // Send message to backend and get AI response
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: 'user', message: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);
//     resetInactivityTimer();

//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await axios.post('/auth/chat/', 
//         { message: input },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const botMessage = { role: 'assistant', message: response.data.ai_message };
//       setMessages((prev) => [...prev, botMessage]);
//       resetInactivityTimer();

//     } catch (error) {
//       const errorMessage = { role: 'assistant', message: 'Error connecting to the AI. Please try again later.' };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-save conversation after 3 minutes of inactivity
//   const handleSaveConversation =() => {
//     // const checkInactivity = () => {
//     //   const threeMinutes = 1 * 60 * 1000;
//     //   if (Date.now() - lastInteractionTime >= threeMinutes) {
//         saveConversation();
//       }
//     // };

//   //   const interval = setInterval(checkInactivity, 60000);
//   //   return () => clearInterval(interval);
//   // }, [lastInteractionTime]);

//   // Function to save the conversation
//   const saveConversation = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.post('/auth/end-conversation/', {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("Conversation saved due to inactivity.");
//     } catch (error) {
//       console.error("Error saving the conversation:", error);
//     }
//   };

//   // Scroll to the bottom of the chat whenever messages change
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Handle sending email conversation
//   const handleSendEmailConversation = () => {
//     handleSaveConversation()
//     const token = localStorage.getItem('authToken'); 
//     if (!token) {
//       console.log('email not sent - token error');
//       return;
//     }
    
//     if (!selectedConversationId) {
//       swal.fire({
//         title: 'Email not sent',
//         text: 'No conversation selected.',
//         icon: 'error',
//         confirmButtonText: 'OK',
//       });
//       console.log('email not sent - no conversation selected');
//       return;
//     }
    
//     sendEmailConversation(selectedConversationId, token);
//     console.log('conversation sent');
//   };

//   // Function to update the chat with the selected conversation
//   const handleConversationSelect = (conversation: any) => {
//     setMessages(conversation.messages);
//     setSelectedConversationId(conversation.id);
//   };

//   const handleSaveConversationSelect = (conversation: any) => {
//     setMessages(conversation.messages);
//     setSelectedConversationId(conversation.id);
//   };

//   // Function to handle emoji selection
//   const handleEmojiClick = (emoji: any) => {
//     if (emoji) {
//       setInput((prevInput) => prevInput + emoji.emoji);  // Append selected emoji to input
//       inputRef.current?.focus(); // Refocus on the input field after emoji selection
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Main flex container to align sidebar and chat area side by side */}
//       <div className="flex">
//         {/* Sidebar on the left */}
//         <ChatSidebar 
//           sidebarOpen={sidebarOpen} 
//           setSidebarOpen={setSidebarOpen} 
//           onConversationSelect={handleConversationSelect}
//         />
        
//         {/* Chat area on the right */}
//         <div className="flex-grow bg-card rounded-lg shadow-lg p-4 h-[600px] flex flex-col ml-4">
//           <div className='flex flex-row justify-between items-center mb-6'>
//             <h1 className="text-3xl font-bold">Chat with AI ChaTrip</h1>
//             <div className='flex space-x-2'>
//               <Button className="flex space-x-2" onClick={handleSendEmailConversation}>
//                 <Send />
//               </Button>
//               <Button className="flex space-x-2" onClick={handleSaveConversation}>
//                 <Save />
//               </Button>
//               <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
//                 <Menu />
//               </Button>
//             </div>
//           </div>
          
//           {/* Scroll area for messages */}
//           <ScrollArea className="flex-grow mb-4" ref={scrollRef}>
//             {messages.map((msg, index) => (
//               <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
//                 <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
//                   {msg.message}
//                 </span>
//               </div>
//             ))}
//           </ScrollArea>

//           {/* Input area */}
//           <div className="flex space-x-2 relative">
//             <Button variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
//               <Smile />
//             </Button>

//             {/* Emoji Picker */}
//             {showEmojiPicker && (
//               <div ref={emojiPickerRef} className="absolute bottom-16 z-50">
//                 <EmojiPicker onEmojiClick={handleEmojiClick} />
//               </div>
//             )}

//             <Input
//               ref={inputRef} // Reference the input field
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask about tourist attractions..."
//               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//               disabled={loading}
//             />
//             <Button onClick={handleSend} disabled={loading}>
//               {loading ? 'Sending...' : 'Send'}
//             </Button>
//           </div>
//         </div>
//       </div>
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setSidebarOpen(false)}  // Close sidebar when clicking on overlay
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Menu, Smile, Save, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "../utils/api/config/axiosConfig";
import ChatSidebar from "@/components/ChatSideBar";
import sendEmailConversation from "../utils/api/mail/sendEmailConversation";
import swal from "sweetalert2";
import EmojiPicker from "emoji-picker-react";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; message: string }[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    setLastInteractionTime(Date.now());
  };

  // Send a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    resetInactivityTimer();

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "/auth/chat/",
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = { role: "assistant", message: response.data.ai_message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        message: "Error connecting to the AI. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Save conversation
  const saveConversation = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "/auth/end-conversation/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      swal.fire("Saved", "Conversation saved successfully.", "success");
    } catch (error) {
      swal.fire("Error", "Failed to save conversation.", "error");
    }
  };

  // Send conversation via email
  const handleSendEmailConversation = async () => {
    if (!selectedConversationId) {
      swal.fire({
        title: "Email not sent",
        text: "No conversation selected.",
        icon: "error",
      });
      return;
    }

    const token = localStorage.getItem("authToken");
    sendEmailConversation(selectedConversationId, token);
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji: any) => {
    if (emoji) {
      setInput((prev) => prev + emoji.emoji);
      inputRef.current?.focus();
    }
  };

  // Handle new conversation
  const handleNewConversation = () => {
    setMessages([]);
    setSelectedConversationId(null);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex">
        <ChatSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onConversationSelect={(conversation) => {
            setMessages(conversation.messages);
            setSelectedConversationId(conversation.id);
          }}
        />

        <div className="flex-grow bg-card rounded-lg shadow-lg p-4 h-[600px] flex flex-col ml-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Chat with AI ChaTrip</h1>
            <div className="flex space-x-2">
              <Button onClick={handleSendEmailConversation}>
                <Send /> Email
              </Button>
              <Button onClick={saveConversation}>
                <Save /> Save
              </Button>
              <Button onClick={handleNewConversation}>
                <RefreshCw /> New
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-grow mb-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">Start a new conversation...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.message}
                  </span>
                </div>
              ))
            )}
          </ScrollArea>

          <div className="flex space-x-2 relative">
            <Button variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <Smile />
            </Button>
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-16 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tourist attractions..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}