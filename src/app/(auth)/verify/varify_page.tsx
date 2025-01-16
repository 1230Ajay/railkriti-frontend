'use client';
import { FaKey } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// Ensure you import your RootState type
import Image from 'next/image';
import { SignInPageData } from '@/app/data/sigin-in';
import myIntercepter from '@/lib/interceptor';




export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [resendTimer, setResendTimer] = useState<number>(30);
  const router = useRouter();
  const email = useSelector((state: any) => state.login.email);
  const mobile = useSelector((state: any) => state.login.mobile);

  // Correctly access the state
  const dispatch = useDispatch();

  const otpData = {
    email,
    code: otp,
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
      setIsVerifying(true);
      const response = await myIntercepter.post('/api/verify-otp', otpData);
      if (response.data.success) {
        setVerificationStatus('success');
        router.push('/verified');
      } else {
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      await myIntercepter.post('/api/otp', { email });
      toast.success('OTP has been resent to your email.');
      setResendTimer(30);
    } catch (error) {
      toast.error('Error resending OTP. Please try again later.');
      setIsResending(false);
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    router.push('/change-email');
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
          Please enter the OTP sent to {email} and {mobile} to verify your account. Wrong email? <a href='/change-email' className='text-primary'>Edit email</a> or <a href='/change-mobile' className='text-primary'>Edit Mobile</a>
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
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <button
            onClick={handleResendOTP}
            className={`text-primary text-white font-semibold py-2 px-4 rounded ${resendTimer > 0 ? 'cursor-not-allowed' : ''}`}
            disabled={isResending || resendTimer > 0}
          >
            {isResending ? 'Resending...' : resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
          </button>
        </div>

      </div>
    </div>
  );
}
