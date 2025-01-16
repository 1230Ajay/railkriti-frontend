import React, { useState, useEffect } from 'react';
import TextInput from '../text-fields/TextInput';
import SelectInput from '../text-fields/SelectInput';
import { PrimaryButton } from '../buttons/primarybutton';
import { useRouter } from 'next/navigation';
import conf from '@/conf/conf';
import myIntercepter from '@/lib/interceptor';
const SectionForm = ({ onClose = () => { } }) => {

  const [zone_uid, setZone] = useState('');
  const [division_uid, setDivision] = useState('');
  const [section, setSection] = useState('');
  const [sectional_code, setSectionalCode] = useState('');

  const [zoneOptions, setZoneOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);

  const router = useRouter();
  // Fetch zones on component mount
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zones = await myIntercepter.get(`${conf.LOCTION}/api/zone`);


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



    const sectionData = {
      division_uid,
      name: section,
      sectional_code
    };

    try {
      const response = await myIntercepter.post(`${conf.LOCTION}/api/section`, sectionData);
      console.log('Section registered successfully:', response.data);
      await onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error, e.g., show error message to user
    }
  };

  return (
    <div className='rounded-md'>

      <form onSubmit={handleSubmit} className=" gap-x-8">
        <div className='font-bold uppercase text-xl text-white mb-4'>
          <h2>Add Section</h2>
        </div>

        <SelectInput
          label="Zone"
          htmlFor="zone"
          value={zone_uid}
          onChange={handleZoneChange}
          options={zoneOptions}
        />
        <SelectInput
          label="Division"
          htmlFor="division"
          value={division_uid}
          onChange={handleDivisionChange}
          options={divisionOptions}
      // Disable division select until a zone is selected
        />


        <TextInput
          label="Section"
          htmlFor="section"
          value={section}
          onChange={setSection}
          required
        />

        <TextInput
          label="Sectional Code"
          htmlFor="divisional_code"
          value={sectional_code}
          onChange={setSectionalCode}
          required
        />


        <div className='col-span-1 md:col-span-2 xl:col-span-3 items-center flex justify-end space-x-4 mt-4'>

          <div className=' space-x-8'>
            <PrimaryButton type="submit" className='w-24 text-lg'>Save</PrimaryButton>
            <PrimaryButton className='w-24 text-lg' onClick={() => onClose()}>Cancel</PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SectionForm;
