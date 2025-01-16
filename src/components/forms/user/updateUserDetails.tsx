import { PrimaryButton } from '@/components/buttons/primarybutton';
import SecondarySelectInput from '@/components/text-fields/SecondarySelectInput';
import TextInput from '@/components/text-fields/TextInput';
import myIntercepter from '@/lib/interceptor';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface UserDetailsFormProps {
    uid:any,
    firstName: any;
    lastName: any;
    contactNo: any;
    email: any;
    role: any;
    designation: any;
    onCancel: () => void;
}


interface UserDetailsFormData {
    uid:string,
    firstname: string;
    lastname: string;
    mobile: string;
    role: string;
    designation: string;
}


const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
    uid,
    firstName,
    lastName,
    contactNo,
    email,
    role,
    designation,
    onCancel
}) => {
    const [firstNameState, setFirstName] = useState(firstName);
    const [lastNameState, setLastName] = useState(lastName);
    const [contactNoState, setContactNo] = useState(contactNo);
    const [emailState, setEmail] = useState(email);
    const [roleState, setRoleState] = useState(role);
    const [designationState, setDesignation] = useState(designation);
    const [roles, setRoles] = useState([]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData: UserDetailsFormData = {
            uid:uid,
            firstname: firstNameState,
            lastname: lastNameState,
            mobile: contactNoState,
            role: roleState,
            designation: designationState,
        };
    

        const res = await myIntercepter.put('/api/user/',formData)
      
        if(res.status===200){
            toast.success("user updated successfully")
            onCancel();
            window.location.reload();
        }
        console.log(res)
        // onSave(formData); // Uncomment this to handle save
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const res = await myIntercepter.get('/api/role');
        setRoles(res.data);
    };

    return (
        <div className="bg-black w-[60vw] ">
            <h2 className="font-bold text-xl pt-2  pb-0 text-white uppercase">Update User</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-8  shadow-md rounded  pt-6 mb-4">
                <div>
                    <TextInput
                        label="First Name"
                        htmlFor="firstName"
                        value={firstNameState}
                        onChange={setFirstName}
                        required
                    />
                </div>
                <div>
                    <TextInput
                        label="Last Name"
                        htmlFor="lastName"
                        value={lastNameState}
                        onChange={setLastName}
                        required
                    />
                </div>
                <div>
                    <TextInput
                        label="Contact No"
                        htmlFor="contactNo"
                        value={contactNoState}
                        onChange={setContactNo}
                        required
                        disabled
                    />
                </div>
                <div>
                    <TextInput
                        label="Email"
                        htmlFor="email"
                        value={emailState}
                        onChange={setEmail}
                        required
                        disabled
                    />
                </div>
                <div>
                    <TextInput
                        label="Designation"
                        htmlFor="designation"
                        value={designationState}
                        onChange={setDesignation}
                        required
                    />
                </div>
                <SecondarySelectInput
                    label="Role"
                    htmlFor="role"
                    value={roleState}
                    onChange={setRoleState}
                    options={roles}
                />
                <div className="flex py-4 md:col-span-2 gap-x-8 justify-end items-end">
                    <PrimaryButton onClick={onCancel}>
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton type="submit">
                        Update
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default UserDetailsForm;
