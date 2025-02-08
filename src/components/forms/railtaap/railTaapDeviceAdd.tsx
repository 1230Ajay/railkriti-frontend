import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TextInput from '@/components/text-fields/TextInput';
import SelectInput from '@/components/text-fields/SelectInput';
import DateInput from '@/components/text-fields/DateInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface railTaapAdd {
  onClose: () => void;
}

const RailTaapDeviceAdd: React.FC<railTaapAdd> = ({ onClose = () => { } }) => {

  const [imeiNumber, setImeiNumber] = useState('');
  const [location, setLocation] = useState('');
  const [km, setKm] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [longitude, setLongitude] = useState('');
  const [zone, setZone] = useState('');
  const [division, setDivision] = useState('');
  const [section, setSection] = useState('');
  const [lattitude, setlattitude] = useState('');
  const [readingInterval, setReadingInterval] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [meanTemp, setMeanTemp] = useState(35);
  const [deSteressingTemp, setDeSteressingTemp] = useState(35);
  const [installedAt, setInstalledAt] = useState('MAIN_LINE'); // Default value set to 'MAIN_LINE'

  // device static fields

  const [zoneOptions, setZoneOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [readingIntervalOptions, setReadingIntervalOptions] = useState([
    { uid: '15', name: '15 minutes' },
    { uid: '30', name: '30 minutes' },
    { uid: '60', name: '60 minutes' },
  ]);

  const installedAtOptions = [
    { uid: 'MAIN_LINE', name: 'Main Line' },
    { uid: 'SSE_OFFICE', name: 'SSE Office' },
  ];

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
      de_stress_temp: deSteressingTemp,
      mean_temp: meanTemp,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      reading_interval: parseInt(readingInterval),
      installed_at: installedAt // Include installedAt field
    };

    try {
      console.log(formData);
      const res = await myIntercepter.post(`${conf.RAILTAAP}/api/device`, formData);
      if (res.status === 201) {
        toast.success("Device added successfully!");
        window.location.reload();
      } else {
        toast.error("Something went wrong while registering the device");
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

        {/* Other form fields */}
        
        <TextInput
          label="Km"
          htmlFor="km"
          value={km}
          onChange={setKm}
          required
        />

        <TextInput
          label="Location"
          htmlFor="location"
          value={location}
          onChange={setLocation}
          required
        />

        {/* Additional fields */}

        <TextInput
          label="Mean Temp"
          htmlFor="meanTemp"
          value={meanTemp.toString()}
          onChange={(value) => setMeanTemp(parseInt(value))}
          required
        />

        <TextInput
          label="De-Stressing Temp"
          htmlFor="deSteressingTemp"
          value={deSteressingTemp.toString()}
          onChange={(value) => setDeSteressingTemp(parseInt(value))}
          required
        />

        <TextInput
          label="Mobile Number"
          htmlFor="mobileNumber"
          value={mobileNumber}
          onChange={setMobileNumber}
          required
        />

        <TextInput
          label="IMEI Number"
          htmlFor="imeiNumber"
          value={imeiNumber}
          onChange={setImeiNumber}
          required
        />

        <TextInput
          label="Longitude"
          htmlFor="longitude"
          value={longitude}
          onChange={setLongitude}
          required
        />

        <TextInput
          label="Lattitude"
          htmlFor="lattidtude"
          value={lattitude}
          onChange={setlattitude}
          required
        />

        <SelectInput
          label="Reading Interval"
          htmlFor="readingInterval"
          value={readingInterval}
          onChange={setReadingInterval}
          options={readingIntervalOptions}
          required={true}
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
          htmlFor="zone"
          value={zone}
          onChange={setZone}
          options={zoneOptions}
          required={true}
        />

        <SelectInput
          label="Division"
          htmlFor="division"
          value={division}
          onChange={setDivision}
          options={divisionOptions}
          required={true}
        />

        <SelectInput
          label="Section"
          htmlFor="section"
          value={section}
          onChange={setSection}
          options={sectionOptions}
          required={true}
        />

        {/* New installed_at field */}
        <SelectInput
          label="Installed At"
          htmlFor="installedAt"
          value={installedAt}
          onChange={setInstalledAt}
          options={installedAtOptions}
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
            setReadingInterval('');
            setStartDate('');
            setEndDate('');
            setInstalledAt('MAIN_LINE');
          }}>Reset</PrimaryButton>
          <PrimaryButton type={'submit'} className='w-24 text-lg'>Save</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default RailTaapDeviceAdd;
