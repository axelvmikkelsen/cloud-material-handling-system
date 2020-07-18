const mqtt = require('mqtt');

const host = process.env.MQTT_HOST;
const username = process.env.MQTT_USERNAME; // mqtt credentials if these are needed to connect
const password = process.env.MQTT_PASSWORD;
let mqttClient = null;

const runMqtt = (triggerDbUpdate) => {

  mqttClient = mqtt.connect(host, {
    username: username,
    password: password,
  });
  
  // mqtt error calback
  mqttClient.on('error', (err) => {
    console.log(err);
    mqttClient.end();
  });

  // Connection callback 
  mqttClient.on('connect', () => {
    console.log(`mqtt client connected`);
  });

  // mqtt subscriptions
  mqttClient.subscribe(username, { qos: 0 });

  mqttClient.on('close', () => {
    console.log(`mqtt client disconnected`);
  });

  mqttClient.on('message', (topic, message) => {
    let messageString = JSON.parse(message);
    messageString.map((msg) => triggerDbUpdate(msg))
  });
};

const disconnectMqtt = () => {
  try {
    mqttClient.end();
  } catch (err) {
    console.log('Shutdown unsuccessful')
  }
}

exports.runMqtt = runMqtt;
exports.disconnectMqtt = disconnectMqtt;
