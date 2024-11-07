"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // If you're using Next.js 13+
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import sendOtp from '../utils/api/auth/sendOtp';
import verifyOtp from '../utils/api/auth/verifyOtp';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email'); // Step tracking
  const router = useRouter();

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage({ type: '', content: '' }); // Reset message

    // Basic email validation
    if (!email) {
      setMessage({ type: 'error', content: 'Please enter your email address.' });
      return;
    }

    setLoading(true);

    try {
      const data = await sendOtp(email);
      setMessage({ type: 'success', content: data.detail || 'OTP sent successfully to your email.' });
      console.log('OTP sent:', data);
      setStep('otp'); // Move to OTP verification step
    } catch (error) {
      if (error instanceof Error) {
        const parsed = parseErrorMessage(error.message);
        setMessage({ type: 'error', content: parsed });
      } else {
        setMessage({ type: 'error', content: 'An unexpected error occurred. Please try again.' });
      }
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage({ type: '', content: '' }); // Reset message
  
    // Basic validation
    if (!email) {
      setMessage({ type: 'error', content: 'Please enter your email address.' });
      return;
    }
  
    if (!otp) {
      setMessage({ type: 'error', content: 'Please enter the OTP sent to your email.' });
      return;
    }
  
    setLoading(true);
  
    try {
      const data = await verifyOtp(email, otp);
      if (data.success) {
        setMessage({ type: 'success', content: data.data.detail || 'Verification successful!' });
        // Redirect to the dashboard or another protected route
        router.push('/');
      } else {
        // Handle specific backend error messages
        const errorDetail = data.data.detail;
        if (errorDetail.includes("OTP has expired")) {
          setMessage({ type: 'error', content: 'Your OTP has expired. Please request a new one.' });
        } else if (errorDetail.includes("Invalid OTP")) {
          setMessage({ type: 'error', content: 'Invalid OTP entered. Please check and try again.' });
        } else if (errorDetail.includes("Maximum OTP attempts exceeded")) {
          setMessage({ type: 'error', content: 'Maximum OTP attempts exceeded. Please request a new OTP.' });
        } else {
          setMessage({ type: 'error', content: errorDetail || 'Verification failed.' });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        const parsed = parseErrorMessage(error.message);
        setMessage({ type: 'error', content: parsed || 'An unexpected error occurred. Please try again.' });
      } else {
        setMessage({ type: 'error', content: 'An unexpected error occurred. Please try again.' });
      }
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setMessage({ type: 'error', content: 'Please enter your email address to resend OTP.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const data = await sendOtp(email);
      setMessage({ type: 'success', content: data.detail || 'OTP resent successfully to your email.' });
      console.log('OTP resent:', data);
    } catch (error) {
      if (error instanceof Error) {
        const parsed = parseErrorMessage(error.message);
        setMessage({ type: 'error', content: parsed });
      } else {
        setMessage({ type: 'error', content: 'An unexpected error occurred. Please try again.' });
      }
      console.error('Error resending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseErrorMessage = (errorMsg: string): string => {
    try {
      const parts = errorMsg.split(': ');
      if (parts.length >= 2) {
        const jsonPart = parts.slice(2).join(': '); // In case JSON contains colons
        const errorData = JSON.parse(jsonPart);
        return errorData.detail || 'An error occurred.';
      }
      return 'An error occurred.';
    } catch (e) {
      return 'An error occurred.';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{step === 'email' ? 'Login' : 'Verify OTP'}</CardTitle>
          <CardDescription>
            {step === 'email'
              ? 'Enter your email to receive an OTP.'
              : 'Enter the OTP sent to your email to verify your account.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || step === 'otp'} // Disable email input during loading or OTP step
              />
            </div>
            {step === 'otp' && (
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
            {message.content && (
              <div
                className={`p-2 rounded ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {message.content}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {step === 'email'
                ? loading
                  ? 'Sending OTP...'
                  : 'Send OTP'
                : loading
                ? 'Verifying...'
                : 'Verify OTP'}
            </Button>
            {step === 'otp' && (
              <Button
                variant="link"
                className="w-full text-center"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend OTP
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}