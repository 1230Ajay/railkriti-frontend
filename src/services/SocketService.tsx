// socket.js
import conf from '@/conf/conf';
import { io } from 'socket.io-client';

const socketWLMS = io(conf.BR_WLMS_SOCKET_URL); 

export default socketWLMS;
