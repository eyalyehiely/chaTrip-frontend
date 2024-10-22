import axios from '../config/axiosConfig';  // Assuming you have axiosConfig set up for your base URL and headers


const updateUserDetails = async (token, username) => {
  try {
    const response = await axios.put('/auth/user/', username, {
      headers: {
        Authorization: `Bearer ${token}`,  
        'Content-Type': 'application/json',
      },
    });

    return response.data;  // Return response if needed

  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

export default updateUserDetails;