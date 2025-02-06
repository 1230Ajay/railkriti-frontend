'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaEye, FaEyeSlash, FaSync } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from 'next/image';
import { SignInPageData } from "@/lib/data/sigin-in";
import Link from "next/link";
import myIntercepter from '@/lib/interceptor';
import conf from '@/conf/conf';





export default function SignInPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');

  const router = useRouter();


  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let captcha = '';
    for (let i = 0; i < 4; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(captcha);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userCaptchaInput !== generatedCaptcha) {
      toast.error("Incorrect CAPTCHA answer. Please try again.");
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await myIntercepter.post(`${conf.API_GATEWAY}/auth/sign-in`, {
        identifier,
        password
      }
      );

      if (response.data.status === 200) {
        router.push('/application');
        setIsSubmitting(false);
        toast.success(response.data.message);
        await sessionStorage.setItem('user',JSON.stringify(response.data.user));
      } else {
        setIsSubmitting(false);
        toast.error(response.data.message);
      }

    } catch (error: any) {
      toast.error('Error logging in: ' + error.message);
    }
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

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="Enter your email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full py-2 pr-10 border-b border-white bg-transparent focus:ring-transparent focus:bg-transparent focus:border-primary focus:outline-none text-white"
            />
            <FaEnvelope className="absolute right-2 bottom-3 text-white" />
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          <div className="flex mb-4 justify-between">
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
            <input
              type="text"
              placeholder="Enter Captcha"
              value={userCaptchaInput}
              onChange={(e) => setUserCaptchaInput(e.target.value)}
              required
              className="ml-4 py-1 border-b text-center  w-36 border-white bg-transparent focus:ring-transparent focus:border-primary focus:outline-none text-white"
            />
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


