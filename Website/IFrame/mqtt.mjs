import mqtt from "mqtt";

let mqtt_data;

const brokerUrl = "mqtt://10.100.20.145:1883";
const clientId = "web-service";

// MQTT topics to subscribe to
const topic = "planlosV2/data";

<<<<<<<< HEAD:API/mqtt.mjs
let myMessage;

========
>>>>>>>> 91bcab3f9c2927d87da64c175a2ac734f7d36d0a:Website/IFrame/mqtt.mjs
// Create MQTT client
const client = mqtt.connect(brokerUrl, { clientId });

// MQTT client connected
client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to topics
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Error subscribing to topic");
    } else {
      console.log("Subscribed to topic");
    }
  });
});

// Handle received messages
client.on("message", (topic, message) => {
<<<<<<<< HEAD:API/mqtt.mjs
  console.log(`Received message on topic "${topic}": ${message.toString()}`);
  myMessage = message;
========
  //console.log(`Received message on topic "${topic}": ${message.toString()}`);
  mqtt_data = JSON.parse(message);
>>>>>>>> 91bcab3f9c2927d87da64c175a2ac734f7d36d0a:Website/IFrame/mqtt.mjs
  // Handle the received message data here
});

// MQTT client error handling
client.on("error", (err) => {
  console.error("MQTT client error:", err);
});

// MQTT client disconnected
client.on("close", () => {
  console.log("Disconnected from MQTT broker");
});

export function provideData() {
<<<<<<<< HEAD:API/mqtt.mjs
  return myMessage;
========
  return mqtt_data;
>>>>>>>> 91bcab3f9c2927d87da64c175a2ac734f7d36d0a:Website/IFrame/mqtt.mjs
}
