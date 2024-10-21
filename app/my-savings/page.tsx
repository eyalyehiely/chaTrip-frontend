"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';  // Import icons
import checkToken from '../utils/config/checkToken';
import getUserDetails from '../utils/api/getUserDetails';
import jwt from "jsonwebtoken"; 

export default function SavingsPage() {
  checkToken();
  const [savings, setSavings] = useState([]); // State for saved items
  const [filteredSavings, setFilteredSavings] = useState([]); // Filtered savings
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch the token and decode it
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);

      // Decode token using jsonwebtoken
      const decodedToken = jwt.decode(storedToken) as any;
      const user_id = decodedToken?.user_id;

      if (storedToken && user_id) {
        getUserDetails(storedToken, (userData) => {
          console.log('User details:', userData);
          // Optionally, you can add more logic here if needed
        });
      }
    }
  }, []);

  // Fetch the saved items from an API or localStorage
  useEffect(() => {
    const fetchSavedItems = async () => {
      setLoading(true);
      try {
        // Replace this with your real API call or data fetch
        const savedItems = [
          {
            id: 1,
            name: 'Saved Place 1',
            description: 'Description for Saved Place 1',
          },
          {
            id: 2,
            name: 'Saved Place 2',
            description: 'Description for Saved Place 2',
          },
        ];
        setSavings(savedItems);
        setFilteredSavings(savedItems); // Set both savings and filtered savings initially
      } catch (error) {
        console.error('Error fetching saved items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, []);

  // Filter savings based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredSavings(
        savings.filter((item) =>
          item.name.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredSavings(savings); // Reset the filter if search query is empty
    }
  }, [searchQuery, savings]);

  // Handle delete functionality (removes saved item)
  const handleDelete = (id) => {
    const updatedSavings = savings.filter((item) => item.id !== id);
    setSavings(updatedSavings);
    setFilteredSavings(updatedSavings); // Also update the filtered savings
  };

  const handleOpenLocation = (lat, lng) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');  // Opens the location in a new tab
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Savings</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search your savings..."
          className="form-control w-1/2 p-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading your saved items...</p>
      ) : filteredSavings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSavings.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenLocation(item.location?.lat, item.location?.lng)}
                    disabled={!item.location || !item.location.lat || !item.location.lng}  // Disable if location is missing
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Location
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>You have no saved items.</p>
      )}
    </div>
  );
}