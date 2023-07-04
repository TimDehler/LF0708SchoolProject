import { mapObject } from "./utils.mjs";

const container = document.getElementById("container");
const mqtt_url = "http://localhost:3000/mqtt-data";

let previousData = null;

async function getMqttData() {
  let myData;
  await fetch(mqtt_url)
    .then((response) => response.json())
    .then((data) => {
      myData = data;
    })
    .catch((e) => {
      console.log(`Purposly caught ${e}`);
    });
  return myData;
}

const addEvent = () => {
  const ids = document.querySelectorAll(".id");
  ids.forEach((element) => {
    const str = element.innerHTML;
    if (str.includes("Most recent process data:")) {
      console.log("inside");

      element.parentElement.addEventListener("click", () => {
        element.parentElement.classList.toggle("active");
      });
    }
  });
};

const appendNewMQTTData = (data) => {
  previousData = data;
  container.innerHTML = "";
  container.appendChild(mapObject(data));
  addEvent();
};

setInterval(async () => {
  const data = await getMqttData();

  if (data === undefined) return;
  if (previousData === data) return;

  if (previousData === null) {
    appendNewMQTTData(data);
  }

  if (previousData.start_time !== data.start_time) {
    appendNewMQTTData(data);
  }
}, 5000);
