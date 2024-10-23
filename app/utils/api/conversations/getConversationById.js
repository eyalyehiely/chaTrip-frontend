import axios from '../config/axiosConfig';  // Assuming you have Axios configured

export default async function getConversationById(conversationId, token){
  try {
    const response = await axios.get(`/auth/conversations/${conversationId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};