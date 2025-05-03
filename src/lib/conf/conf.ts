// conf.js - Universal configuration that adapts to environment variables
const conf = {
  // API Endpoints
  API_GATEWAY: process.env.BASE_URL,
  LOCATION: `${process.env.BASE_URL}/location`,
  BR_WLMS: `${process.env.BASE_URL}/br-wlms`,
  TR_WLMS: `${process.env.BASE_URL}/tr-wlms`,
  SAATHI_RX: `${process.env.BASE_URL}/saathi-rx`,
  SAATHI_TX: `${process.env.BASE_URL}/saathi-tx`,
  RAILTAAP: `${process.env.BASE_URL}/railtaap`,
  NOTIFICATION: `${process.env.BASE_URL}/notification`,
  TANK_WLMS: `${process.env.BASE_URL}/tank-wlms`,
  VINIMAY_URL: `${process.env.BASE_URL}/vinimay`,
  WIND_URL: `${process.env.BASE_URL}/wind`,

  // Socket URLs
  BR_WLMS_SOCKET_URL: process.env.BR_WLMS_SOCKET_URL || "",
  TR_WLMS_SOCKET_URL: process.env.TR_WLMS_SOCKET_URL || "",
  SAATHI_TX_SOCKET_URL: process.env.SAATHI_TX_SOCKET_URL || "",
  SAATHI_RX_SOCKET_URL: process.env.SAATHI_RX_SOCKET_URL || "",
  RAILTAAP_SOCKET_URL: process.env.RAILTAAP_SOCKET_URL || "",
  TANK_WLMS_SOCKET_URL: process.env.TANK_WLMS_SOCKET_URL || "",
  MQTT_URL: process.env.MQTT_URL|| "http://localhost:3007",

  // Auth Configuration
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
  AUTH_SECRET: process.env.AUTH_SECRET || "",
};

export default conf;