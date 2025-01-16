'use client'

import React, { useState } from 'react';
import TextInput from '../text-fields/TextInput';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { useRouter } from 'next/navigation';
import myIntercepter from '@/lib/interceptor';

const UpdatePasswordForm: React.FC = () => {

    const router = useRouter();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const identifier = useSelector((state: any) => state.forgot_password.identifier);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New password does not match confirm password");
            return;
        }


        const data = {
            identifier: identifier,
            new_password: newPassword
        };

        try {
            const res = await myIntercepter.post('/api/change-passowrd-by-email-or-username', data);
            if (res.status === 200) {
                toast.success("Password updated successfully");
                router.push('/sign-in')
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
                label="New Password"
                htmlFor="new-password"
                value={newPassword}
                onChange={setNewPassword}
                required
                className="text-gray-200"
            />
            <TextInput
                label="Confirm New Password"
                htmlFor="confirm-password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                className="text-gray-200"
            />
            <div className="flex space-x-4 flex-col items-center gap-y-4 justify-center">


                <button
                    type="submit"
                    className="bg-primary text-white mt-4 px-4 py-2 rounded-md font-semibold hover:bg-primary-dark"
                >
                    Update Passoword
                </button>
                <a className=' font-semibold text-white' href="/sign-in">Cancel and go to <span className=' text-primary capitalize'>login</span></a>
            </div>
        </form>
    );
};

export default UpdatePasswordForm;
