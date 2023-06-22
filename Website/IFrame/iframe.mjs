import { mapObject } from "../utils.mjs";

const container = document.getElementById("container");
const mqtt_url = "http://localhost:3000/mqtt-data";

let oldData;

const getMqttData = async () => {
  let fetchedData = await fetch(mqtt_url);
  let freshData;
  try {
    freshData = await fetchedData.json();
  } catch (e) {
    if (document.getElementById("status") === null) {
      const status_message = document.createElement("h1");
      status_message.setAttribute("id", "status");
      status_message.textContent = "There is no new data to display!";
      container.appendChild(status_message);
    }
  }
  return freshData;
};

const addEvent = () => {
  const listItems = document.querySelectorAll(".list li");

  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
};

setInterval(async () => {
  const listItem = document.getElementById("list-item");
  const data = await getMqttData();

  if (listItem === null) {
    oldData = data;
    container.appendChild(mapObject(data));
    addEvent();
  }

  if (listItem !== null && oldData._id !== data._id) {
    listItem.remove();
    container.appendChild(mapObject(data));
    addEvent();
  }
}, 5000);
