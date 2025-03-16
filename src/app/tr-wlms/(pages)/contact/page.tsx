

import ContactDetails from "@/components/ContactDetails";
import ContactForm from "@/components/forms/ContactForm";
import NavBar from "@/components/nav/navbar";
import { TrackWlmsMetaData } from "@/lib/data/metaData";
import { Titles } from "@/lib/data/title";
import { Metadata } from "next";

export const metadata: Metadata = new TrackWlmsMetaData().getMetaData().Contact

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
