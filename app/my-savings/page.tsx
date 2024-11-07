"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Star, ExternalLink, Trash2 } from 'lucide-react'; // Import icons
import checkToken from '../utils/api/config/checkToken';
import getUserDetails from '../utils/api/user/getUserDetails';
import jwt from "jsonwebtoken";
import deleteSavingPlace from '../utils/api/places/deleteSavingPlace';

interface Place {
  id: string;
  name: string;
  distance?: string;
  rating?: number;
  opening_hours?: boolean | null;
  location?: {
    lat: number;
    lng: number;
  };
}

interface User {
  saving_places: Place[];
}

export default function SavingsPage() {
  checkToken();
  const [savings, setSavings] = useState<Place[]>([]); // State for saved items
  const [filteredSavings, setFilteredSavings] = useState<Place[]>([]); // Filtered savings
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User>({ saving_places: [] });

  // Fetch the token and decode it
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);

      // Decode token using jsonwebtoken
      const decodedToken = jwt.decode(storedToken) as any;
      const user_id = decodedToken?.user_id;

      if (storedToken && user_id) {
        getUserDetails(storedToken, setUser, user_id).then(() => {
          setLoading(false);  // Set loading to false once data is fetched
        });
      }
    }
  }, []);

  useEffect(() => {
    if (user.saving_places && user.saving_places.length > 0) {
      setSavings(user.saving_places); // Set savings based on user's saving_places
      setFilteredSavings(user.saving_places); // Initialize filtered savings
    }
  }, [user]);

  // Filter savings based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredSavings(
        savings.filter((item) =>
          item.name?.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredSavings(savings); // Reset the filter if search query is empty
    }
  }, [searchQuery, savings]);

  // Handle delete functionality (removes saved item)
  const handleDelete = async (placeId: string) => {
    console.log("Deleting place with id:", placeId); // Debug log
    if (token && placeId) {
      // Call the deleteSavingPlace function, passing the token, user, and placeId
      await deleteSavingPlace(token, user, setUser, placeId);
    } else {
      console.error("No token found or invalid place ID. User might not be authenticated.");
    }
  };

  // Handle opening location in Google Maps
  const handleGoogleOpenLocation = (lat: number, lng: number) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank'); // Opens the location in a new tab
  };

  // Handle opening location in Apple Maps
  const handleAppleOpenLocation = (lat: number, lng: number) => {
    const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}`;
    window.open(appleMapsUrl, '_blank'); // Opens the location in a new tab
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Savings ({filteredSavings.length})</h1>

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
          {filteredSavings.map((place, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{place.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="inline-block mr-1 h-4 w-4" />
                  {place.distance ? `${place.distance} km away` : 'Nearby'}
                </CardDescription>
                <CardDescription className="flex items-center">
                  <Star className="inline-block mr-1 h-4 w-4" />
                  {place.rating || 'No rating available'}
                  <span
                    className={`inline-block ml-2 px-2 py-1 rounded-lg font-bold 
                      ${place.opening_hours ? 'bg-green-500 text-white' : 
                      place.opening_hours === false ? 'bg-red-500 text-white' : 
                      'bg-gray-500 text-white'}`}>
                    {place.opening_hours ? 'OPEN' : 
                    place.opening_hours === false ? 'CLOSE' : 
                    'No hours available'}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => handleGoogleOpenLocation(place.location?.lat!, place.location?.lng!)}
                    disabled={!place.location || place.location.lat === undefined || place.location.lng === undefined} // Disable if location is missing
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Location
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(place.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>You have no saved places.</p>
      )}
    </div>
  );
}