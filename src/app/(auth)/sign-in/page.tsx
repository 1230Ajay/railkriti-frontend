import { Metadata } from "next";


import React, { Suspense } from 'react'
import SignInPage from "./signin_page";

export const metadata: Metadata = {
  title: 'Sign-In | Railkriti',
  description: 'Default page description for SEO.',

};

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <SignInPage />
  </Suspense>
  )
}


