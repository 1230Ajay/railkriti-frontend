import React, { useState, useEffect } from 'react';
import TextInput from '../../text-fields/TextInput';
import SelectInput from '../../text-fields/SelectInput';
import { PrimaryButton } from '../../buttons/primarybutton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setEmail, setMobileNumber } from '../../../features/login/loginSlice';
import { toast } from 'react-toastify';
import conf from '@/conf/conf';
import myIntercepter from '@/lib/interceptor';

const UserRegistrationForm = ({ onClose = () => { } }) => {
  const [isRailwayEmployee, setIsRailwayEmployee] = useState(false); // Checkbox state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [designation, setDesignation] = useState('');
  const [zone_uid, setZone] = useState('');
  const [division_uid, setDivision] = useState('');
  const [section_uid, setSections] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmailState] = useState('');

  const [zoneOptions, setZoneOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch zones on component mount
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zones = await myIntercepter.get('/api/zone');
        setZoneOptions(zones.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };
    fetchZones();
  }, []);

  // Fetch divisions based on selected zone
  useEffect(() => {
    const fetchDivisions = async () => {
      if (zone_uid) {
        try {
          const response = await myIntercepter.get(`${conf.LOCTION}/api/zone/${zone_uid}`);
          setDivisionOptions(response.data);
        } catch (error) {
          console.error('Error fetching divisions:', error);
        }
      }
    };
    fetchDivisions();
  }, [zone_uid]);

  // Fetch sections based on selected division
  useEffect(() => {
    const fetchSections = async () => {
      if (division_uid) {
        try {
          const response = await myIntercepter.get(`${conf.LOCTION}/api/division/${division_uid}`);
          setSectionOptions(response.data);
        } catch (error) {
          console.error('Error fetching sections:', error);
        }
      }
    };
    fetchSections();
  }, [division_uid]);

  const handleZoneChange = (selectedZoneUid: React.SetStateAction<string>) => {
    const selectedZone = zoneOptions.find((zone:any) => zone.uid === selectedZoneUid);
    setZone(selectedZoneUid);
    setDivision(''); // Reset division when zone changes
  };

  const handleDivisionChange = (selectedDivision: React.SetStateAction<string>) => {
    setDivision(selectedDivision);
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.log("passwore does not match")
      toast.error('Passwords do not match');
      return;
    }

    // Prepare the userData object
    const userData = {
      username,
      password,
      designation,
      firstname,
      lastname,
      mobile,
      email,
      ...(isRailwayEmployee && {
        zone_uid: zone_uid || undefined,
        division_uid: division_uid || undefined,
        section_uid: section_uid.length > 0 ? section_uid : undefined,
      }),
    };
  
    try {
      const response = await myIntercepter.post('/api/user', userData);
      console.log('User registered successfully:', response.data);
      await dispatch(setEmail(email));
      await dispatch(setMobileNumber(mobile));
      await router.push('/verify');
      onClose();
    } catch (error:any) {
      console.error('Error registering user:', error);
      // Display the error message from the backend in the toast
      toast.error(error.response?.data?.error || 'Something went wrong while creating user');
    }
  };

  return (
    <div className='rounded-md '>
      <div className='font-bold uppercase text-xl text-white mb-4'>
        <h2>Register User</h2>
      </div>
      <form onSubmit={handleSubmit} >

        <div className="grid md:w-[70vw] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
          <TextInput
            label="First Name"
            htmlFor="firstName"
            value={firstname}
            onChange={setFirstName}
            required
          />
          <TextInput
            label="Last Name"
            htmlFor="lastName"
            value={lastname}
            onChange={setLastName}
            required
          />
          <TextInput
            label="Username"
            htmlFor="username"
            value={username}
            onChange={setUsername}
            required
          />
          <div className="relative">
            <TextInput
              label="Password"
              htmlFor="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <TextInput
              label="Confirm Password"
              htmlFor="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <TextInput
            label="Designation"
            htmlFor="designation"
            value={designation}
            onChange={setDesignation}
            required
          />
          <TextInput
            label="Mobile"
            htmlFor="mobile"
            value={mobile}
            onChange={setMobile}
            required
          />
          <TextInput
            label="Email"
            htmlFor="email"
            value={email}
            onChange={setEmailState}
            required
          />
        </div>

        <div className='col-span-3 grid'>
          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox text-primary h-5 w-5 text-gray-600"
                checked={isRailwayEmployee}
                onChange={() => setIsRailwayEmployee(!isRailwayEmployee)}
              />
              <span className="text-white">Are you a railway employee?</span>
            </label>
          </div>
        </div>

        {isRailwayEmployee && (
          <div className='grid md:grid-cols-3 mt-4 gap-x-8'>
            <SelectInput
              label="Zone"
              htmlFor="zone"
              value={zone_uid}
              onChange={handleZoneChange}
              options={zoneOptions} 
              required={true}
            />
            <SelectInput
              label="Division"
              htmlFor="division"
              value={division_uid}
              onChange={handleDivisionChange}
              options={divisionOptions}
           // Disable division select until a zone is selected
            />
            <SelectInput
              label="Sections"
              htmlFor="sections"
              value={section_uid}
              onChange={setSections}
              options={sectionOptions}
              // Disable sections select until a division is selected
            />
          </div>
        )}

        <div className='md:flex md:mt-4 justify-between items-center'>
          <div className='text-white flex space-x-1 mb-4 md:mb-0'>
            <p>Already have an account?</p>
            <a href="/sign-in" className='text-primary'>Login</a>
          </div>
          <div className='flex space-x-4'>
            <PrimaryButton className='w-24 text-lg' onClick={() => {
              setUsername('');
              setPassword('');
              setConfirmPassword('');
              setDesignation('');
              setZone('');
              setDivision('');
              setSections('');
              setFirstName('');
              setLastName('');
              setMobile('');
              setEmailState('');
              setIsRailwayEmployee(false); // Reset checkbox state
            } } type={'reset'}>Reset</PrimaryButton>
            <PrimaryButton onClick={()=>{}} type="submit" className='w-24 text-lg'>Submit</PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserRegistrationForm;
