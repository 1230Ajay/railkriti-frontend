import conf from '@/lib/conf/conf';
import { io } from 'socket.io-client';
import { getStoredJwt } from '../../../getCoockies';


const socketSaathiTX = io(conf.SAATHI_TX_SOCKET_URL); 


const handleConnect = async () => {
    const jwt = await getStoredJwt();
    socketSaathiTX.emit('userConnect', { jwt });
};

const executeHandleConnect = () => {
    let count = 0;
    console.log("count is : ",count)
    const intervalId = setInterval(async () => {

        console.log(count);

        if (socketSaathiTX.connected) {
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


socketSaathiTX.on('connect',executeHandleConnect);



export default socketSaathiTX;
