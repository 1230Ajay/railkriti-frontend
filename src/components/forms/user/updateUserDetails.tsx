import { PrimaryButton } from '@/components/buttons/primarybutton';
import SecondarySelectInput from '@/components/text-fields/SecondarySelectInput';
import TextInput from '@/components/text-fields/TextInput';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface UserDetailsFormProps {
    username:any,
    firstName: any;
    lastName: any;
    contactNo: any;
    email: any;
    role: any;
    designation: any;
    onCancel: () => void;
}


interface UserDetailsFormData {
    identifier:string,
    firstName: string;
    lastName: string;
    mobile: string;
    role: {
        uid:string,
        name:string
    };
    designation: string;
}


const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
    username,
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
        const formData = {
            identifier:username,
            firstName: firstNameState,
            lastName: lastNameState,
            mobile: contactNoState,
            roleId: roleState,
            designation: designationState
        };
    
        const res = await myIntercepter.post(`${conf.API_GATEWAY}/auth/update`,formData);
        if(res.status===200){
            toast.success("user updated successfully")
            onCancel();
            window.location.reload();
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        setRoleState(role.uid);
    }, [role]);

    const fetchRoles = async () => {
        const res = await myIntercepter.get(`${conf.API_GATEWAY}/auth/roles`);
        const roles =  res.data.map((item:any) => ({value: item.uid,role: item.name}));
        setRoles(roles);
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
                        value={designationState.toUpperCase()}
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
