import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your Tourist Guide</h1>
      <p className="text-xl mb-8">Discover new places and plan your perfect trip with our AI-powered guide.</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/chat">Start Chatting</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/explore">Explore Nearby</Link>
        </Button>
      </div>
    </div>
  );
}