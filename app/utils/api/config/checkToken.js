import Swal from "sweetalert2";

export default function checkToken() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Show an alert before redirecting to /login
    window.location.href = '/login';
    localStorage.removeItem('authToken');
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="#">Why do I have this issue?</a>'
    }).then(() => {
      // Redirect to /login if no auth token is found
      
     
    });
  } else {
    // Token exists, allow the user to continue browsing
    console.log('User is authenticated, continue browsing');
  }
}