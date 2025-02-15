import React, { useEffect, useState } from 'react';
import SelectInput from '@/components/text-fields/SelectInput';
import TextInput from '@/components/text-fields/TextInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface ZoneOption {
  uid: string;
  name: string;
}

interface DivisionData {
  uid: string;
  zone_uid: string;
  name: string;
  divisional_code: string;
}

interface UpdateDivisionFormProps {
  data: DivisionData;
  onClose?: () => void;
}

const UpdateDivisionForm: React.FC<UpdateDivisionFormProps> = ({ data, onClose = () => {} }) => {
  const [zone_uid, setZone] = useState('');
  const [division, setDivision] = useState('');
  const [divisional_code, setDivisionalCode] = useState('');
  const [zoneOptions, setZoneOptions] = useState<ZoneOption[]>([]);

  const handleZoneChange = (selectedZoneUid: string) => {
    setZone(selectedZoneUid);
  };

  useEffect(() => {
    setZone(data.zone_uid);
    setDivision(data.name || '');
    setDivisionalCode(data.divisional_code || '');

    const fetchZones = async () => {
      try {
        const response = await myIntercepter.get(`${conf.LOCTION}/api/zone`);
        setZoneOptions(response.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };
    fetchZones();
  }, [data.zone_uid, data.name, data.divisional_code]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await myIntercepter.put(`${conf.LOCTION}/api/division/${data.uid}`, {
        zone_uid,
        divisional_code,
        name: division,
      });

      // Handle successful response
      console.log('Division submitted:', response.data);
      window.location.reload();
      onClose();
    } catch (error) {
      console.error('Error submitting division:', error);
    }
  };

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <div className='font-bold uppercase text-xl text-white mb-4'>
        <h2>Add Division</h2>
      </div>
      <SelectInput
        label="Zone"
        value={zone_uid}
        onChange={handleZoneChange}
        options={zoneOptions.map((zone) => ({ value: zone.uid, name: zone.name }))}
      />

      <TextInput
        label="Division"
        value={division}
        onChange={setDivision}
        required
      />

      <TextInput
        label="Divisional Code"
        value={divisional_code}
        onChange={setDivisionalCode}
        required
      />

      <div className='flex items-center mt-2 justify-end space-x-4'>

        <PrimaryButton type="button" className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
        <PrimaryButton type="submit" className='w-24 text-lg'>Update</PrimaryButton>
      </div>
    </form>
  );
};

export default UpdateDivisionForm;
