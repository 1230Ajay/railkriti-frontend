'use client';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setIdentifier } from '@/features/forgot-password/forgotPsswordSlice';
import { SignInPageData } from '../../../lib/data/sigin-in';
import Image from 'next/image';
import myIntercepter from '@/lib/interceptor';
import conf from '@/lib/conf/conf';
import { useFormik } from 'formik';
import { forgotPasswordDto } from './dto/forgotPasswordDto';

export default function ChangeEmail() {
  const router = useRouter();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { identifier: '' },
    validationSchema: forgotPasswordDto,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await myIntercepter.post(`${conf.API_GATEWAY}/auth/forgot-password`, {
          identifier: values.identifier,
        });

        if (response.data.status === 200) {
          toast.success('OTP sent to your mail.');
          dispatch(setIdentifier(values.identifier));
          router.push('/forgot-password-otp');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('User does not exist');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="relative lg:items-center lg:justify-center lg:h-screen lg:flex flex-col">
      <div className="absolute top-0 -z-10 w-full h-full">
        <Image src={SignInPageData.images.bg} alt="Sign in background" fill style={{ objectFit: 'cover' }} />
      </div>

      <div className="absolute top-8 left-8 sm:w-72 h-8 lg:w-80 lg:h-10">
        <Image src={SignInPageData.images.logo} alt="Logo" width={360} height={80} />
      </div>

      <div className="bg-black p-8 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Forgot Password</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <input
            type="email"
            name="identifier"
            value={formik.values.identifier}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-gray-700 text-white px-4 py-2 rounded-md w-full"
            placeholder="Enter Email or Username"
          />
          {formik.touched.identifier && formik.errors.identifier && (
            <p className="text-red-500 text-sm">{formik.errors.identifier}</p>
          )}

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded w-full"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Updating...' : 'Get OTP'}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <a href='/sign-in' className="text-white">Cancel</a>
        </div>
      </div>
    </div>
  );
}