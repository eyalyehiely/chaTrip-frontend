import axios from '../config/axiosConfig';
import swal from 'sweetalert2';

// Function to send conversation via email
export default function sendEmailConversation(conversationId, token) {
  // Check if token is provided
  if (!token) {
    console.error("No auth token provided");
    swal.fire({
      title: 'Error',
      text: 'You are not authorized. Please log in.',
      icon: 'error',
      button: 'OK',
    });
    return;
  }

  // Make the API call to send the conversation via email
  axios.post(`/auth/send-conversation/${conversationId}/`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include token in the request headers
    },
  })
  .then(response => {
    if (response.status === 200) {
      // Show success message
      swal.fire({
        title: 'Message sent successfully!',
        icon: 'success',
        timer: 1000,
      });
    } else {
      // Handle unexpected responses
      const errorMessage = response.data?.error || 'An unexpected error occurred';
      swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        button: 'OK',
      });
    }
  })
  .catch(error => {
    // Handle errors from the API
    const errorMessage = error.response?.data?.error || 'Failed to send the conversation. Please try again later.';
    console.error('There was an error sending the email:', errorMessage);
    swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      button: 'OK',
    });
  });
}