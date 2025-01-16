import React from 'react'

import { Metadata } from 'next';
import ForgotPasswordOTPVerification from './varify_forgot_password_otp';


export const metadata: Metadata = {
  title: 'OTP-Verification | Railkriti',
  description: 'Default page description for SEO.',

};

function page() {
  return (
    <div><ForgotPasswordOTPVerification/></div>
  )
}

export default page