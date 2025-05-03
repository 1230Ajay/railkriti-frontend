import { PrimaryButton } from '@/components/buttons/primarybutton';
import MultiSelectInput from '@/components/text-fields/MultiSelectInput';
import SecondarySelectInput from '@/components/text-fields/SecondarySelectInput';
import SelectInput from '@/components/text-fields/SelectInput';
import TextInput from '@/components/text-fields/TextInput';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface UserDetailsFormProps {
    username: any,
    firstName: any;
    lastName: any;
    contactNo: any;
    email: any;
    role: any;
    zone_uid: any,
    division_uid: any;
    allotedSections: any;
    designation: any;
    onCancel: () => void;
}





const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
    username,
    firstName,
    lastName,
    contactNo,
    email,
    role,
    designation,
    zone_uid,
    division_uid,
    allotedSections,
    onCancel
}) => {
    const [firstNameState, setFirstName] = useState(firstName);
    const [lastNameState, setLastName] = useState(lastName);
    const [contactNoState, setContactNo] = useState(contactNo);
    const [emailState, setEmail] = useState(email);
    const [roleState, setRoleState] = useState(role);
    const [designationState, setDesignation] = useState(designation);
    const [roles, setRoles] = useState([]);



    const [zone, setZone] = useState(zone_uid || "");
    const [division, setDivision] = useState(division_uid || "");
    const [sections_uid, setSections] = useState<string[]>([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [divisionOptions, setDivisionOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);


    useEffect(() => {
        const fetchZones = async () => {
            try {
                const zones = await myIntercepter.get(`${conf.LOCATION}/api/zone`);
                setZoneOptions(zones.data);
            } catch (error) {
                console.error('Error fetching zones:', error);
            }
        };
        fetchZones();
    }, []);

    // Fetch divisions based on selected zone
    useEffect(() => {
        const fetchDivisions = async () => {
            if (zone) {
                try {
                    const response = await myIntercepter.get(`${conf.LOCATION}/api/zone/${zone}`);
                    setDivisionOptions(response.data.divisions);
                } catch (error) {
                    console.error('Error fetching divisions:', error);
                }
            }
        };
        fetchDivisions();
    }, [zone]);


    useEffect(() => {
        const fetchSections = async () => {
            if (division_uid) {
                try {
                    const response = await myIntercepter.get(`${conf.LOCATION}/api/division/${division_uid}`);
                    
                    // Only set initial sections if they are not already set
                    if (sections_uid.length === 0) {
                        const selectedSections = response.data.sections
                            .filter((section: any) => allotedSections.includes(section.uid))
                            .map((section: any) => section.uid);
                        
                        setSections(selectedSections);
                    }
    
                    setSectionOptions(response.data.sections);
                } catch (error) {
                    console.error("Error fetching sections:", error);
                }
            }
        };
    
        fetchSections();
    }, [division_uid]); 
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            identifier: username,
            firstName: firstNameState,
            lastName: lastNameState,
            mobile: contactNoState,
            roleId: roleState,
            designation: designationState,
            zone_uid: zone,
            division_uid: division,
            ...(role.name !== "admin" && {
                allotedSections: sections_uid
            }),
        };

        const res = await myIntercepter.post(`${conf.API_GATEWAY}/auth/update`, formData);
        if (res.status === 200) {
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
        const roles = res.data.map((item: any) => ({ value: item.uid, role: item.name }));
        setRoles(roles);
    };

    const handleZoneChange = async (selectedZoneUid: React.SetStateAction<string>) => {
        const selectedZone = zoneOptions.find((zone: any) => zone.uid === selectedZoneUid);
        setZone(selectedZoneUid);
        setDivision(''); // Reset division when zone changes
        const response = await myIntercepter.get(`${conf.LOCATION}/api/sections/zone/${selectedZoneUid}`);
        await setSections(response.data);
    };

    const handleDivisionChange = async (selectedDivision: string) => {
        setSectionOptions([]); // Clear previous section options
        setSections([]); // Clear previous selected sections
        setDivision(selectedDivision); // Set new division
    
        try {
            const response = await myIntercepter.get(`${conf.LOCATION}/api/sections/division/${selectedDivision}`);
            const uids = response.data.map((section: any) => section.uid);
            setSectionOptions(response.data);
            setSections(uids);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };
    

    return (
        <div className="bg-black w-[60vw] ">
            <h2 className="font-bold text-xl pt-2  pb-0 text-white uppercase">Update User</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-8  shadow-md rounded  pt-6 mb-4">
                <div>
                    <TextInput
                        label="First Name"
                  
                        value={firstNameState}
                        onChange={setFirstName}
                        required
                    />
                </div>
                <div>
                    <TextInput
                        label="Last Name"
                 
                        value={lastNameState}
                        onChange={setLastName}
                        required
                    />
                </div>
                <div>
                    <TextInput
                        label="Contact No"
                      
                        value={contactNoState}
                        onChange={setContactNo}
                        required
                        disabled
                    />
                </div>
                <div>
                    <TextInput
                        label="Email"
           
                        value={emailState}
                        onChange={setEmail}
                        required
                        disabled
                    />
                </div>
                <div>
                    <TextInput
                        label="Designation"
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


                {role.name !== "admin" && (
                    <SelectInput
                        label="Zone"
                        value={zone}
                        onChange={handleZoneChange}
                        options={zoneOptions}

                    />
                )}

                {role.name !== "admin" && (<SelectInput
                    label="Division"
          
                    value={division}
                    onChange={handleDivisionChange}
                    options={divisionOptions}
                />)}


                {role.name !== "admin" && (
                    <MultiSelectInput
                        label="Sections"
                        htmlFor="sections"
                        value={sections_uid}
                        onChange={(sections)=>{
                            setSections(sections);
                        }}
                        options={sectionOptions}
                    />
                )}


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
