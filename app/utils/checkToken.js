import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';  // Correct import

const checkToken = () => {
    const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')).access : null;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if the token is expired
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('authToken');
          router.push('/login');  // Redirect to home if the token is expired
        }

        // Check if the user is not a 'Company'
        if (decodedToken.username == null) {
          router.push(-1);  // navigate back to the previous page
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authTokens');
        router.push('/login');  // Redirect to home if the token is invalid
      }
    } else {
      router.push('/login');  // Redirect to home if no token is found
    }
  }, [router]);  // Runs only once on mount
};

export default checkToken;