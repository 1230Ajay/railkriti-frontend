import conf from '@/lib/conf/conf';
import { io } from 'socket.io-client';
import { getStoredJwt } from '../../../getCoockies';

const socketSaathiRx = io(conf.SAATHI_RX_SOCKET_URL); 


const handleConnect = async () => {
    const jwt = await getStoredJwt();
    socketSaathiRx.emit('userConnect', { jwt });
};

const executeHandleConnect = () => {
    console.log("connected rx");
    let count = 0;
    
    console.log("count is : ",count)
    const intervalId = setInterval(async () => {

        console.log(count);

        if (socketSaathiRx.connected) {
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


socketSaathiRx.on('connect',executeHandleConnect);



export default socketSaathiRx;
