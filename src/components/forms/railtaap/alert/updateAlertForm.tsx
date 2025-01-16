import React, { useEffect, useState } from 'react';
import { MdOutlineAddCircle } from 'react-icons/md';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { toast } from 'react-toastify';
import TextInput from '@/components/text-fields/TextInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface AlertEntry {
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
  
const UpdateAlertForm = ({ onClose = () => { }, alertData }: { onClose?: () => void, alertData?: any }) => {
    const [riverName, setRiverName] = useState<string>(alertData!.device.river_name);
    const [bridgeNumber, setBridgeNumber] = useState<string>(alertData!.device.bridge_no);
    const [name, setName] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [smsChecked, setSmsChecked] = useState<boolean>(false);
    const [emailChecked, setEmailChecked] = useState<boolean>(false);
    const [time, setTime] = useState<string[]>([]);
    const [device_id, setDeviceId] = useState<string>('');
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deviceAlerts, setDeviceAlerts] = useState<AlertEntry[]>([]);
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
        if (device_id) {
            fetchAlertsForDevice(device_id);
        }
    }, [device_id]);

    const fetchDevices = async () => {
        try {
            const response = await fetch(`${conf.BR_WLMS}/api/device`);
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
            const response = await myIntercepter.get(`${conf.BR_WLMS}/api/alerts?device_uid=${deviceId}`);
            setDeviceAlerts(response.data);
        } catch (error) {
            console.error('Error fetching alerts for device:', error);
        }
    };

    const handleAddTimeField = () => {
        if (time.length < 2) {
            setTime([...time, '10:00']);
        }
    };

    const handleTimeChange = (index: number, value: string | null) => {
        if (value) {
            const newTimes = [...time];
            newTimes[index] = value;
            setTime(newTimes);
        }
    };

    const convertTimesToUTC = (timeStrings: string[], alertDates: (string | number | Date)[]) => {
        return timeStrings.map((timeString, index) => {
            const [hours, minutes] = timeString.split(':').map(Number);
            const date = new Date(alertDates[index]);
            date.setHours(hours, minutes, 0, 0);
            return date.toISOString();
        });
    };

    const handleSubmit = async () => {
        try {
            const [firstAlertTime, secondAlertTime] = convertTimesToUTC(time, alertDates);

            const alertData = {
                uid: uid,
                designation: name,
                mobile: mobileNumber,
                email: email,
                first_alert: firstAlertTime || null,
                second_alert: secondAlertTime || null,
                device_uid: device_id,
                email_update: emailChecked,
                sms_update: smsChecked,
            };

            const response = await myIntercepter.put(`${conf.BR_WLMS}/api/alerts`, alertData, {
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
            const response = await myIntercepter.delete(`${conf.BR_WLMS}/api/alerts/${uid}`);

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
                                    value={device_id}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    className="w-full border-none text-gray-400 capitalize bg-gray-800 px-2 shadow-sm"
                                    disabled
                                >
                                    <option value="">Select Device</option>
                                    {devices.map(device => (
                                        <option key={device.uid} className='text-white capitalize' value={device.uid}>
                                            {`${device.river_name} (${device.bridge_no})`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='flex w-full justify-between items-end h-full'>
                            {time.map((t, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-4 text-white">
                                    <div className="flex-1 text-white">
                                        <CustomTimePicker
                                            value={t}
                                            onChange={(value) => handleTimeChange(index, value)}
                                        />
                                    </div>
                                    {time.length < 2 && index === time.length - 1 && (
                                        <button
                                            type="button"
                                            className="text-2xl bg-primary w-fit h-fit p-1 rounded-md text-white text-center"
                                            onClick={handleAddTimeField}
                                            style={{ color: 'red' }}
                                        >
                                            <MdOutlineAddCircle className='text-white' />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
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

export default UpdateAlertForm;
