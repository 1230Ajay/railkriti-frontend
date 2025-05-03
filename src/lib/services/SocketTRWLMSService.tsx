// socket.js
import conf from '@/lib/conf/conf';
import { io } from 'socket.io-client';
import { getStoredJwt } from '../../../getCoockies';


const socketTRWLMS = io(conf.TR_WLMS_SOCKET_URL); 


const executeHandleConnect = () => {
    let count = 0;

    const intervalId = setInterval(async () => {
        if (socketTRWLMS.connected) { 
            count++;
            await handleConnect();
            console.log(count);
            if (count === 3) {
                clearInterval(intervalId); 
            }
        } else {
            console.log('Socket not connected, skipping handleConnect');
        }
    }, 5000); 
};


const handleConnect = async () => {
    const jwt = await getStoredJwt();
    socketTRWLMS.emit('userConnect', { jwt });
};

socketTRWLMS.on('connect',executeHandleConnect);

export default socketTRWLMS;
