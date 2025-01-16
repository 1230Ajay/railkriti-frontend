import conf from '@/conf/conf';
import { io } from 'socket.io-client';

const socketSaathiTX = io(conf.SAATHI_TX_SOCKET_URL); 

export default socketSaathiTX;
