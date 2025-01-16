'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { setMobileNumber } from '@/features/login/loginSlice';
import myIntercepter from '@/lib/interceptor';

export default function ChangeMobile() {
  const [newMobile, setNewMobile] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const current_email = useSelector((state: any) => state.login.email);
  const current_mobile = useSelector((state: any) => state.login.mobile);

  const handleMobileChange = async () => {


    try {
      setIsSubmitting(true);
      const response = await myIntercepter.post('/api/change-mobile', {
        email: current_email,
        new_mobile: newMobile,
      });

      if (response.data.success) {
        dispatch(setMobileNumber(newMobile));
        toast.success('Email updated successfully.');
        router.push('/verify');
      } else {
        toast.error(`Failed to update email: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error updating email:', error.message);
      toast.error(` ${'Email allready exists'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
      <div className="bg-black p-8 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Edit Mobile</h1>
        <p className='text-white py-8 text-center'>Current mobile: {current_mobile}</p>
        <div className="mb-6">
          <input
            type="Mobile"
            value={newMobile}
            onChange={(e) => setNewMobile(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-md w-full"
            placeholder="Enter new mobile"
          />
        </div>
        <div className="flex  flex-col gap-y-4 w-full items-center justify-center mb-6">
          <button
            onClick={handleMobileChange}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Mobile'}
          </button>

          <a
            href='/verify'
            className=" text-white"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
