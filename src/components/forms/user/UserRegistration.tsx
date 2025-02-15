import React, { useState, useEffect } from 'react';
import TextInput from '../../text-fields/TextInput';

import { PrimaryButton } from '../../buttons/primarybutton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setEmail, setMobileNumber } from '../../../features/login/loginSlice';
import { toast } from 'react-toastify';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { useFormik } from 'formik';
import { signUpDto } from '@/app/(auth)/sign-up/dto/signUpDto';


const initialValues = {
  username: "",
  password: "",
  confirmPassword: "",
  designation: "",
  firstName: "",
  lastName: "",
  mobile: "",
  email: ""
}

const UserRegistrationForm = ({ onClose = () => { } }) => {
  const [isRailwayEmployee, setIsRailwayEmployee] = useState(false); // Checkbox state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { values, handleBlur, errors, touched, handleChange, handleReset, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: signUpDto,
    onSubmit: async (data) => {
      if (data.password !== data.confirmPassword) {
        console.log("passwore does not match")
        toast.error('Passwords do not match');
        return;
      }

      // Prepare the userData object
      const userData = {
        username: data.username,
        password: data.password,
        designation: data.designation,
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile,
        email: data.email,
      };

      try {
        const response = await myIntercepter.post(`${conf.API_GATEWAY}/auth/sign-up`, userData);
        if (response.data.status === 201) {
          await dispatch(setEmail(data.email));
          await dispatch(setMobileNumber(data.mobile));
          await router.push('/verify');
          toast.success(response?.data?.message || 'user Created successfully');
          onClose();
        }else{
          toast.error(response?.data?.message || 'Something went wrong while creating user');
        }
      } catch (error: any) {
        console.error('Error registering user:', error);
        toast.error(error.response?.data?.error || 'Something went wrong while creating user');
      }
    }
  })


  return (
    <div className='rounded-md '>
      <div className='font-bold uppercase text-xl text-white mb-4'>
        <h2>Register User</h2>
      </div>
      <form autoComplete='off' onSubmit={handleSubmit}>

        <div className="grid md:w-[70vw] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
          <TextInput
            label="First Name"
            name='firstName'
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.firstName && touched.firstName ? errors.firstName : ""}
          />
          <TextInput
            label="Last Name"

            name='lastName'
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastName && touched.lastName ? errors.lastName : ""}
          />
          <TextInput
            label="Username"
            name='username'
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username && touched.username ? errors.username : ""}
          />
          <div className="relative ">
            <TextInput
              label="Password"
      
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password && touched.password ? errors.password : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 pr-3 pt-4  ${errors.confirmPassword && touched.confirmPassword ? "pt-0" : ""} flex items-center text-gray-500`}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <TextInput
              label="Confirm Password"
            
              name='confirmPassword'
              type={showPassword ? 'text' : 'password'}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ""}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute inset-y-0 right-0 pr-3 pt-4 flex items-center text-gray-500 ${errors.confirmPassword && touched.confirmPassword ? "pt-0" : ""}`}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <TextInput
            label="Designation"
       
            name='designation'
            value={values.designation}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.designation && touched.designation ? errors.designation : ""}
          />
          <TextInput
            label="Mobile"
      
            name='mobile'
            value={values.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.mobile && touched.mobile ? errors.mobile : ""}
          />
          <TextInput
            label="Email"
     
            name='email'
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email && touched.email ? errors.email : ""}
          />
        </div>

        

        <div className='md:flex md:mt-4 justify-between items-center'>
          <div className='text-white flex space-x-1 mb-4 md:mb-0'>
            <p>Already have an account?</p>
            <a href="/sign-in" className='text-primary'>Login</a>
          </div>
          <div className='flex space-x-4'>
            <PrimaryButton className='w-24 text-lg' onClick={() => handleReset} type={'reset'}>Reset</PrimaryButton>
            <PrimaryButton onClick={() => { }} type="submit" className='w-24 text-lg'>Submit</PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserRegistrationForm;
