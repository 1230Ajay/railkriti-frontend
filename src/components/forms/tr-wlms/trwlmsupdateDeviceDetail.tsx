import React, { useState, useEffect } from 'react';
import TextInput from '../../text-fields/TextInput';
import SelectInput from '../../text-fields/SelectInput';
import DateInput from '../../text-fields/DateInput';
import { PrimaryButton } from '../../buttons/primarybutton';
import { toast } from 'react-toastify';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface TRWLMSDeviceUpdateFormProps {
  device: any;
  onClose: () => void;
}

const TRWLMSDeviceUpdateForm: React.FC<TRWLMSDeviceUpdateFormProps> = ({ device, onClose }) => {
  const [imeiNumber, setImeiNumber] = useState('');
  const [location, setLocation] = useState('');
  const [km, setKm] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [zone, setZone] = useState('');
  const [division, setDivision] = useState('');
  const [section, setSection] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOnTrack, setIsOnTrack] = useState('');
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

  useEffect(() => {
    if (device) {
      setImeiNumber(device.imei);
      setLocation(device.location);
      setKm(device.km);
      setMobileNumber(device.mobile_no);
      setLongitude(device.longitude);
      setLatitude(device.lattitude);
      setZone(device.section.division.zone.uid);
      setDivision(device.section.division.uid);
      setSection(device.section.uid);
      setIsOnTrack(device.is_on_track)
      setStartDate(new Date(device.start_date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
      setEndDate(new Date(device.end_date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD

    }
  }, [device]);

  const fetchZones = async () => {
    try {
      const response = await myIntercepter.get(`${conf.LOCATION}/api/zone`);
      setZoneOptions(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchDivisions = async (zoneId: string) => {
    try {
      const response = await myIntercepter.get(`${conf.LOCATION}/api/zone/${zoneId}`);
      setDivisionOptions(response.data.divisions);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchSections = async (divisionId: string) => {
    try {
      const response = await myIntercepter.get(`${conf.LOCATION}/api/division/${divisionId}`);
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
      lattitude: latitude,
      longitude,
      mobile_no: mobileNumber,
      location: location,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      is_on_track: isOnTrack === "true" ? true : false
    };

    try {
      const res = await myIntercepter.put(`${conf.TR_WLMS || 'https://railkriti.co.in:3004'}/api/device/${device.uid}`, formData);
      if (res.status === 200) {
        toast.success("Device updated successfully!");
        window.location.reload();
      } else {
        toast.error("Something went wrong while updating device.");
      }
      onClose();
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  return (
    <div className='rounded-md h-fit pb-8'>
      <div className='font-bold uppercase text-xl text-white mb-4'>
        <h2>Update Device <span>#{device.uid}</span></h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">

        <TextInput
          label="location"
 
          value={location}
          onChange={setLocation}
          required
        />
        <TextInput
          label="Km"
    
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
          required
        />
        <DateInput
          label="End Date"
          htmlFor="endDate"
          value={endDate}
          onChange={setEndDate}
          required
        />
        <SelectInput
          label="Zone"

          value={zone}
          onChange={setZone}
          options={zoneOptions}
          required
        />
        <SelectInput
          label="Division"
    
          value={division}
          onChange={setDivision}
          options={divisionOptions}
          required
        />
        <SelectInput
          label="Section"
     
          value={section}
          onChange={setSection}
          options={sectionOptions}
          required
        />

        <TextInput
          label="Latitude"
  
          value={latitude}
          onChange={setLatitude}
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
          options={[{ uid: true, value: true, name: "Track" }, { uid: false, value: false, name: "LHS" }]}
          required={true}
        />

        <div className='flex items-center w-full lg:col-span-3 mt-4 justify-center xl:justify-end space-x-8'>
          <PrimaryButton type={'button'} className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
          <PrimaryButton type={'submit'} className='w-24 text-lg'>Update</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default TRWLMSDeviceUpdateForm;
