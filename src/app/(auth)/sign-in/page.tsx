import { Metadata } from "next";


import React from 'react'
import SignInPage from "./signin_page";

export const metadata: Metadata = {
  title: 'Sign-In | Railkriti',
  description: 'Default page description for SEO.',

};

export default function page() {
  return (
    <div><SignInPage/></div>
  )
}


