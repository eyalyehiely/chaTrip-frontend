import axios from '../config/axiosConfig';  // Import the configured Axios instance

export default async function getUserDetails(token, setUser, user_id) {
  try {
    const response = await axios.get(`/auth/user/${user_id}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setUser(response.data);
    } else {
      console.log('Error:', response.data.message);
    }
  } catch (error) {
    console.error('There was an error in fetching current user data!', error);
  }
}