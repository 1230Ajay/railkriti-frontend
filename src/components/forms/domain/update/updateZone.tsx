import React, { useState, useEffect } from 'react';
import TextInput from '@/components/text-fields/TextInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface ZoneData {
  uid: string;
  name: string;
  zonal_code: string;
}

interface UpdateZoneFormProps {
  data: ZoneData;
  onClose?: () => void;
}

const UpdateZoneForm: React.FC<UpdateZoneFormProps> = ({ data, onClose = () => {} }) => {
  const [zone, setZone] = useState<string>('');
  const [zonal_code, setZoneCode] = useState<string>('');

  useEffect(() => {
    // Set default values when data prop changes
    setZone(data.name || '');
    setZoneCode(data.zonal_code || '');
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Making a POST request to /api/zone
      const response = await myIntercepter.put(`${conf.LOCTION}/api/zone/${data.uid}`, {
        name: zone,
        zonal_code
      });

      // Handle successful response
      console.log('Zone submitted:', response.data);
      window.location.reload();
      onClose();
    } catch (error) {
      console.error('Error submitting zone:', error);
    }
  };

  return (
    <form className='w-full h-full' onSubmit={handleSubmit}>
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
      <PrimaryButton type="button" className='w-24 text-lg' onClick={onClose}>
          Cancel
        </PrimaryButton>
        <PrimaryButton type="submit" className='w-24 text-lg'>
          Update
        </PrimaryButton>
      </div>
    </form>
  );
};

export default UpdateZoneForm;
