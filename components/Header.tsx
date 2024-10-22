"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { MoonIcon, SunIcon, Settings, Bookmark, LogOut, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import getUserDetails from '../app/utils/api/getUserDetails';
import jwt from "jsonwebtoken";
import Sidebar from './Sidebar';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);  // Sidebar default is closed
  const [user, setUser] = useState<{ username?: string }>({});
  const [isTokenValid, setIsTokenValid] = useState(true);

  // Fetch token and user details
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        setToken(storedToken);
        const decodedToken = jwt.decode(storedToken) as { user_id?: string };
        const user_id = decodedToken?.user_id;

        if (user_id) {
          getUserDetails(storedToken, (userData) => {
            setUser(userData);
          }, user_id);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsTokenValid(false);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setDropdownOpen(false);
    window.location.href = '/login';
  };

  return (
    <div className='flex'>
      {/* Sidebar component - pass the sidebarOpen state */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <header className="bg-background border-b flex-1">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">ChaTrip</Link>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>

            {token && isTokenValid ? (
              <div className="relative hidden md:block">
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
              <div className="hidden md:block">
                <Link href="/pricing" className="text-lg mr-2 font-medium hover:underline">
                  Pricing
                </Link>
              
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              </div>
            )}

            {/* Hamburger button to toggle the sidebar */}
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu />
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}