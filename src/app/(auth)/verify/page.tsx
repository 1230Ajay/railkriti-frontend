import React from 'react'
import OTPVerification from './varify_page'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'OTP-Verification | Railkriti',
  description: 'Default page description for SEO.',

};

function page() {
  return (
    <div><OTPVerification></OTPVerification></div>
  )
}

export default page