
"use client";
import { useEffect, useState } from 'react';
import fetchUserConversations from '../app/utils/api/conversations/fetchUserConversations';
import getConversationById from '../app/utils/api/conversations/getConversationById'
import { UUID } from 'crypto';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onConversationSelect: (conversation: any) => void;  // Callback to pass selected conversation
}

export default function ChatSidebar({ sidebarOpen, setSidebarOpen, onConversationSelect }: SidebarProps) {
  const [conversations, setConversations] = useState([]);  // Initialize as an array
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      // Fetch conversations when the component mounts
      fetchUserConversations(token, setConversations);
    }
  }, [token]);

  const handleConversationClick = async (conversationId: UUID) => {
    if (token) {
      try {
        const conversation = await getConversationById(conversationId, token);
        onConversationSelect(conversation);  // Pass the conversation data to the parent component
        setSidebarOpen(false);  // Optionally close the sidebar on selection
      } catch (error) {
        console.error('Error loading conversation:', error);
      }
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:flex`}
      >
        <nav className="mt-8 p-4">
          <h2 className="text-xl font-bold mb-4">Conversations</h2>
          <ul className="space-y-4">
            {conversations.length > 0 ? (
              conversations.map((conversation: any, index: number) => (
                <li
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                  onClick={() => handleConversationClick(conversation.id)}  // Load full conversation
                >
                  {conversation.title}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No conversations found</li>
            )}
          </ul>
        </nav>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}