

import ContactDetails from "@/components/ContactDetails";
import ContactForm from "@/components/forms/ContactForm";
import { BrWlmsMetaData } from "@/lib/data/metaData";
import { Metadata } from "next";
export const metadata: Metadata = new BrWlmsMetaData().getMetaData().Contact;

const Contacts = () => {

  return (
    <div>
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
