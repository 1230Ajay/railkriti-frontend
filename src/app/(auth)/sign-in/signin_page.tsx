'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEnvelope, FaEye, FaEyeSlash, FaSync } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import Link from "next/link";
import myIntercepter from '@/lib/interceptor';
import conf from '@/lib/conf/conf';
import { SignInPageData } from '@/lib/data/sigin-in';
import { useFormik } from 'formik';
import { SignInDto } from './dto/signin.dto';



const initialValues = {
  identifier: "",
  password: "",
  captcha: ""
}

export default function SignInPage() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);


  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(error,{delay:12});
      router.replace('/sign-in'); 
    }
    
    generateCaptcha();
  }, [searchParams, router]);

  const { values, touched, errors, handleBlur, handleChange, handleReset, handleSubmit } = useFormik(
    {
      initialValues: initialValues,
      validationSchema: SignInDto,
      onSubmit: async (data) => {
    
 
    const result =  await signIn('credentials', {
      identifier:data.identifier,
      password:data.password,
      callbackUrl: '/application',
    });
      }
    }
  )


  const generateCaptcha = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let captcha = '';
    for (let i = 0; i < 4; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(captcha);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-center bg-cover object-center relative overflow-clip">
      <div className="absolute top-0 -z-10 w-full  h-full">
        <Image src={`${SignInPageData.images.bg}`} alt="Sign in background" fill style={{ objectFit: 'cover' }} />
      </div>

      <div className="absolute top-8 left-8 sm:w-72 h-8 lg:w-80 lg:h-10">
        <Image src={`${SignInPageData.images.logo}`} alt="Logo" width={360} height={80} />
      </div>

      <div className="w-full max-w-sm py-12 px-8 bg-black rounded-md border-red-500 box-shadow-1">
        <h2 className="text-2xl font-bold text-center text-white mb-6 uppercase">Sign In</h2>

        <form onSubmit={handleSubmit} className="">
          <div className="relative mb-1">
            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="Enter your email or username"
              value={values.identifier}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full py-2 pr-10 border-b border-white bg-transparent focus:ring-transparent focus:bg-transparent focus:border-primary focus:outline-none text-white"
            />
            <FaEnvelope className="absolute right-2 bottom-3 text-white" />
          </div>
          { errors.identifier && touched.identifier? <p className=' text-primary text-xs '>{errors.identifier}</p>:null}
          <div className="relative mt-3 mb-1">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Your Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full py-2 border-b border-white bg-transparent focus:ring-transparent focus:border-primary focus:outline-none text-white"
            />
            {showPassword ? (
              <FaEyeSlash
                className="absolute right-2 bottom-3 text-white cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <FaEye
                className="absolute right-2 bottom-3 text-white cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
          {errors.password && touched.password?<p className='text-primary text-xs '>{errors.password}</p>:null}
          <div className="flex mb-4 mt-5 justify-between">
            <div className="flex items-center">
              <input
                id="checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-primary border-primary rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary"
              />
              <label htmlFor="checkbox" className="text-gray-200 ml-4">
                Remember me
              </label>
            </div>
            <Link href={'/forgot-password'} className="text-primary">Forgot password</Link>
          </div>
          <div className="flex items-center justify-center mb-4 w-full">
            <div className="bg-gray-200 px-4 py-1 rounded-sm flex items-center">
              <span className="font-bold line-through tracking-widest text-black">{generatedCaptcha}</span>
            </div>
            <FaSync
              className="ml-3 text-gray-200 cursor-pointer"
              onClick={generateCaptcha}
            />
            <div>
              <input
                type="text"
                placeholder="Enter Captcha"
                value={values.captcha}
                name="captcha"
                onChange={handleChange}
                onBlur={handleBlur}
                className="ml-4 py-1 border-b text-center  w-36 border-white bg-transparent focus:ring-transparent focus:border-primary focus:outline-none text-white"
              />
              {errors.captcha && touched.captcha? <p className='ml-4 mt-1 text-primary text-xs'>{errors.captcha}</p>:null}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Login'}
            </button>
          </div>
          <div className="text-gray-200 flex pt-3 space-x-2 justify-center">
            <p>Create an Account?</p>
            <a href="/sign-up" className="text-primary">Sign Up</a>
          </div>
          <div className="text-white flex justify-center">
            <a className="text-primary" href="https://robokriti.co.in:8000/contact">Contact Support</a>
          </div>
        </form>
      </div>
    </div>
  );
}


