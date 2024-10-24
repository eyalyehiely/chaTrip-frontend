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
        // Make sure you're sending the correct API request
        const response = await axios.delete(`/auth/user/${user.id}/place/${placeId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          Swal.fire("Deleted!", "Place has been deleted.", "success");
          // Update the user's saved places by filtering out the deleted place
          setUser((prevUser) => ({
            ...prevUser,
            saving_places: prevUser.saving_places.filter(place => place.id !== placeId)
          }));
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