// API to end and save the conversation
import axios from '../../config/axiosConfig';  // Import the configured Axios instance

export const endConversation = async () => {
    const token = localStorage.getItem('authToken');
  
    try {
      const response = await axios.post('/auth/end-conversation/',  
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Auth token for protected routes
          },
        }
      );
  
      return response.data;  // The response contains the status of the saved conversation
  
    } catch (error) {
      console.error('Error while ending the conversation:', error);
      throw error;
    }
  };