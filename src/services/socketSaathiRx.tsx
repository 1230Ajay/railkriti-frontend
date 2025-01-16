import conf from '@/conf/conf';
import { io } from 'socket.io-client';

const socketSaathiRx = io(conf.SAATHI_RX_SOCKET_URL); 

export default socketSaathiRx;
