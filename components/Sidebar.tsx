"use client";

import Link from 'next/link';
import { Settings, Bookmark, LogOut, Telescope, MessageSquare,DollarSign } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Sidebar container - hidden by default, shown when sidebarOpen is true */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`} 
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">ChaTrip</Link>
        </div>
        <nav className="mt-8 p-4">
          <ul className="space-y-4">
            <li>
              <Link href="/explore" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                <Telescope className="mr-2 h-4 w-4" />
                Explore
              </Link>
            </li>
            <li>
              <Link href="/chat" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                <DollarSign className="mr-2 h-4 w-4" />
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </li>
            <li>
              <Link href="/my-savings" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                <Bookmark className="mr-2 h-4 w-4" />
                My Savings
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  console.log("Logging out...");
                  setSidebarOpen(false);  // Close sidebar on logout
                }}
                className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay when sidebar is open (only visible on mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}  // Close sidebar when clicking on overlay
        />
      )}
    </>
  );
}