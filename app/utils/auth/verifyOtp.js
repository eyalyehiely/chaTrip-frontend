import axios from '../config/axiosConfig';

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
    console.log('Response Status:', response.status); // Correct logging of the status

    if (response.status === 200) {
      localStorage.setItem('authToken', response.data.access); // Ensure the token path is correct
      console.log('Token:', response.data.access);
      window.location.href = '/'; // Redirect on success

      return { success: true, status: response.status, data: response.data };
    } else {
      return { success: false, status: response.status, data: response.data };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      status: error.response ? error.response.status : 500,
      data: error.response ? error.response.data : { detail: 'Internal Server Error' }
    };
  }
}