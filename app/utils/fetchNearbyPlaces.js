import axios from './axiosConfig';  // Import the configured Axios instance

// Function to fetch nearby places based on category and user location
export const fetchNearbyPlaces = async (latitude, longitude, category, token) => {
  try {
    const response = await axios.get(`/auth/nearby-places/`, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`  // Include the Bearer token in the headers
      },
      params: {
        latitude,
        longitude,
        radius: 3000,  // 3 km radius
        category,  // Send the selected category
      },
    });

    return response.data.places;  // Return the places data from the response
  } catch (error) {
    console.error('API Error:', error);
    throw error;  // Re-throw the error so it can be caught in the component
  }
};