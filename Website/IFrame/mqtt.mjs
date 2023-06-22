import mqtt from "mqtt";

/* const brokerUrl = "mqtt://10.100.20.145:1883";
const clientId = "web-service";

// MQTT topics to subscribe to
const topic = "planlosV2/data";

let message_toFormat;

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
  console.log(`Received message on topic "${topic}": ${message.toString()}`);
  message_toFormat = message;
  // Handle the received message data here
});

// MQTT client error handling
client.on("error", (err) => {
  console.error("MQTT client error:", err);
});

// MQTT client disconnected
client.on("close", () => {
  console.log("Disconnected from MQTT broker");
}); */

export function provideData() {
  const test_data = {
    _id: "testid",
    start_time: "test",
    end_time: "test",
    time_taken: "test",
    colors_sorted: [
      { color: "red", amount: 1 },
      { color: "blue", amount: 1 },
      { color: "green", amount: 1 },
    ],
    avg_temperature: "test",
    max_temperature: "test",
    min_temperature: "test",
    avg_humidity: "test",
    max_humidity: "test",
    min_humidity: "test",
  };
  return test_data;
}
