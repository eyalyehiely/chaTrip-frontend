import axios from '../config/axiosConfig';  // Import the configured Axios instance

export default async function fetchUserConversations(token, setConversations) {
  try {
    const response = await axios.get(`/auth/conversations/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setConversations(response.data.conversations);
    } else {
      console.log('Error:', response.data.message);
    }
  } catch (error) {
    console.error('There was an error in fetching current user data!', error);
  }
}