"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Utensils, Hotel, Camera } from 'lucide-react';

const categories = [
  { name: 'Attractions', icon: Camera },
  { name: 'Restaurants', icon: Utensils },
  { name: 'Accommodations', icon: Hotel },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [places, setPlaces] = useState([]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // TODO: Implement actual API call to get places based on category and user's location
    setPlaces([
      { id: 1, name: 'Example Place 1', description: 'This is a placeholder description.' },
      { id: 2, name: 'Example Place 2', description: 'This is another placeholder description.' },
    ]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Nearby</h1>
      <div className="flex space-x-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            variant={selectedCategory === category.name ? "default" : "outline"}
          >
            <category.icon className="mr-2 h-4 w-4" />
            {category.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <Card key={place.id}>
            <CardHeader>
              <CardTitle>{place.name}</CardTitle>
              <CardDescription>
                <MapPin className="inline-block mr-1 h-4 w-4" />
                1.2 miles away
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{place.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}