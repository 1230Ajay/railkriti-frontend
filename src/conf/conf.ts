const https = {
  
  API_GATEWAY: "https:///edge-server:8090",
  LOCTION: `https:///edge-server:8090/location`,
  BR_WLMS: `https:///edge-server:8090/br-wlms`,
  TR_WLMS: `https:///edge-server:8090/tr-wlms`,
  SAATHI_RX: `https:///edge-server:8090/saathi-rx`,
  SAATHI_TX: `https:///edge-server:8090/saathi-tx`,
  RAILTAAP: `https://edge-server:8090/railtaap`,
  NOTIFICATION: `https://api-gateway:8090/backend/notification`,
  TANK_WLMS: `https://edge-server:8090/tank-wlms`,

  // socket urls
  BR_WLMS_SOCKET_URL: "https://railkriti.co.in:3001",
  TR_WLMS_SCOKET_URL: "https://railkriti.co.in:3004",
  SAATHI_TX_SOCKET_URL: "https://railkriti.co.in:3005",
  SAATHI_RX_SOCKET_URL: "https://railkriti.co.in:3006",
  RAILTAAP_SOCKET_URL: "https://railkriti.co.in:3009",
  TANK_WLMS_SOCKET_URL: "https://railkriti.co.in:3010",
}

const http = {
  // api urls
  API_GATEWAY: "http:///localhost:8080",
  LOCTION: `http:///localhost:8080/location`,
  BR_WLMS: `http:///localhost:8080/br-wlms`,
  TR_WLMS: `http:///localhost:8080/tr-wlms`,
  SAATHI_RX: `http:///localhost:8080/saathi-rx`,
  SAATHI_TX: `http:///localhost:8080/saathi-tx`,
  RAILTAAP: `http://localhost:8080/railtaap`,
  NOTIFICATION: `http://api-gateway:8080/backend/notification`,
  TANK_WLMS: `http://localhost:8080/tank-wlms`,

  // socket urls
  BR_WLMS_SOCKET_URL: "http://localhost:3001",
  TR_WLMS_SCOKET_URL: "http://localhost:3004",
  SAATHI_TX_SOCKET_URL: "http://localhost:3005",
  SAATHI_RX_SOCKET_URL: "http://localhost:3006",
  RAILTAAP_SOCKET_URL: "http://localhost:3009",
  TANK_WLMS_SOCKET_URL: "http://localhost:3010",

}



const conf = {
  ...http
}



export default conf;