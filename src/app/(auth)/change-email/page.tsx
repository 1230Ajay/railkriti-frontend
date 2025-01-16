'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setEmail } from '@/features/login/loginSlice';
import myIntercepter from '@/lib/interceptor';

export default function ChangeEmail() {
  const [newEmail, setNewEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();


  const current_email = useSelector((state: any) => state.login.email);

  const handleEmailChange = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await myIntercepter.post('http://localhost:3002/api/change-email', {
        email: current_email,
        new_email: newEmail,
      });

      if (response.data.success) {
        dispatch(setEmail(newEmail));
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
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Edit Email</h1>
        <p className='text-white py-8 text-center'>Current email: {current_email}</p>
        <div className="mb-6">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-md w-full"
            placeholder="Enter new email"
          />
        </div>
        <div className="flex  flex-col gap-y-4 w-full items-center justify-center mb-6">
          <button
            onClick={handleEmailChange}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Email'}
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
