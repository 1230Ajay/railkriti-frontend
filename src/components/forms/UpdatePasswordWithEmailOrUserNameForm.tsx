'use client'

import React from 'react';
import TextInput from '../text-fields/TextInput';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import myIntercepter from '@/lib/interceptor';
import conf from '@/lib/conf/conf';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Required'),
});

const UpdatePasswordForm: React.FC = () => {
    const router = useRouter();
    const identifier = useSelector((state: any) => state.forgot_password.identifier);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const res = await myIntercepter.post(`${conf.API_GATEWAY}/auth/update`, {
                    identifier,
                    password: values.newPassword
                });

                if (res?.status === 200) {
                    toast.success(res.data.message);
                    router.push('/sign-in');
                } else {
                    toast.error(res.data.message);
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'An error occurred');
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className="bg-gray-900 md:w-[70vw] lg:w-[50vw] p-8 shadow-lg rounded-md space-y-4">
            <h2 className='font-bold text-xl text-white uppercase'>Update Password</h2>

            <TextInput
                label="New Password"
                type="password"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className="text-gray-200"
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
                <p className="text-red-500">{formik.errors.newPassword}</p>
            ) : null}

            <TextInput
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className="text-gray-200"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <p className="text-red-500">{formik.errors.confirmPassword}</p>
            ) : null}

            <div className="flex space-x-4 flex-col items-center gap-y-4 justify-center">
                <button
                    type="submit"
                    className="bg-primary text-white mt-4 px-4 py-2 rounded-md font-semibold hover:bg-primary-dark"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
                <a className='font-semibold text-white' href="/sign-in">Cancel and go to <span className='text-primary capitalize'>login</span></a>
            </div>
        </form>
    );
};

export default UpdatePasswordForm;
