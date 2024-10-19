// sendOtp.js
import axios from './axiosConfig';

export default async function sendOtp(email) {
  try {
    const response = await axios.post('auth/send-otp-email/', { email });
    return response.data;
    
  } catch (error) {
    handleSendOtpError(error);
  }
}

function handleSendOtpError(error) {
  if (error.response) {
    // Server responded with a status other than 2xx
    throw new Error(
      `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`
    );
  } else if (error.request) {
    // No response received from server
    throw new Error('No response received from the server.');
  } else {
    // Other errors (e.g., setting up the request)
    throw new Error(`Request Error: ${error.message}`);
  }
}