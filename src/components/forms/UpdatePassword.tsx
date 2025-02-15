import React, { useState } from 'react';
import TextInput from '../text-fields/TextInput';
import { toast } from 'react-toastify';
import myIntercepter from '@/lib/interceptor';


interface UpdatePasswordFormProps {
uid: any,
  onCancel: () => void;
}


const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ uid, onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password does not match confirm password");
      return;
    }

    if (!uid) {  // Check if user.uid is not available
      toast.error("User ID not found");
      return;
    }

    const data = {
      uid: uid,
      current_password: currentPassword,
      new_password: newPassword
    };

    try {
      const res = await myIntercepter.post('/api/change-password', data);
      if (res.status === 200) {
        toast.success("Password updated successfully");
      } else {
        toast.error("Something went wrong while updating the password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 md:w-[70vw] lg:w-[50vw] p-8 shadow-lg rounded-md space-y-4">
      <h2 className='font-bold text-xl text-white uppercase'>Update Password</h2>
      <TextInput
        label="Current Password"
 
        value={currentPassword}
        onChange={setCurrentPassword}
        required
        className="text-gray-200"
      />
      <TextInput
        label="New Password"

        value={newPassword}
        onChange={setNewPassword}
        required
        className="text-gray-200"
      />
      <TextInput
        label="Confirm New Password"

        value={confirmPassword}
        onChange={setConfirmPassword}
        required
        className="text-gray-200"
      />
      <div className="flex space-x-4 justify-end">

        <button
          type="button"
          className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-dark"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
