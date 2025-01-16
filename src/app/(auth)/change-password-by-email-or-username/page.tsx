import UpdatePasswordForm from '@/components/forms/UpdatePasswordWithEmailOrUserNameForm'
import React from 'react'
import Image from 'next/image'
import { SignInPageData } from '@/app/data/sigin-in'

export default function page() {
  return (
    <div className="relative lg:items-center lg:justify-center lg:h-screen lg:flex flex-col ">
    
      
    <div className="absolute top-0 -z-10 w-full  h-full">
        <Image src={`${SignInPageData.images.bg}`} alt="Sign in background" fill style={{ objectFit: 'cover' }} />
      </div>

      <div className="absolute top-8 left-8 sm:w-72 h-8 lg:w-80 lg:h-10">
      <Image src={`${SignInPageData.images.logo}`} alt="Logo" width={360} height={80} />
      </div>
      <UpdatePasswordForm/></div>
  )
}
