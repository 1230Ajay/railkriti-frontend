'use client'

import React, { useState } from 'react';
import TextInput from '../text-fields/TextInput';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="  shadow-lg rounded-md space-y-4">
      <TextInput label={'Name'} htmlFor={'name'} value={''} onChange={function (value: string): void {
              throw new Error('Function not implemented.');
          } } />
            <TextInput label={'Email'} htmlFor={'email'} value={''} onChange={function (value: string): void {
              throw new Error('Function not implemented.');
          } } />
      <div>
        <label htmlFor="message" className="block text-sm text-white font-medium ">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 bg-gray-800 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-dark"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
