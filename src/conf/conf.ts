const https = {
  
  API_GATEWAY: "https://railkriti.co.in/backend",
  LOCTION: `https://railkriti.co.in/backend/location`,
  BR_WLMS: `https://railkriti.co.in/backend/br_wlms`,
  TR_WLMS: `https://railkriti.co.in/backend/tr_wlms`,
  SAATHI_RX: `https://railkriti.co.in/backend/saathi_rx`,
  SAATHI_TX: `https://railkriti.co.in/backend/saathi_tx`,
  RAILTAAP: `https://railkriti.co.in/backend/railtaap`,
  NOTIFICATION: `http://railkriti.co.in:3008`,
  TANK_WLMS : `https://railkriti.co.in/backend/tank-wlms`,


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