import { mapObject } from "../utils.mjs";

const container = document.getElementById("container");
const mqtt_url = "http://localhost:3000/mqtt-data";

let oldData;

const getMqttData = async () => {
  let fetchedData = await fetch(mqtt_url);
  const freshData = await fetchedData.json();
  return freshData;
};

setInterval(async () => {
  const temp_doc = document.getElementById("list-item");
  const data = await getMqttData();

  if (temp_doc === null) {
    oldData = data;
    container.appendChild(mapObject(data));
    addEvent();
  }

  if (temp_doc !== null && oldData._id !== data._id) {
    temp_doc.remove();
    container.appendChild(mapObject(data));
    addEvent();
  }
}, 5000);

const addEvent = () => {
  const listItems = document.querySelectorAll(".list li");
  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
};
