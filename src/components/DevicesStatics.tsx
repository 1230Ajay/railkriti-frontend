import React from 'react';
import CountUp from 'react-countup';
import { HiOutlineDeviceMobile } from "react-icons/hi";
import { IoCallSharp } from "react-icons/io5";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface DevicesStaticsProps {
  totalDevices: number;
  activeDevices: number;
  onlineDevices: number;
  offlineDevices: number;
}

const DevicesStatics : React.FC<DevicesStaticsProps> = ({ totalDevices, activeDevices, onlineDevices, offlineDevices }) => {
  const devicesStaticsData = [
    {
      "title": "Total Devices",
      "icon": <HiOutlineDeviceMobile />,
      "value": totalDevices
    },
    {
      "title": "Active Devices",
      "icon": <IoCallSharp />,
      "value": activeDevices
    },
    {
      "title": "Online Devices",
      "icon": <RiEyeLine />,
      "value": onlineDevices
    },
    {
      "title": "Offline Devices",
      "icon": <RiEyeOffLine />,
      "value": offlineDevices
    },
  ];

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4 rounded-md py-4 bg-black px-4 mx-4'>
      {devicesStaticsData.map((statics, index) => (
        <div key={index} className='w-full h-24 rounded-sm justify-between border border-primary flex items-center gap-4 px-4 text-end'>
          <div className='text-3xl p-4 text-white bg-primary rounded-full'>
            {statics.icon}
          </div>
          <div>
            <h2 className='font-bold text-3xl text-white'>
              <CountUp start={0} end={statics.value} duration={4.5} />
            </h2>
            <p className='text-sm text-gray-400 font-bold'>
              {statics.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DevicesStatics;
