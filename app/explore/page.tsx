


"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Utensils, Hotel, Camera, Star, Bookmark, ExternalLink } from 'lucide-react'; // Import icons
import checkToken from '../utils/config/checkToken';
import { fetchNearbyPlaces } from '../utils/api/fetchNearbyPlaces';  // Import the Axios function

const categories = [
  { name: 'Attractions', icon: Camera },
  { name: 'Restaurants', icon: Utensils },
  { name: 'Accommodations', icon: Hotel },
];

export default function ExplorePage() {
  checkToken();
  // Initialize state variables
  const [selectedCategory, setSelectedCategory] = useState('');
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);  // Store user's location
  const [loading, setLoading] = useState(false);  // Handle loading state
  const [error, setError] = useState(null);  // Handle errors
  const [token, setToken] = useState<string | null>(null);  // Store the token from localStorage

  // Retrieve token from localStorage when component loads
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError('Authentication token not found. Please log in.');
    }
  }, []);

  // Function to get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          console.log(`User location obtained: Latitude ${latitude}, Longitude ${longitude}`);
        },
        (error) => {
          setError('Error getting location. Please enable location services.');
          console.error('Error getting user location:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // Fetch user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Handle category button click
  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);

    if (!userLocation) {
      setError('Unable to get user location.');
      return;
    }

    try {
      setLoading(true);
      setError(null);  // Reset any previous errors

      // Use the helper function to fetch places
      const placesData = await fetchNearbyPlaces(userLocation.latitude, userLocation.longitude, category, token);

      // Log the response for debugging
      console.log('Places fetched from API:', placesData);

      // Update state with the returned places
      setPlaces(placesData);
    } catch (err) {
      setError('Failed to fetch nearby places.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle saving a place (just a placeholder here)
  const handleSavePlace = (place) => {
    console.log(`Saved place: ${place.name}`);
    // Add functionality to save the place (e.g., API call to save the place)
  };

  // Function to open a place's location in Google Maps
  const handleOpenLocation = (lat, lng) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');  // Opens the location in a new tab
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Nearby</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex space-x-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            variant={selectedCategory === category.name ? "default" : "outline"}
            disabled={!userLocation || loading}  // Disable button if location is not available or while loading
          >
            <category.icon className="mr-2 h-4 w-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {loading && <p>Loading places...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.length > 0 ? (
          places.map((place, index) => (
            <Card key={place.id || index}>
              <CardHeader>
                <CardTitle>{place.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="inline-block mr-1 h-4 w-4" />
                  {place.distance ? `${place.distance} km away` : 'Nearby'}
                </CardDescription>
                <CardDescription className="flex items-center">
                  <Star className="inline-block mr-1 h-4 w-4" />
                  {place.rating || 'No rating available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{place.description || 'No description available'}</p>
                <div className="mt-4 flex space-x-4">
                  <Button variant="outline" onClick={() => handleSavePlace(place)}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  {/* Ensure location data exists before rendering the open location button */}
                  <Button
                    variant="outline"
                    onClick={() => handleOpenLocation(place.location?.lat, place.location?.lng)}
                    disabled={!place.location || !place.location.lat || !place.location.lng}  // Disable if location is missing
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          !loading && <p>No places found.</p>
        )}
      </div>
    </div>
  );
}