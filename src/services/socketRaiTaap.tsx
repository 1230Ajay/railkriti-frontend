import conf from '@/conf/conf';
import { io } from 'socket.io-client';

const socketRailTaap = io(conf.RAILTAAP_SOCKET_URL); 

export default socketRailTaap;
