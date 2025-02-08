import conf from '@/lib/conf/conf';
import { io } from 'socket.io-client';
import { getStoredJwt } from '../../../getCoockies';


const socketRailTaap = io(conf.RAILTAAP_SOCKET_URL);

const handleConnect = async () => {
    const jwt = await getStoredJwt();
    socketRailTaap.emit('userConnect', { jwt });
};

const executeHandleConnect = () => {
    let count = 0;

    const intervalId = setInterval(async () => {

        console.log(count);

        if (socketRailTaap.connected) {
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


socketRailTaap.on('connect',executeHandleConnect);



export default socketRailTaap;
