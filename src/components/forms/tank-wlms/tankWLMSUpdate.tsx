import React, { useState, useEffect } from 'react';
import TextInput from '../../text-fields/TextInput';
import SelectInput from '../../text-fields/SelectInput';
import DateInput from '../../text-fields/DateInput';
import { PrimaryButton } from '../../buttons/primarybutton';
import { toast } from 'react-toastify';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface DeviceUpdateFormProps {
  device: any;
  onClose: () => void;
}

const TankWLMSDeviceUpdate: React.FC<DeviceUpdateFormProps> = ({ device, onClose }) => {
  const [imeiNumber, setImeiNumber] = useState('');
  const [location, setLocation] = useState('');
  const [km, setKm] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [zone, setZone] = useState('');
  const [division, setDivision] = useState('');
  const [section, setSection] = useState('');
  const [readingInterval, setReadingInterval] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [zoneOptions, setZoneOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [readingIntervalOptions, setReadingIntervalOptions] = useState([
    { uid: '15', name: '15 minutes' },
    { uid: '30', name: '30 minutes' },
    { uid: '60', name: '60 minutes' },
  ]);



  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (device) {
      fetchDeviceData();
    }
  }, [device]);

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
      const response = await myIntercepter.get(`${conf.LOCATION}/api/zone`);
      setZoneOptions(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchDeviceData = async () => {
    setLoading(true); // Set loading state
    try {

      if (device) {
        setImeiNumber(device.imei);
        setLocation(device.location);
        setKm(device.km);
        setMobileNumber(device.mobile_no);
        setLongitude(device.longitude);
        setLatitude(device.lattitude);
        setZone(device.section.division.zone.uid || '');
        setDivision(device.section.division.uid || '');
        setSection(device.section.uid || '');
        setReadingInterval(device.reading_interval.toString());
        setStartDate(new Date(device.start_date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        setEndDate(new Date(device.end_date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD


      }
    } catch (error) {
      console.error('Error fetching device data:', error);
      toast.error('Failed to fetch device data.');
    } finally {
      setLoading(false); // Reset loading state
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = {
      uid: device.uid,
      imei: imeiNumber,
      section_uid: section,
      km: km,
      lattitude: latitude,
      longitude: longitude,
      mobile_no: mobileNumber,
      location: location,

      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      reading_interval: parseInt(readingInterval),
    };

    try {
      const res = await myIntercepter.put(`${conf.TANK_WLMS}/api/device/${device.uid}`, formData);
      if (res.status === 200) {
        toast.success("Device updated successfully!");
        onClose();
        window.location.reload();
      } else {
        toast.error("Something went wrong while updating the device.");
      }
    } catch (error) {
      console.error('Error saving device:', error);
      toast.error('Failed to update device.');
    }
  };

  const handleReset = () => {
    setImeiNumber('');
    setLocation('');
    setKm('');
    setMobileNumber('');
    setLongitude('');
    setLatitude('');
    setReadingInterval('');
    setStartDate('');
    setEndDate('');


    setZone('');
    setDivision('');
    setSection('');
  };

  return (
    <div className='rounded-md h-fit pb-8'>
      <div className='font-bold uppercase text-xl text-white mb-4'>
        <h2>Update Device <span>#{device.uid}</span></h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
        <TextInput
          label="Km"

          value={km}
          onChange={setKm}
          required
        />
        <TextInput
          label="Location"

          value={location}
          onChange={setLocation}
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
        <TextInput
          label="Longitude"

          value={longitude}
          onChange={setLongitude}
          required
        />
        <TextInput
          label="Latitude"

          value={latitude}
          onChange={setLatitude}
          required
        />
        <SelectInput
          label="Reading Interval"

          value={readingInterval}
          onChange={setReadingInterval}
          options={readingIntervalOptions}
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


        <div className=' md:col-span-2 lg:col-span-3 space-x-8 flex  mt-4  justify-end'>
          <PrimaryButton type="button" onClick={onClose} className='bg-gray-600'>
            Cancel
          </PrimaryButton>
          <PrimaryButton type="submit" >
            {loading ? 'Updating...' : 'Update Device'}
          </PrimaryButton>
        </div>

      </form>
    </div>
  );
};

export default TankWLMSDeviceUpdate;
