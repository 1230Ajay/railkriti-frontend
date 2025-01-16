import React from 'react'
import SignUpPage from './sign_up'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Sign-Up | Railkriti',
  description: 'Sign Up railkiti',

};

function page() {
  return (
    <div><SignUpPage></SignUpPage></div>
  )
}

export default page