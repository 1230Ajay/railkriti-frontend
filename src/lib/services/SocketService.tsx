// socket.js
import conf from '@/lib/conf/conf';
import { io } from 'socket.io-client';
import { getStoredJwt } from '../../../getCoockies';


const socketWLMS = io(conf.BR_WLMS_SOCKET_URL);

const handleConnect = async () => {
    const jwt = await getStoredJwt();
    socketWLMS.emit('userConnect', { jwt });
};

const executeHandleConnect = () => {
    let count = 0;
    
    const intervalId = setInterval(async () => {
        if (socketWLMS.connected) {
            count++;
            await handleConnect();
            console.log('count is : ',count);
            if (count === 3) {
                clearInterval(intervalId);
            }
        } else {
            console.log('Socket not connected, skipping handleConnect');
        }
    }, 5000);
};


socketWLMS.on('connect',executeHandleConnect);

export default socketWLMS;
