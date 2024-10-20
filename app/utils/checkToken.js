export default function checkToken() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // Redirect to /login if no auth token is found
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    

  } else {
    // Token exists, allow the user to continue browsing
    console.log('User is authenticated, continue browsing');
  }
}

