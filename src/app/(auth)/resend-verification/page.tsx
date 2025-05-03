'use client';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setIdentifier } from '@/features/forgot-password/forgotPsswordSlice';
import { SignInPageData } from '../../../lib/data/sigin-in';
import Image from 'next/image';
import myIntercepter from '@/lib/interceptor';
import conf from '@/lib/conf/conf';
import { useFormik } from 'formik';
import { forgotPasswordDto } from './dto/forgotPasswordDto';
import { useEffect, useState } from 'react';

export default function ChangeEmail() {
  const dispatch = useDispatch();
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [lastEmail, setLastEmail] = useState('');

  useEffect(() => {
    if (timerActive && cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (cooldown === 0) {
      setTimerActive(false);
    }
  }, [cooldown, timerActive]);

  const formik = useFormik({
    initialValues: { identifier: '' },
    validationSchema: forgotPasswordDto,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await myIntercepter.post(`${conf.API_GATEWAY}/auth/resend-verificaion-email`, {
          identifier: values.identifier,
        });

        if (response.data.status === 200) {
          dispatch(setIdentifier(values.identifier));
          setEmailSent(true);
          setLastEmail(values.identifier);
          setCooldown(60);
          setTimerActive(true);
          toast.success('Email sent to your mail.');
        } else {
          toast.success(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error('User does not exist');
    
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResend = async () => {
    if (cooldown > 0 || !lastEmail) return;
    formik.setFieldValue('identifier', lastEmail);
    formik.handleSubmit();
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 p-4">

      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-40 sm:w-52 md:w-64 lg:w-72">
        <Image 
          src={SignInPageData.images.logo} 
          alt="Logo" 
          width={360} 
          height={80} 
          layout="responsive"
        />
      </div>

      {/* Form Container */}
      <div className="bg-black bg-opacity-80 p-6 sm:p-8 rounded-md shadow-md w-full max-w-md mt-12 sm:mt-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-white">Resend Email</h1>
        <div className=' text-white text-center mb-6'>Your email is not verified please verify your email first</div>
        {!emailSent ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <input
                type="email"
                name="identifier"
                value={formik.values.identifier}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-700 text-white px-4 py-2 rounded-md w-full text-sm sm:text-base"
                placeholder="Enter Email or Username"
              />
              {formik.touched.identifier && formik.errors.identifier && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.identifier}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded w-full text-sm sm:text-base"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Sending...' : 'Get Link'}
            </button>
            
            <div className="flex justify-center">
              <a href="/sign-in" className="text-white hover:underline text-sm sm:text-base">
                Cancel
              </a>
            </div>
          </form>
        ) : (
          <div className="text-center text-white space-y-4 sm:space-y-6">
            <div>
              <p className="text-sm sm:text-lg">A reset link has been sent to:</p>
              <p className="text-xs sm:text-md font-semibold mt-1 break-all">{lastEmail}</p>
            </div>

            <p className="text-xs sm:text-sm">
              Didn't receive the email? You can resend after <span className="font-semibold">{cooldown}s</span>
            </p>

            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className={`mt-2 px-4 py-2 rounded text-white w-full text-sm sm:text-base ${
                cooldown > 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              Resend Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}