import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TextInput from '@/components/text-fields/TextInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface AddGroupProps {
    onClose: () => void;
}

const AddGroupForm: React.FC<AddGroupProps> = ({ onClose }) => {

    const [name, setName] = useState('');




    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const formData = {
            name: name,
        };

        try {
            console.log("we have to add transmitter")
            const res = await myIntercepter.post(`${conf.SAATHI_TX}/api/group`, formData);
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

    return (
        <div className='rounded-md h-fit pb-8'>
            <div className='font-bold uppercase text-xl text-white mb-4'>
                <h2>Add Group</h2>
            </div>
            <form onSubmit={handleSubmit} className=" space-y-4">
                <TextInput
                    label="Name"
                    value={name}
                    onChange={setName}
                    required
                />
                <div className='flex items-center w-full lg:col-span-3 mt-4 justify-center xl:justify-end space-x-8'>
                    <PrimaryButton type={'button'} className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
                    <PrimaryButton type={'reset'} className='w-24 text-lg' onClick={() => {
                        setName('');
                    }}>Reset</PrimaryButton>
                    <PrimaryButton type={'submit'} className='w-24 text-lg'>Save</PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default AddGroupForm;
