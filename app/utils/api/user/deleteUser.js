import axios from '../config/axiosConfig';
import Swal from 'sweetalert2';

export default async function deleteUser(token, setUser, user_id) {
  try {
    // Show confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover your details!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if user confirms
        const response = await axios.delete(`/auth/user/${user_id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // Show success message
          Swal.fire({
            title: "Deleted!",
            text: "Your user data has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            // Handle successful deletion (e.g., redirect or update UI)
            setUser(null); // Set user to null after deletion
            localStorage.removeItem('authToken'); // Remove token from localStorage
            window.location.href = '/login'; // Redirect to login
          });
        } else {
          // Handle non-200 status responses
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the user.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error('Error:', response.data.message);
        }
      } else {
        // User canceled the deletion
        Swal.fire("Your user data is safe!", "", "info");
      }
    });
  } catch (error) {
    // Handle any errors that occurred during the deletion process
    console.error('There was an error deleting the user!', error);
    Swal.fire({
      title: "Error!",
      text: "An unexpected error occurred while deleting the user.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}