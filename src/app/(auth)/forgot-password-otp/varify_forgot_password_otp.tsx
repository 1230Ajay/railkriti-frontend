'use client';
import { FaKey } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Image from 'next/image';
import { SignInPageData } from '@/lib/data/sigin-in';
import myIntercepter from '@/lib/interceptor';
import conf from '@/conf/conf';
// Ensure you import your RootState type

export default function ForgotPasswordOTPVerification() {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [resendTimer, setResendTimer] = useState<number>(30);
  const router = useRouter();
  const identifier = useSelector((state: any) => state.forgot_password.identifier);

  // Correctly access the state
  const dispatch = useDispatch();

  const otpData = {
    identifier,
    otp: Number(otp),
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async () => {
    try {

      const response = await myIntercepter.post(`${conf.API_GATEWAY}/auth/verify-otp`, otpData);
      
      if (response.data.status === 200) {
        setVerificationStatus('success');
        router.push('/change-password-by-email-or-username');
      } else {
        toast.error(response.data.message);
        setVerificationStatus('failed');
      }
      setIsVerifying(true);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setVerificationStatus('error');
      toast.error('Wrong OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      const response = await myIntercepter.post(`${conf.API_GATEWAY}/auth/forgot-password`, {
        identifier: identifier,
      });
      toast.success('OTP has been resent to your email.');
      setResendTimer(30);
    } catch (error) {
      toast.error('Error resending OTP. Please try again later.');
      setIsResending(false);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative lg:items-center lg:justify-center lg:h-screen lg:flex flex-col ">
    
      
    <div className="absolute top-0 -z-10 w-full  h-full">
        <Image src={`${SignInPageData.images.bg}`} alt="Sign in background" fill style={{ objectFit: 'cover' }} />
      </div>

      <div className="absolute top-8 left-8 sm:w-72 h-8 lg:w-80 lg:h-10">
      <Image src={`${SignInPageData.images.logo}`} alt="Logo" width={360} height={80} />
      </div>
      <div className="bg-black p-8 rounded-md shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <FaKey className="text-primary text-6xl" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Enter OTP</h1>
        <p className="text-gray-300 text-center mb-6">
          Please enter the OTP sent to your email and mobile number <span className='text-primary'>{identifier}</span> to verify your account. Wrong credential?  <a href='/forgot-password' className='text-primary'>change</a>
        </p>
        <div className="mb-6">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-md w-full"
            placeholder="Enter OTP"
            maxLength={6}
          />
        </div>
        <div className="flex justify-center mb-2">
          <button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
        <div className="flex justify-center items-center space-x-3   mb-6">
          <button
            onClick={handleResendOTP}
            className={`text-primary text-white   rounded ${resendTimer > 0 ? 'cursor-not-allowed' : ''}`}
            disabled={isResending || resendTimer > 0}
          >
            {isResending ? 'Resending...' : resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
          </button>
          <div className=' bg-white w-[.5px] h-4'></div>
          <a className=' w-fit  text-white' href="/sign-in">Cancel</a>
        </div>
      </div>
    </div>
  );
}
