import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import TextInput from '@/components/text-fields/TextInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import SelectInput from '@/components/text-fields/SelectInput';
import { InstalledAt } from '@/app/saathi/emums/enum.installed.at';

interface UpdateGroupFormProp {
    group: any;
    onClose: () => void;
}

const UpdateGroupForm: React.FC<UpdateGroupFormProp> = ({ group, onClose }) => {
    const [name, setName] = useState('');
    const [zoneOptions, setZoneOptions] = useState([]);
    const [divisionOptions, setDivisionOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [installedAt, setInstalledAt] = useState<InstalledAt>(InstalledAt.TRACK);
    const [section, setSection] = useState('');
    const [zone, setZone] = useState('');
    const [division, setDivision] = useState('');
    const [disable_duration, setDisableDuration] = useState(5);

    // Convert enum to options for SelectInput
    const installedAtOptions = Object.keys(InstalledAt)
        .filter(key => isNaN(Number(key))) // Filter out numeric keys
        .map(key => ({
            uid: InstalledAt[key as keyof typeof InstalledAt],
            name: key
        }));


    const disableDurationOptions = [{
        name: "5 Minute",
        uid: 5,
    },
    {
        name: "10 Minute",
        uid: 10,
    },
    {
        name: "15 Minute",
        uid: 15,
    }
    ]
    useEffect(() => {
        setName(group.name)
        setZone(group.section.division.zone.uid);
        setDivision(group.section.division.uid);
        setSection(group.section.uid);
        setDisableDuration(group.disable_duration);
    }, [])

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const formData = {
            name: name,
            section_uid: section,
            installed_at: installedAt,
            disable_duration:Number(disable_duration),
        };

        try {

            const res = await myIntercepter.put(`${conf.SAATHI_TX}/api/group/${group.uid}`, formData);
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

    };


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

    return (
        <div className='rounded-md h-fit pb-8'>
            <div className='font-bold uppercase text-xl text-white mb-4'>
                <h2>Update Group <span>#{group.uid}</span></h2>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
                <TextInput
                    label="Name"

                    value={name}
                    onChange={setName}
                    required
                />

                <SelectInput
                    label="Installed At"
                    value={installedAt}
                    onChange={setInstalledAt}
                    options={installedAtOptions}
                    required={true}
                />

                <SelectInput
                    label="Disable Duration"
                    value={disable_duration}
                    onChange={setDisableDuration}
                    options={disableDurationOptions}
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

                <div className='flex items-center w-full lg:col-span-3 mt-4 justify-center xl:justify-end space-x-8'>
                    <PrimaryButton type={'button'} className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
                    <PrimaryButton type={'submit'} className='w-24 text-lg'>Update</PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default UpdateGroupForm;
