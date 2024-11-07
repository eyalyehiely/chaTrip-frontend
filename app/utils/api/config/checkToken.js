import Swal from "sweetalert2";

export default function checkToken() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');

    if (!token) {
      // Remove the auth token from localStorage if it exists
      localStorage.removeItem('authToken');

      // Show an alert using SweetAlert2 and redirect only after the alert is acknowledged
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Authentication token not found. Please log in.",
        footer: '<a href="#">Why do I have this issue?</a>'
      }).then(() => {
        // Redirect to /login after the alert is shown and acknowledged
        window.location.href = '/login';
      });
    } else {
      // Token exists, allow the user to continue browsing
      console.log('User is authenticated, continue browsing');
      return token;
    }
  }

  return null; // Return null for server-side rendering
}