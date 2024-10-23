import axios from '../config/axiosConfig';
import Swal from 'sweetalert2';

export async function updateUserSavings(token, place,user_id) {
  try {
    const response = await axios.put(`/auth/user/${user_id}/`,
      { place }, // Data to send (the place to save)
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          
        },
      }
    );
    Swal.fire({
      title: 'Saved!',
      text: `${place.name} has been added to your saved places.`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
    
    return response.data; 
  } catch (error) {
    console.error('Error updating user savings:', error);
    // Error alert
    Swal.fire({
      title: 'Error!',
      text: 'There was a problem saving this place.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
    throw error;
  }
}