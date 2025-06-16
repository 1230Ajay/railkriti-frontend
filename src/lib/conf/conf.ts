const useHttps = true;

const protocol = useHttps ? 'https' : 'http';
const mqttProtocol = useHttps ? 'ws' : 'ws';
const host = useHttps ? 'railkriti.co.in' : 'localhost';

const conf = {
  // API Endpoints
  API_GATEWAY: `${protocol}://${host}:8090`,
  AUTH: `${protocol}://${ useHttps? host:"host.docker.internal"}:8090/auth`,
  LOCATION: `${protocol}://${host}:8090/location`,
  BR_WLMS: `${protocol}://${host}:8090/br-wlms`,
  TR_WLMS: `${protocol}://${host}:8090/tr-wlms`,
  SAATHI_RX: `${protocol}://${host}:8090/saathi-rx`,
  SAATHI_TX: `${protocol}://${host}:8090/saathi-tx`,
  RAILTAAP: `${protocol}://${host}:8090/railtaap`,
  NOTIFICATION: `${protocol}://${host}:8090/notification`,
  TANK_WLMS: `${protocol}://${host}:8090/tank-wlms`,
  VINIMAY_URL: `${protocol}://${host}:8090/vinimay`,
  WIND_URL: `${protocol}://${host}:8090/wind`,

  // Socket URLs
  BR_WLMS_SOCKET_URL: `${protocol}://${host}:3001`,
  TR_WLMS_SOCKET_URL: `${protocol}://${host}:3004`,
  SAATHI_TX_SOCKET_URL: `${protocol}://${host}:3005`,
  SAATHI_RX_SOCKET_URL: `${protocol}://${host}:3006`,
  RAILTAAP_SOCKET_URL: `${protocol}://${host}:3009`,
  TANK_WLMS_SOCKET_URL: `${protocol}://${host}:3010`,
  MQTT_URL: `wss://railkriti.co.in:9002/ws`,

  // Auth
  NEXTAUTH_URL: useHttps ? 'https://robokriti.co.in' : 'http://localhost:3007',
  AUTH_SECRET:
    process.env.AUTH_SECRET || 'Q29tbWFuZCB0byBnZW5lcmF0ZSBhIHJhbmRvbSBzdHJpbmcgaW4gYmFzZTY0',
};

export default conf;
