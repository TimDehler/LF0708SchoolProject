import { mapObject } from "../utils.mjs";

const container = document.getElementById("container");
const mqtt_url = "http://localhost:3000/mqtt-data";
const eventSource = new EventSource("http://localhost:3000/mqtt-data");

const getMqttData = async () => {
  let retValue;
  await fetch(mqtt_url)
    .then((response) => response.json())
    .then((data) => {
      data.map((s) => {
        retValue = mapObject(s);
      });
    })
    .catch((error) => {
      console.log(error);
      const status_message = document.createElement("h1");
      status_message.textContent = "Theres no new data to display";
      retValue = status_message;
    });
  return retValue;
};

const addEvent = () => {
  const listItems = document.querySelectorAll(".list li");
  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
};

eventSource.onmessage = () => {
  container.appendChild(getMqttData());
  addEvent();
};
