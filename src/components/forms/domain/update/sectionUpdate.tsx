import React, { useState, useEffect, FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import SelectInput from '@/components/text-fields/SelectInput';
import TextInput from '@/components/text-fields/TextInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';


interface Zone {
  uid: string;
  name: string;
}

interface Division {
  uid: string;
  name: string;
}

interface SectionData {
  uid: string;
  name: string;
  sectional_code: string;
  division: {
    uid: string;
    zone: {
      uid: string;
    };
  };
}

interface UpdateSectionFormProps {
  data: any;
  onClose: () => void;
}

const UpdateSectionForm: React.FC<UpdateSectionFormProps> = ({ data, onClose }) => {
  const [zoneUid, setZone] = useState<string>('');
  const [divisionUid, setDivision] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [sectionalCode, setSectionalCode] = useState<string>('');

  const [zoneOptions, setZoneOptions] = useState<Zone[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<Division[]>([]);

  const router = useRouter();

  useEffect(() => {
    setZone(data.division.zone.uid);
    setSection(data.name);
    setSectionalCode(data.sectional_code);
    setDivision(data.division.uid);

    const fetchZones = async () => {
      try {
        const zonesResponse = await myIntercepter.get(`${conf.LOCTION}/api/zone`);
        setZoneOptions(zonesResponse.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchZones();
  }, [data]);

  useEffect(() => {
    const fetchDivisions = async () => {
      if (zoneUid) {
        try {
          const response = await myIntercepter.get(`${conf.LOCTION}/api/zone/${zoneUid}`);
          setDivisionOptions(response.data.divisions);
        } catch (error) {
          console.error('Error fetching divisions:', error);
        }
      }
    };
    fetchDivisions();
  }, [zoneUid]);

  const handleZoneChange = (selectedZoneUid: string) => {
    setZone(selectedZoneUid);
    setDivision(''); // Reset division when zone changes
  };

  const handleDivisionChange = (selectedDivisionUid: string) => {
    setDivision(selectedDivisionUid);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const sectionData = {
      uid: data.uid,
      division_uid: divisionUid,
      name: section,
      sectional_code: sectionalCode,
    };

    try {
      const response = await myIntercepter.put(`${conf.LOCTION}/api/section/${data.uid}`, sectionData);
      console.log('Section updated successfully:', response.data);
      window.location.reload();
      await onClose();
    } catch (error) {
      console.error('Error updating section:', error);
      // Handle error, e.g., show error message to user
    }
  };

  return (
    <div className='rounded-md'>
      <form onSubmit={handleSubmit} className="gap-x-8">
        <div className='font-bold uppercase text-xl text-white mb-4'>
          <h2>Update Section</h2>
        </div>

        <SelectInput
          label="Zone"
          value={zoneUid}
          onChange={handleZoneChange}
          options={zoneOptions}
        />
        <SelectInput
          label="Division"
          value={divisionUid}
          onChange={handleDivisionChange}
          options={divisionOptions}
        />
        <TextInput
          label="Section"
          value={section}
          onChange={setSection}
          required
        />

        <TextInput
          label="Sectional Code"
          value={sectionalCode}
          onChange={setSectionalCode}
          required
        />

        <div className='col-span-1 md:col-span-2 xl:col-span-3 items-center flex justify-end space-x-4 mt-4'>
          <div className='space-x-8'>

            <PrimaryButton type="button" className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
            <PrimaryButton type="submit" className='w-24 text-lg'>Update</PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateSectionForm;
