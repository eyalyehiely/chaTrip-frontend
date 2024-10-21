"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { MoonIcon, SunIcon, Settings, Bookmark, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import getUserDetails from '../app/utils/api/getUserDetails';
import jwt from "jsonwebtoken"; 

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [user, setUser] = useState<{ username?: string }>({}); // Handle undefined or empty user
  const [isTokenValid, setIsTokenValid] = useState(true);

  // useEffect for setting token and decoding
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        setToken(storedToken);

        // Decode token using jsonwebtoken
        const decodedToken = jwt.decode(storedToken) as { user_id?: string }; // Decode without verification
        const user_id = decodedToken?.user_id;

        // Fetch user details using decoded user_id
        if (user_id) {
          getUserDetails(storedToken, (userData) => {
            setUser(userData);
          }, user_id);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsTokenValid(false);
        handleLogout(); // Logout if token is invalid
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setDropdownOpen(false);
    window.location.href = '/login'; // Redirect to login page
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".relative")) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">ChaTrip</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/chat">Chat</Link></li>
            <li><Link href="/explore">Explore</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>

          {/* Conditionally render either Login button or Dropdown based on token */}
          {token && isTokenValid ? (
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.username?.split('@')[0] || 'User'}
              </Button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2">
                  <ul>
                    <li>
                      <Link href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link href="/my-savings" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Bookmark className="mr-2 h-4 w-4" />
                        My Savings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}