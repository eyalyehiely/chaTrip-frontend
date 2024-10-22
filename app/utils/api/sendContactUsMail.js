import axios from '../config/axiosConfig';
import swal from 'sweetalert2';

export default function sendContactUsMail(contactMessage, contactSubject, token) {
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

  axios.post('/auth/contact-us/', {
    contactMessage,  // Wrap the message and subject in an object
    contactSubject,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      if (response.status === 200) {
        swal.fire({
          title: 'Message sent successfully!',
          icon: 'success',
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      } else {
        const errorMessage = response.data.error || 'An unexpected error occurred';
        swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          button: 'OK',
        });
      }
    })
    .catch(error => {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
      console.error('There was an error sending the email:', errorMessage);
      swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        button: 'OK',
      });
    });
}