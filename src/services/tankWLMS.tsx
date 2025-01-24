import conf from '@/conf/conf';
import { io } from 'socket.io-client';
import { getStoredJwt } from '../../getCoockies';

const tankWLMS = io(conf.TANK_WLMS_SOCKET_URL); 


const handleConnect = async () => {
    const jwt = await getStoredJwt();
    tankWLMS.emit('userConnect', { jwt });
};

const executeHandleConnect = () => {
    let count = 0;

    const intervalId = setInterval(async () => {

        console.log(count);

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
