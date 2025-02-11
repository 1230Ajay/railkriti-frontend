import conf from '@/lib/conf/conf';
import { io } from 'socket.io-client';
import { getStoredJwt } from '../../../getCoockies';


const tankWLMS = io(conf.TANK_WLMS_SOCKET_URL); 


const handleConnect = async () => {
    const jwt = await getStoredJwt();
    console.log("connecting to server as user........")
    tankWLMS.emit('userConnect', { jwt });
};

const executeHandleConnect = () => {
    let count = 0;
    const intervalId = setInterval(async () => {

        if (tankWLMS.connected) {
            count++;
            await handleConnect();

            if (count === 3) {
                clearInterval(intervalId);
            }
        } else {
            console.log('Socket not connected, skipping handleConnect');
        }
    }, 5000);
};


tankWLMS.on('connect',executeHandleConnect);

export default tankWLMS;
