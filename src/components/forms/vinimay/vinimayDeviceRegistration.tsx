import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TextInput from '@/components/text-fields/TextInput';
import SelectInput from '@/components/text-fields/SelectInput';
import DateInput from '@/components/text-fields/DateInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

const VinimayDeviceReservationForm = ({ onClose = () => { } }) => {

  const [imeiNumber, setImeiNumber] = useState('');
  const [location, setLocation] = useState('');
  const [km, setKm] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [longitude, setLongitude] = useState('');
  const [zone, setZone] = useState('');
  const [division, setDivision] = useState('');
  const [section, setSection] = useState('');
  const [lattitude, setlattitude] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOnTrack, setIsOnTrack] = useState("true");

  // device static fields


  const [zoneOptions, setZoneOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (zone) {
      fetchDivisions(zone);
    }
  }, [zone]);

  useEffect(() => {
    if (division) {
      fetchSections(division);
    }
  }, [division]);

  const fetchZones = async () => {
    try {
      const response = await myIntercepter.get(`${conf.LOCTION}/api/zone`);
      setZoneOptions(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchDivisions = async (zoneId: string) => {
    try {
      const response = await myIntercepter.get(`${conf.LOCTION}/api/zone/${zoneId}`);
      setDivisionOptions(response.data.divisions);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchSections = async (divisionId: string) => {
    try {
      const response = await myIntercepter.get(`${conf.LOCTION}/api/division/${divisionId}`);
      setSectionOptions(response.data.sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const formData = {

      imei: imeiNumber,
      section_uid: section,
      km: km,
      lattitude: lattitude,
      longitude: longitude,
      mobile_no: mobileNumber,
      location: location,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
    };

    try {
      console.log(`${conf.VINIMAY_URL}/api/`);
      const res = await myIntercepter.post(`${conf.VINIMAY_URL}/api/`, formData);
      if (res.status === 201) {
        toast.success("Device added succesfully!");
        window.location.reload();
      } else {
        toast.error("Smothing went wrong, while registering device");
      }
      onClose();
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  return (
    <div className='rounded-md h-fit pb-8'>
      <div className='font-bold uppercase text-xl text-white mb-4'>
        <h2>Add Device</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
        <TextInput
          label="location"

          value={location}
          onChange={setLocation}
          required
        />



        <TextInput
          label="km"
    
          value={km}
          onChange={setKm}
          required
        />



        <TextInput
          label="Mobile Number"
  
          value={mobileNumber}
          onChange={setMobileNumber}
          required
        />


        <TextInput
          label="IMEI Number"
 
          value={imeiNumber}
          onChange={setImeiNumber}
          required
        />

        <DateInput
          label="Start Date"
          htmlFor="startDate"
          value={startDate}
          onChange={setStartDate}
          required={true}
        />
        <DateInput
          label="End Date"
          htmlFor="endDate"
          value={endDate}
          onChange={setEndDate}
          required={true}
        />

        <SelectInput
          label="Zone"

          value={zone}
          onChange={setZone}
          options={zoneOptions}
          required={true}
        />
        <SelectInput
          label="Division"
    
          value={division}
          onChange={setDivision}
          options={divisionOptions}
          required={true}
        />
        <SelectInput
          label="Section"
 
          value={section}
          onChange={setSection}
          options={sectionOptions}
          required={true}
        />

        <TextInput
          label="Lattitude"
       
          value={lattitude}
          onChange={setlattitude}
          required
        />

        <TextInput
          label="Longitude"
      
          value={longitude}
          onChange={setLongitude}
          required
        />




        <SelectInput
          label="Installed at"
    
          value={isOnTrack}
          onChange={setIsOnTrack}
          options={[{uid:true, value: true, name: "Track" },{uid:false, value: false, name: "LHS" }]}
          required={true}
        />

        <div className='flex items-center w-full lg:col-span-3 mt-4 justify-center xl:justify-end space-x-8'>
          <PrimaryButton type={'button'} className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
          <PrimaryButton type={'reset'} className='w-24 text-lg' onClick={() => {

            setImeiNumber('');
            setLocation('');
            setKm('');
            setMobileNumber('');
            setLongitude('');
            setZone('');
            setDivision('');
            setSection('');
            setlattitude('');

            setStartDate('');
            setEndDate('');
          }}>Reset</PrimaryButton>
          <PrimaryButton type={'submit'} className='w-24 text-lg'>Save</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default VinimayDeviceReservationForm;
