import React, { useEffect, useState } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { toast } from 'react-toastify';
import TextInput from '@/components/text-fields/TextInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface TRWLMSAlertEntry {
    uid: string;
    second_alert: string | number | Date;
    first_alert: string | number | Date;
    device_uid: string;
    designation: string;
    mobile: string;
    email: string;
    sms_update?: boolean;
    email_update?: boolean;
    isActive: boolean;
    device: any;
}

interface TimePickerProps {
    value: string;
    onChange: (value: string | null) => void;
}

const CustomTimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    return (
        <TimePicker
            onChange={onChange}
            value={value}
            disableClock={true}  // Disables the clock view to prevent manual input
            className="w-full text-white bg-gray-800 rounded-md"
            clearIcon={null}     // Hides the clear icon
        />
    );
};


interface UpdateAlertProps {
    onClose: () => void;  // Define onClose as a function that returns void
    showRx: boolean;     
    alertData:any // Define showRx as a boolean
  }

const UpdateAlert:React.FC<UpdateAlertProps> = ({ onClose = () => { }, alertData , showRx }) => {

    const [name, setName] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [smsChecked, setSmsChecked] = useState<boolean>(false);
    const [emailChecked, setEmailChecked] = useState<boolean>(false);
    const [time, setTime] = useState<string[]>([]);
    const [device_uid, setDeviceId] = useState<string>('');
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deviceAlerts, setDeviceAlerts] = useState<TRWLMSAlertEntry[]>([]);
    const uid = alertData!.uid;
    const alertDates = [alertData!.first_alert, alertData!.second_alert];

    useEffect(() => {
        fetchDevices();
    }, []);

    useEffect(() => {
        if (alertData) {
            setName(alertData.designation);
            setMobileNumber(alertData.mobile);
            setEmail(alertData.email);
            setSmsChecked(alertData.sms_update!);
            setEmailChecked(alertData.email_update!);
            setDeviceId(alertData.device_uid);
            if (alertData.first_alert) {
                setTime([new Date(alertData.first_alert).toLocaleTimeString()]);
            }
            if (alertData.second_alert) {
                setTime(prevTime => [...prevTime, new Date(alertData.second_alert).toLocaleTimeString()]);
            }
        }
    }, [alertData]);

    useEffect(() => {
        if (device_uid) {
            fetchAlertsForDevice(device_uid);
        }
    }, [device_uid]);

    const fetchDevices = async () => {
        try {
            const response = await fetch('/api/device');
            const data = await response.json();
            setDevices(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching devices:', error);
            setLoading(false);
        }
    };

    const fetchAlertsForDevice = async (deviceId: string) => {
        try {
            const response = await myIntercepter.get(`/api/alerts?device_uid=${deviceId}`);
            setDeviceAlerts(response.data);
        } catch (error) {
            console.error('Error fetching alerts for device:', error);
        }
    };




    const handleSubmit = async () => {
        try {

            const alertData = {
                designation: name,
                mobile: mobileNumber,
                email: email,
                device_uid: device_uid,
                email_update: emailChecked,
                sms_update: smsChecked,
            };

            const route = showRx ? conf.SAATHI_RX : conf.SAATHI_TX;
        
            const response = await myIntercepter.put(`${route}/api/alerts/${uid}`, alertData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                toast.success("Alert Updated Successfully");
                console.log('Alert updated successfully');
                window.location.reload();
                onClose();
            } else {
                toast.error('Failed to update alert');
                console.error('Failed to update alert');
            }
        } catch (error) {
            toast.error('Error updating alert');
            console.error('Error updating alert:', error);
        }
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm('Are you sure you want to delete this alert?');
        if (!isConfirmed) {
            return;
        }

        try {
            const response = await myIntercepter.delete(`/api/alerts/${uid}`);

            if (response.status === 200) {
                toast.success("Alert Deleted Successfully");
                console.log('Alert deleted successfully');
                window.location.reload();
                onClose();
            } else {
                toast.error('Failed to delete alert');
                console.error('Failed to delete alert');
            }
        } catch (error) {
            toast.error('Error deleting alert');
            console.error('Error deleting alert:', error);
        }
    };

    return (
        <div className="rounded-md relative pt-2">
            <div className="font-bold uppercase text-xl text-white mb-4">
                <h2>Update Alert</h2>
            </div>
            <div className='flex w-full'>
                <div className='w-full'>
                    <form className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
                        <div className="flex items-center mb-4 absolute right-2 text-xs top-3">
                            <label className=" text-white flex gap-x-1 items-center  mr-4 ">
                                <input
                                    type="checkbox"
                                    checked={smsChecked}
                                    onChange={(e) => setSmsChecked(e.target.checked)}
                                />
                                SMS
                            </label>
                            <label className="flex items-center gap-x-1 text-white ">
                                <input
                                    type="checkbox"
                                    checked={emailChecked}
                                    onChange={(e) => setEmailChecked(e.target.checked)}
                                />
                                Email
                            </label>
                        </div>
                        <div className={`mb-4`}>
                            <label htmlFor={'device'} className="block text-white font-bold mb-2">Device<span className='text-primary'>*</span></label>
                            <div className='bg-gray-800 text-white py-1 rounded-md pr-2'>
                                <select
                                    id={'device'}
                                    name={'device'}
                                    value={device_uid}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    className="w-full border-none text-gray-400 capitalize bg-gray-800 px-2 shadow-sm"
                                    disabled
                                >
                                    <option value=""> {`${alertData.device.name})`}</option>
                                    {devices.map(device => (
                                        <option key={device.uid} className='text-white capitalize' value={device.uid}>
                                            {`${device.name}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>




                        <div></div>
                        <div></div>

                        <TextInput
                            label="Designation"
                            htmlFor="designation"
                            value={name}
                            onChange={setName}
                            required
                        />
                        <TextInput
                            label="Mobile No"
                            htmlFor="mobileNumber"
                            value={mobileNumber}
                            onChange={setMobileNumber}
                            required
                        />
                        <TextInput
                            label="Email"
                            htmlFor="email"
                            value={email}
                            onChange={setEmail}
                            required
                        />
                    </form>
                </div>

            </div>
            <div className=' w-full flex justify-end gap-x-4 py-4'>
                <PrimaryButton onClick={onClose} >Cancel</PrimaryButton>
                <PrimaryButton onClick={handleDelete} >Delete</PrimaryButton>
                <PrimaryButton onClick={handleSubmit} >Update</PrimaryButton>
            </div>
        </div>
    );
}

export default UpdateAlert;
