import React, { useState } from 'react';
import TextInput from '../text-fields/TextInput';
import { PrimaryButton } from '../buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

const ZoneForm = ({ onClose = () => { } }) => {
  const [zone, setZone] = useState('');
  const [zonal_code, setZoneCode] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      // Making a POST request to /api/zone
      const response = await myIntercepter.post(`${conf.LOCATION}/api/zone`, {
        name: zone,
        zonal_code: zonal_code
      });

      // Handle successful response
      console.log('Zone submitted:', response.data);
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error('Error submitting zone:', error);
    }
  };

  return (
    <form className='w-full  h-full' onSubmit={handleSubmit}>
        <div className='font-bold uppercase text-xl text-white mb-4'>
        <h2>Add Zone</h2>
      </div>
      <TextInput
        label="Zone"

        value={zone}
        onChange={setZone}
        required
      />

      <TextInput
        label="Zonal Code"
        value={zonal_code}
        onChange={setZoneCode}
        required
      />
      <div className='flex items-center mt-2 justify-end space-x-4'>
        <PrimaryButton type="submit" className='w-24 text-lg' children={'Save'} />
        <PrimaryButton className='w-24 text-lg' children={'Cancel'} onClick={() => onClose()} />
      </div>
    </form>
  );
};

export default ZoneForm;
