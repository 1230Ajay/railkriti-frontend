// mqtt.client.ts
import mqtt from 'mqtt';
import conf from '../conf/conf';

class MqttService {
  static client: mqtt.MqttClient;

  private constructor() {}

  public static init() {
    if (!this.client) {
      this.client = mqtt.connect(conf.MQTT_URL, {
        protocolId: 'MQTT',
        protocolVersion: 4,
        username: 'robo',
        password: 'rkirail',
        keepalive: 30,
        wsOptions: {
          protocol: 'mqtt',
        },
      });

      this.client.on('connect', () => console.log('MQTT Connected'));
      this.client.on('error', (err) => console.error('MQTT Error:', err));
    }
  }

  public static subscribe(topic: string | string[]) {
    this.client.subscribe(topic);
  }
}

MqttService.init();

export default MqttService;