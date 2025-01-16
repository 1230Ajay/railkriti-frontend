

import ContactDetails from "@/components/ContactDetails";
import ContactForm from "@/components/forms/ContactForm";
import NavBar from "@/components/nav/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact | BR-WLMS',
  description: 'Support Robokriti india private limited for WLMS',
  icons: {
    icon: '/favicon.ico', // Replace with the path to your favicon file
  },
};
const title =[
  { short: 'br', full: 'idge' },
  { short: 'W', full: 'ater' },
  { short: 'L', full: 'evel' },
  { short: 'M', full: 'onitoring' },
  { short: 'S', full: 'ystem' },
];

const Contacts = () => {

  return (
    <div>
      <NavBar title={title}></NavBar>
      <div className="flex  flex-col md:flex-row justify-center   items-center h-[88vh]">
        <div className="bg-black min-w-[720px] flex p-8 rounded-md">
          <div className="w-full md:w-1/2 md:pr-4 mb-8 md:mb-0 h-full">
            <ContactForm />
          </div>

          <div className="w-full md:w-1/2 md:pl-4 h-full">
            <ContactDetails />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
