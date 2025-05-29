import React, { useEffect, useRef, useState } from 'react'
import { PrimaryButton } from '../buttons/primarybutton'
import TextInput from '../text-fields/TextInput'
import { BiSend } from 'react-icons/bi'
import MqttService from '@/lib/network/mqtt_client'
import { toast } from 'react-toastify'
import { IoCloseSharp } from 'react-icons/io5'

interface Chat {
    sender: boolean
    message: string
}

interface ChatPopUpProps {
    device: any
    onClose: () => void
    sendToTopic: string
    subscribeToTopic: string
}

function ChatPopUp({ device, onClose, sendToTopic, subscribeToTopic }: ChatPopUpProps) {
    const [chats, setChats] = useState<Chat[]>([])
    const [message, setMessage] = useState('');
    const [deviceStatus,setDeviceStatus] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setDeviceStatus(device.is_online);
        MqttService.subscribe(`device/status/brwlms/${device.uid}`);
        MqttService.subscribe(`device/scmd/brwlms/${device.uid}`);

        const handleMqttMessage = (topic: string, payload: Buffer) => {
            handleMessage(topic, payload.toString())
        }

        MqttService.client.on('message', handleMqttMessage)

        return () => {
            MqttService.client.off('message', handleMqttMessage)
        }
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chats])

    const handleMessage = (topic: string, message: string) => {
        const topicParts = topic.split('/')
        if (topicParts.length < 4) return

        if (topic.startsWith('device/status/brwlms/')) {

            if (message === 'online') {
              setDeviceStatus(true);
              return;
            } else if (message === 'offline') {
              setDeviceStatus(false);
              return;
            }
          }
          

        if (topic.startsWith(subscribeToTopic)) {
            const newChat: Chat = { sender: false, message }
            setChats(prev => [...prev, newChat])
            setDeviceStatus(true);
        }
    }

    const handleSend = () => {
        if (!message.trim()) return
        
        const newChat: Chat = { sender: true, message }
        setChats(prev => [...prev, newChat])
       
            MqttService.client.publish(`${sendToTopic}/${device.uid}`, message)
            setMessage('')

        if(!deviceStatus){
           toast.info("Device is oflline please wait for it!");
        }
     
    }

    return (
        <div className='text-white py-3'>
            <div className='flex justify-between mb-2'>
                <div>
                <h2 className='text-xl font-semibold'>{device.river_name} ({device.bridge_no})</h2>
                <p className={` text-sm font-thin ${deviceStatus?'text-green-400':'text-gray-400'}`}>{deviceStatus?"Online":"Offline"}</p>
                </div>
                <button
                    onClick={onClose}
                    className='h-full bg-gray-800 px-3 py-2 mb-2 rounded-md text-white'
                >
                    <IoCloseSharp  size={20} />
                </button>
            </div>
            <div className='h-[1px] bg-gray-800 mb-2'>

            </div>
            <div className='h-[60vh] overflow-auto no-scrollbar space-y-2 mb-4  flex flex-col'>
                {chats.map((chat, index) => (
                    <div
                        key={index}
                        className={`max-w-[70%] p-2 rounded-md whitespace-pre-wrap ${chat.sender
                                ? 'bg-blue-700 self-end text-right'
                                : 'bg-gray-700 self-start text-left'
                            }`}
                    >
                        {chat.message}
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>


            <div className='flex items-center gap-2'>
                <TextInput
                    className='w-full'
                    label=''
                    value={message}
                    placeHolder='Type Command'
                    onChange={setMessage}
                />
                <button
                    onClick={handleSend}
                    className='h-full bg-gray-800 px-3 py-2 mb-2 rounded-md text-white'
                >
                    <BiSend size={20} />
                </button>
            </div>
        </div>
    )
}

export default ChatPopUp
