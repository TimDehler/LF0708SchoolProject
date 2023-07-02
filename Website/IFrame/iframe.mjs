import { mapObject } from "../utils.mjs";

const container = document.getElementById("container");
const mqtt_url = "http://localhost:3000/mqtt-data";

let previousData = null;

async function getMqttData() {
  await fetch(mqtt_url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(`Purposly caught ${e}`);
    });
}

const addEvent = () => {
  const listItems = document.querySelectorAll(".list li");

  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
};

const appendNewMQTTData = () => {
  previousData = data;
  container.innerHTML = "";
  container.appendChild(mapObject(data));
  addEvent();
};

setInterval(async () => {
  const data = await getMqttData();

  if (data === undefined) return;

  if (previousData === null) {
    appendNewMQTTData();
  }

  if (previousData === data) {
    return;
  } else {
    appendNewMQTTData();
  }
}, 5000);
