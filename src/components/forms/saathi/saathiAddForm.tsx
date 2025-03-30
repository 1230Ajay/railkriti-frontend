import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TextInput from '@/components/text-fields/TextInput';
import SelectInput from '@/components/text-fields/SelectInput';
import DateInput from '@/components/text-fields/DateInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';



const SaathiDeviceReservationForm = ({ onClose = () => { } }) => {

    const [imeiNumber, setImeiNumber] = useState('');
    const [name, setName] = useState('');
    const [km, setKm] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [longitude, setLongitude] = useState('');

    const [group, setGroup] = useState('')

    const [lattitude, setlattitude] = useState('');

    const [Direction, setDirection] = useState("true");
    const [deviceType, setDeviceType] = useState<any>("true")
    const [systemType, setSystemType] = useState<any>("true")
    // device static fields
    const [installedAt, setInstalledAt] = useState<any>("TRACK")

    const [groupOptions, setGroupOptions] = useState([])

    const [isOnSingle, setIsOnSingle] = useState('false');

    useEffect(() => {
        fetchGroups();
    }, []);



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



    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const formDataTx = {

            imei: imeiNumber,
            group_uid: group,
            lattitude: lattitude,
            longitude: longitude,
            mobile_no: mobileNumber,
            name: name,

            is_fixed: systemType === "true" ? true : false,
            isUpside: Direction === "true" ? true : false,
            installed_at: installedAt,
            is_single_line: isOnSingle === "true" ? true : false

        };

        const formDataRx = {

            imei: imeiNumber,
            group_uid: group,
            lattitude: lattitude,
            longitude: longitude,
            mobile_no: mobileNumber,
            name: name,
            is_fixed: systemType === "true" ? true : false,


        };

        console.log(deviceType)

        if (deviceType === "true") {

            try {
                console.log("we have to add transmitter")
                const res = await myIntercepter.post(`${conf.SAATHI_TX}/api/device`, formDataTx);
                if (res.status === 201) {
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
                const res = await myIntercepter.post(`${conf.SAATHI_RX}/api/device`, formDataRx);
                if (res.status === 201) {
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
                <h2>Add Device</h2>
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



                <SelectInput
                    label="DeviceType"
                    value={deviceType}
                    onChange={setDeviceType}
                    options={[{ uid: true, value: true, name: "Transmitter" }, { uid: false, value: false, name: "Reciever" }]}
                    required={true}
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
                        value={Direction}
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



                <div className='flex items-center w-full lg:col-span-3 mt-4 justify-center xl:justify-end space-x-8'>
                    <PrimaryButton type={'button'} className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
                    <PrimaryButton type={'reset'} className='w-24 text-lg' onClick={() => {

                        setImeiNumber('');
                        setName('');
                        setKm('');
                        setMobileNumber('');
                        setLongitude('');
                        setlattitude('');

                    }}>Reset</PrimaryButton>
                    <PrimaryButton type={'submit'} className='w-24 text-lg'>Save</PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default SaathiDeviceReservationForm;
