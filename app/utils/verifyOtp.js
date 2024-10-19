import axios from './axiosConfig';

export default async function verifyOtp(email, otp) {
  try {
    const response = await axios.post('auth/verify-otp-email/', 
      { email, otp },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      // Django returned an error response
      return { success: false, status: error.response.status, data: error.response.data };
    } else {
      // Network or other errors
      return { success: false, status: 500, data: { detail: 'Internal Server Error' } };
    }
  }
}