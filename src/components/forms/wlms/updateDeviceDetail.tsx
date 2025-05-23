import React, { useState, useEffect } from 'react';
import TextInput from '../../text-fields/TextInput';
import SelectInput from '../../text-fields/SelectInput';
import DateInput from '../../text-fields/DateInput';
import { PrimaryButton } from '../../buttons/primarybutton';
import { toast } from 'react-toastify';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { useSession } from 'next-auth/react';
import MqttService from '@/lib/network/mqtt_client';

interface DeviceUpdateFormProps {
  device: any;
  onClose: () => void;
}

const DeviceUpdateForm: React.FC<DeviceUpdateFormProps> = ({ device, onClose }) => {
  const [imeiNumber, setImeiNumber] = useState('');
  const [riverName, setRiverName] = useState('');
  const [bridgeNumber, setBridgeNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [zone, setZone] = useState('');
  const [division, setDivision] = useState('');
  const [section, setSection] = useState('');
  const [readingInterval, setReadingInterval] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [railLevel, setRailLevel] = useState('');
  const [dangerLevel, setDangerLevel] = useState('');
  const [sensorLevel, setSensorLevel] = useState('');
  const [dangerInterval, setDangerInterval] = useState('');

  const [zoneOptions, setZoneOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const [syncStatus, setSyncStatus] = useState(false);

  const [readingIntervalOptions, setReadingIntervalOptions] = useState([
    { uid: '15', name: '15 minutes' },
    { uid: '30', name: '30 minutes' },
    { uid: '60', name: '60 minutes' },
  ]);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(false); // Loading state

  const isUserEmp = session?.user?.role === 'user-emp';

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


  useEffect(() => {
    MqttService.subscribe(`device/scmd/brwlms/${device.uid}`);

    const handleMqttMessage = (topic: string, payload: Buffer) => {
      handleMessage(topic, payload.toString())
    }

    MqttService.client.on('message', handleMqttMessage)

    return () => {
      MqttService.client.off('message', handleMqttMessage)
    }
  }, [])


  const handleMessage = (topic: string, message: string) => {
    const topicParts = topic.split('/')
    if (topicParts.length < 4) return

    if (topic.startsWith("device/scmd/brwlms/")) {
      if (message === "true" && !syncStatus) {
        toast.success("Syncronisation Successfly!");
        setSyncStatus(true);
      }
    }

  }


  const fetchDeviceData = async () => {
    setLoading(true); // Set loading state
    try {

      console.log(device);
      if (device) {
        setImeiNumber(device.imei);
        setRiverName(device.river_name);
        setBridgeNumber(device.bridge_no);
        setMobileNumber(device.mobile_no);
        setLongitude(device.longitude);
        setLatitude(device.lattitude);
        setZone(device.section.division.zone.uid || '');
        setDivision(device.section.division.uid || '');
        setSection(device.section.uid || '');
        setReadingInterval(device.reading_interval.toString());
        setStartDate(new Date(device.start_date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        setEndDate(new Date(device.end_date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        setRailLevel(device.rail_level.toString());
        setDangerLevel(device.danger_level.toString());
        setSensorLevel(device.sensor_level.toString());
        setDangerInterval(device.danger_interval.toString());
        setSyncStatus(device?.sync);
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
      bridge_no: bridgeNumber,
      lattitude: latitude,
      longitude: longitude,
      mobile_no: mobileNumber,
      river_name: riverName,
      rail_level: Number(railLevel),
      danger_level: Number(dangerLevel),
      sensor_level: Number(sensorLevel),
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      reading_interval: parseInt(readingInterval),
      danger_interval: parseInt(dangerInterval),
      sync: false
    };

    try {
      const res = await myIntercepter.put(`${conf.BR_WLMS}/api/device/${formData.uid}`, formData);
      if (res.status === 200) {
        setSyncStatus(false);
        const command = `multi_set ` +
          `location -s ${device.river_name}; ` +
          `ifd -s ${device.bridge_no}; ` +
          `rail_level -f ${device.rail_level}; ` +
          `danger_level -f ${device.danger_level}; ` +
          `sensor_level -f ${device.sensor_level}; ` +
          `interval -f ${device.reading_interval}; ` +
          `danger_interval -f ${device.danger_interval};`;

          MqttService.client.publish(`device/cmd/brwlms/${device.uid}`, command);
    
          toast.success("Device updated successfully you data will be updated to device!");


      } else {
        toast.error("Something went wrong while updating the device.");
      }
    } catch (error) {
      console.error('Error saving device:', error);
      toast.error('Failed to update device.');
    }
  };



  return (
    <div className='rounded-md h-fit pb-8'>
      <div className='font-bold uppercase text-xl flex justify-between text-white mb-4'>
        <h2>Update Device <span>#{device.uid}</span></h2>

        <div className='flex'>
          <h2 className={`${syncStatus?" text-green-400":"text-primary"} `} >{syncStatus ? "Synced " : "Syncing...."}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
        <TextInput
          label="Bridge Number"

          value={bridgeNumber}
          onChange={setBridgeNumber}
          required
        />
        <TextInput
          label="River Name"

          value={riverName}
          onChange={setRiverName}
          required
        />
        {
          !isUserEmp ? <>
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
          </> : null
        }
        <SelectInput
          label="Reading Interval"

          value={readingInterval}
          onChange={setReadingInterval}
          options={readingIntervalOptions}
          required
        />



        <TextInput
          label="Rail Level (MSL)"

          value={railLevel}
          onChange={setRailLevel}
          required
        />
        <TextInput
          label="Danger Level (MSL)"

          value={dangerLevel}
          onChange={setDangerLevel}
          required
        />
        <TextInput
          label="Sensor Level (RL)"

          value={sensorLevel}
          onChange={setSensorLevel}
          required
        />
        {
          !isUserEmp ? <>
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
          </> : null
        }


        <SelectInput
          label="Danger Interval"
          value={dangerInterval}
          onChange={setDangerInterval}
          options={readingIntervalOptions}
          required
        />

        <div className='flex items-center w-full lg:col-span-3 mt-4 justify-center xl:justify-end space-x-8'>
          <PrimaryButton type="button" onClick={()=>{
            onClose()
            window.location.reload();
          }} className='bg-gray-600'>
            Close
          </PrimaryButton>
          <PrimaryButton type="submit" >
            {loading ? 'Updating...' : 'Update'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default DeviceUpdateForm;
