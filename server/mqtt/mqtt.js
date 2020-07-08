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
    console.log('err')
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

  let connectedClients = 0;

  // io.on('connection', (socket) => {
  //   socket.on('disconnect', () => {
  //     connectedClients--;
  //     console.log('Clients connected: ', connectedClients);
  //   });
  //   connectedClients++;
  //   console.log('Clients connected', connectedClients);
  // });

  // mqttClient.getClient().subscribe('app');

  mqttClient.on('message', (topic, message) => {
    let msg = JSON.parse(message)[0];
    // NB! Need to run for each tag in the message, only a single handled atm
    triggerDbUpdate(msg);
    
    
    // console.log(JSON.stringify(msg))

    // io.emit('app', received);
  });



  // app.listen(8080, () => {
  //   console.log('Listening on port 8080');
  // });
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
