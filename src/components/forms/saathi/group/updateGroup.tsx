import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import TextInput from '@/components/text-fields/TextInput';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import conf from '@/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface UpdateGroupFormProp {
    group: any;
    onClose: () => void;
}

const UpdateGroupForm: React.FC<UpdateGroupFormProp> = ({ group, onClose }) => {

    const [name, setName] = useState('');


    useEffect(()=>{
        setName(group.name)
    },[])

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const formData = {
            name: name,
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

    return (
        <div className='rounded-md h-fit pb-8'>
            <div className='font-bold uppercase text-xl text-white mb-4'>
                <h2>Update Device <span>#{group.uid}</span></h2>
            </div>
            <form onSubmit={handleSubmit} className="">
                <TextInput
                    label="Name"
                    htmlFor="name"
                    value={name}
                    onChange={setName}
                    required
                />


                <div className='flex items-center w-full lg:col-span-3 mt-4 justify-center xl:justify-end space-x-8'>
                    <PrimaryButton type={'button'} className='w-24 text-lg' onClick={onClose}>Cancel</PrimaryButton>
                    <PrimaryButton type={'reset'} className='w-24 text-lg' onClick={() => {

      
                        setName('');
     
                    }}>Reset</PrimaryButton>
                    <PrimaryButton type={'submit'} className='w-24 text-lg'>Update</PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default UpdateGroupForm;
