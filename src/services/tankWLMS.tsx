import conf from '@/conf/conf';
import { io } from 'socket.io-client';

const tankWLMS = io(conf.TANK_WLMS_SOCKET_URL); 

export default tankWLMS;
