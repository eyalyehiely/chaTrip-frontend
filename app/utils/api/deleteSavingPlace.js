import axios from '../config/axiosConfig';
import Swal from 'sweetalert2';

export default async function deleteSavingPlace(token, user, setUser, placeId) {
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this place!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.put(`/auth/user/${user.id}/place/${placeId}/`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          Swal.fire("Deleted!", "Place has been deleted.", "success");
          setUser(response.data); // Update user state with the new list
        } else {
          Swal.fire("Error", "Failed to delete the place.", "error");
        }
      }
    });
  } catch (error) {
    console.error('Error deleting place:', error);
    Swal.fire("Error", "An error occurred while deleting the place.", "error");
  }
}