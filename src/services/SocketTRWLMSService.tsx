// socket.js
import conf from '@/conf/conf';
import { io } from 'socket.io-client';

const socketTRWLMS = io(conf.TR_WLMS_SCOKET_URL); 

export default socketTRWLMS;
