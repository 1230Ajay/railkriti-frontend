'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setIdentifier } from '@/features/forgot-password/forgotPsswordSlice';
import { SignInPageData } from '../../../lib/data/sigin-in';
import Image from 'next/image';
import myIntercepter from '@/lib/interceptor';
import conf from '@/conf/conf';

export default function ChangeEmail() {
  const [identifier, setNewEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleEmailChange = async () => {

    try {
      setIsSubmitting(true);
      const response = await myIntercepter.post(`${conf.API_GATEWAY}/auth/forgot-password`, {
        identifier: identifier,
      });

      if (response.data.status===200) {
    
        toast.success('Otp sent to your mail.');
        await dispatch(setIdentifier(identifier));
        router.push('/forgot-password-otp');
      } else {
        toast.error(`${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error updating email:', error.message);
      toast.error(` ${'User does not exists'}`);
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Forgot Password</h1>
        <div className="mb-6">
          <input
            type="email"
            value={identifier}
            onChange={(e) => setNewEmail(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-md w-full"
            placeholder="Enter Email or Username"
          />
        </div>
        <div className="flex  flex-col gap-y-4 w-full items-center justify-center mb-6">
          <button
            onClick={handleEmailChange}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Get OTP'}
          </button>

          <a
            href='/sign-in'
            className=" text-white"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
