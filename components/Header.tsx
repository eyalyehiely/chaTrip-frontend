"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const { theme, setTheme } = useTheme();

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
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}