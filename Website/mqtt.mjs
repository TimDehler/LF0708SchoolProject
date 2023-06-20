import mqtt from "mqtt";

const brokerUrl = "mqtt://10.100.20.145:1883";
const clientId = "web-service";

// MQTT topics to subscribe to
const topic = "planlosV2/data";

let message_toFormat;

// Create MQTT client
const client = mqtt.connect(brokerUrl, { clientId });

// MQTT client connected
client.on("connect", async () => {
  console.log("Connected to MQTT broker");

  // Subscribe to topics
  await client.subscribe(topic, (err) => {
    if (err) {
      console.error("Error subscribing to topic");
    } else {
      console.log("Subscribed to topic");
    }
  });
});

// Handle received messages
client.on("message", (topic, message) => {
  console.log(`Received message on topic "${topic}": ${message.toString()}`);
  message_toFormat = message;
  formatData();
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

export function formatData() {
  const test_data = "this is a message";
  return test_data;
}
