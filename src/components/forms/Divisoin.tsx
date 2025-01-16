import React, { useEffect, useState } from 'react';
import TextInput from '../text-fields/TextInput';
import { PrimaryButton } from '../buttons/primarybutton';
import SelectInput from '../text-fields/SelectInput';
import conf from '@/conf/conf';
import myIntercepter from '@/lib/interceptor';

const DivisionForm = ({ onClose = () => {} }) => {
  const [zone_uid, setZone] = useState('');
  const [division, setDivision] = useState('');
  const [divisional_code, setDivisionalCode] = useState('');
  const [zoneOptions, setZoneOptions] = useState([]);

  const handleZoneChange = (selectedZoneUid: React.SetStateAction<string>) => {
    setZone(selectedZoneUid);
  };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await myIntercepter.get(`${conf.LOCTION}/api/zone`);
        setZoneOptions(response.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };
    fetchZones();
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const response = await myIntercepter.post(`${conf.LOCTION}/api/division`, {
        zone_uid,
        divisional_code,
        name: division,
      });

      // Handle successful response
      console.log('Division submitted:', response.data);
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error('Error submitting division:', error);
    }
  };

  return (
    <form className='w-full ' onSubmit={handleSubmit}>
        <div className='font-bold uppercase text-xl text-white mb-4'>
        <h2>Add Division</h2>
      </div>
      <SelectInput
        label="Zone"
        htmlFor="zone"
        value={zone_uid}
        onChange={handleZoneChange}
        options={zoneOptions}
      />

      <TextInput
        label="Division"
        htmlFor="division"
        value={division}
        onChange={setDivision}
        required
      />

      <TextInput
        label="Divisional Code"
        htmlFor="divisional_code"
        value={divisional_code}
        onChange={setDivisionalCode}
        required
      />

      <div className='flex items-center mt-2 justify-end space-x-4'>
        <PrimaryButton type="submit" className='w-24 text-lg'>Save</PrimaryButton>
        <PrimaryButton className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
      </div>
    </form>
  );
};

export default DivisionForm;
