import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactDetails: React.FC = () => {
  return (
    <div className=" h-full text-white  shadow-lg rounded-md space-y-4">
      <h2 className="text-2xl font-bold text-primary">Contact Details</h2>

      <h2>Robokriti India pvt. Ltd.</h2>
      
      <div className="flex items-center space-x-4">
        <FaMapMarkerAlt className="text-primary text-2xl" />
        <p>235 (1st floor), Phase 4, Star City Katangi Road, Karmeta Jabalpur 482002, Madhya Pradesh , India</p>
      </div>
      <div className="flex items-center space-x-4">
        <FaPhone className="text-primary text-2xl" />
        <p>+91 958-477-9663</p>
      </div>
      <div className="flex items-center space-x-4">
        <FaEnvelope className="text-primary text-2xl" />
        <p>info@robokriti.com</p>
      </div>
    </div>
  );
};

export default ContactDetails;
