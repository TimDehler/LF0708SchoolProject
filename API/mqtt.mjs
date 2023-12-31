import mqtt from "mqtt";

const brokerUrl = "mqtt://10.100.20.145:1883";
const clientId = "web-service";

// MQTT topics to subscribe to
const topic = "planlosV2/data";

let myMessage;

// Create MQTT client
const client = mqtt.connect(brokerUrl, { clientId });

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Error subscribing to topic");
    } else {
      console.log("Subscribed to topic");
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`Received message on topic "${topic}": ${message.toString()}`);
  myMessage = JSON.parse(message);
});

client.on("error", (err) => {
  console.error("MQTT client error:", err);
});

client.on("close", () => {
  console.log("Disconnected from MQTT broker");
});

export function provideData() {
  return myMessage;
}
