import React, { useState, useEffect } from 'react';
import TextInput from '../../text-fields/TextInput';
import SelectInput from '../../text-fields/SelectInput';
import DateInput from '../../text-fields/DateInput';
import { PrimaryButton } from '../../buttons/primarybutton';
import { toast } from 'react-toastify';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface SaathiDeviceUpdateFormProps {
    isTransmitter: boolean
    device: any;
    onClose: () => void;
}

const SaathiDeviceUpdateForm: React.FC<SaathiDeviceUpdateFormProps> = ({ isTransmitter, device, onClose }) => {
    const [imeiNumber, setImeiNumber] = useState('');
    const [name, setName] = useState('');
    const [km, setKm] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [longitude, setLongitude] = useState('');
    const [zone, setZone] = useState('');
    const [division, setDivision] = useState('');
    const [group, setGroup] = useState('')
    const [section, setSection] = useState('');
    const [lattitude, setlattitude] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [direction, setDirection] = useState('');
    const [deviceType, setDeviceType] = useState<any>(isTransmitter ? "true" : "false")
    const [systemType, setSystemType] = useState<any>("true")
    const [installedAt, setInstalledAt] = useState<any>("TRACK")
    const [groupOptions, setGroupOptions] = useState([])
    const [zoneOptions, setZoneOptions] = useState([]);
    const [divisionOptions, setDivisionOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [isOnSingle,setIsOnSingle] = useState('');

    useEffect(() => {
        fetchZones();
        fetchGroups();
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


    const fetchGroups = async () => {
        try {

            const res = await myIntercepter.get(`${conf.SAATHI_TX}/api/group`);


            const transformedData = res.data.map((group: { uid: string; name: any; }) => ({
                uid: group.uid,  // Set the condition for uid
                value: group.uid,  // Set the condition for value
                name: group.name
            }));
            setGroupOptions(transformedData);
        } catch (error) {

        }
    }

    useEffect(() => {
        if (device) {
            setImeiNumber(device.imei);
            setName(device.name);
            setGroup(device.group_uid);
            setKm(device.km);
            setMobileNumber(device.mobile_no);
            setLongitude(device.longitude);
            setDirection(device.isUpside ? "true" : "false")
            setlattitude(device.lattitude)
            setSystemType(device.is_fixed.toString());
            setZone(device.section.division.zone.uid);
            setDivision(device.section.division.uid);
            setSection(device.section.uid);
            setStartDate(new Date(device.start_date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
            setEndDate(new Date(device.end_date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
            setInstalledAt(device.installed_at);
            setIsOnSingle(device.is_single_line? "true" : "false");
     
        }
    }, [device]);

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

        const formDataTx = {
            uid: device.uid,
            imei: imeiNumber,
            section_uid: section,
            group_uid: group,
            lattitude: lattitude,
            longitude: longitude,
            mobile_no: mobileNumber,
            name: name,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            is_fixed: systemType === "true" ? true : false,
            isUpside: direction === "true" ? true : false,
            installed_at:installedAt,
            is_single_line:isOnSingle ==="true"?true:false

        };

        const formDataRx = {
            uid: device.uid,
            imei: imeiNumber,
            section_uid: section,
            group_uid: group,
            lattitude: lattitude,
            longitude: longitude,
            mobile_no: mobileNumber,
            name: name,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            is_fixed: systemType === "true" ? true : false,
            installed_at:installedAt

        };

        console.log(deviceType)

        if (deviceType === "true") {

            try {
                console.log("we have to add transmitter")
                const res = await myIntercepter.put(`${conf.SAATHI_TX}/api/device/${formDataTx.uid}`, formDataTx);
                if (res.status === 200) {
                    toast.success("Device added succesfully!");
                    window.location.reload();
                } else {
                    toast.error("Smothing went wrong, while registering device");
                }
                onClose();
            } catch (error) {
                console.error('Error saving device:', error);
            }
        } else {
            try {
                console.log("we have to add transmitter")
                const res = await myIntercepter.put(`${conf.SAATHI_RX}/api/device/${formDataRx.uid}`, formDataRx);
                if (res.status === 200) {
                    toast.success("Device added succesfully!");
                    window.location.reload();
                } else {
                    toast.error("Smothing went wrong, while registering device");
                }
                onClose();
            } catch (error) {
                console.error('Error saving device:', error);
            }
        }
    };

    return (
        <div className='rounded-md h-fit pb-8'>
            <div className='font-bold uppercase text-xl text-white mb-4'>
                <h2>Update Device <span>#{device.uid}</span></h2>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
                <TextInput
                    label="Name"
             
                    value={name}
                    onChange={setName}
                    required
                />
                <SelectInput
                    label="Group"
     
                    value={group}
                    onChange={setGroup}
                    options={groupOptions}
                    required={true}
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
        
                    value={zone}
                    onChange={setZone}
                    options={zoneOptions}
                    required={true}
                />
                <SelectInput
                    label="Division"
            
                    value={division}
                    onChange={setDivision}
                    options={divisionOptions}
                    required={true}
                />
                <SelectInput
                    label="Section"
           
                    value={section}
                    onChange={setSection}
                    options={sectionOptions}
                    required={true}
                />

                <TextInput
                    label="Lattitude"
           
                    value={lattitude}
                    onChange={setlattitude}
                    required
                />

                <TextInput
                    label="Longitude"
            
                    value={longitude}
                    onChange={setLongitude}
                    required
                />



                <TextInput
                    label="DeviceType"
                    value={deviceType === "true" ? "Transmitter" : "Reciever"}
                    onChange={() => setDeviceType(deviceType)}
                    required={true}
                    disabled
                />



                <SelectInput
                    label="SystemType"
    
                    value={systemType}
                    onChange={setSystemType}
                    options={[{ uid: true, value: true, name: "Fixed" }, { uid: false, value: false, name: "Mobile" }]}
                    required={true}

                />

                <SelectInput
                    label="InstalledAt"
             
                    value={installedAt}
                    onChange={setInstalledAt}
                    options={[{ uid: "BRIDGE", value: "BRIDGE", name: "Bridge" }, { uid: "CROSSING", value: "CROSSING", name: "Crossing" }, { uid: "TRACK", value: "TRACK", name: "Track" }]}
                    required={true}
                />

                {
                    deviceType === "true" ? <SelectInput
                        label="Direction"
    
                        value={direction}
                        onChange={setDirection}
                        options={[{ uid: true, value: true, name: "UP" }, { uid: false, value: false, name: "DOWN" }]}
                        required={true}
                    /> : <div></div>
                }

                <SelectInput
                    label="Line"
    
                    value={isOnSingle}
                    onChange={setIsOnSingle}
                    options={[{ uid: true, value: true, name: "Single" }, { uid: false, value: false, name: "double" }]}
                    required={true}
                />



                <div className=' md:col-span-2 lg:col-span-3 space-x-8 flex  mt-4  justify-end'>
                    <PrimaryButton type={'button'} className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
                    <PrimaryButton type={'submit'} className='w-24 text-lg'>Update</PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default SaathiDeviceUpdateForm;
