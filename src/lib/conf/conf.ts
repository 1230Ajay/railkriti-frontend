// conf.js - Universal configuration that adapts to environment variables
const conf = {
  // API Endpoints
  API_GATEWAY: process.env.BASE_URL || "https://railkriti.co.in:8090",
  LOCATION: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/location`,
  BR_WLMS: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/br-wlms`,
  TR_WLMS: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/tr-wlms`,
  SAATHI_RX: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/saathi-rx`,
  SAATHI_TX: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/saathi-tx`,
  RAILTAAP: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/railtaap`,
  NOTIFICATION: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/notification`,
  TANK_WLMS: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/tank-wlms`,
  VINIMAY_URL: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/vinimay`,
  WIND_URL: `${process.env.BASE_URL || "https://railkriti.co.in:8090"}/wind`,

  // Socket URLs
  BR_WLMS_SOCKET_URL: process.env.BR_WLMS_SOCKET_URL || "https://railkriti.co.in:3001",
  TR_WLMS_SOCKET_URL: process.env.TR_WLMS_SOCKET_URL || "https://railkriti.co.in:3004",
  SAATHI_TX_SOCKET_URL: process.env.SAATHI_TX_SOCKET_URL || "https://railkriti.co.in:3005",
  SAATHI_RX_SOCKET_URL: process.env.SAATHI_RX_SOCKET_URL || "https://railkriti.co.in:3006",
  RAILTAAP_SOCKET_URL: process.env.RAILTAAP_SOCKET_URL || "https://railkriti.co.in:3009",
  TANK_WLMS_SOCKET_URL: process.env.TANK_WLMS_SOCKET_URL || "https://railkriti.co.in:3010",
  MQTT_URL: process.env.MQTT_URL || "wss://railkriti.co.in:9002/ws",

  // Auth Configuration
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://railkriti.co.in",
  AUTH_SECRET: process.env.AUTH_SECRET || "Q29tbWFuZCB0byBnZW5lcmF0ZSBhIHJhbmRvbSBzdHJpbmcgaW4gYmFzZTY0",
};

export default conf;