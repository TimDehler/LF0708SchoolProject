import { getPrices } from "./awattar.mjs";
import { formatTime, mapObject } from "./utils.mjs";

const url = "http://localhost:3000/data";

const myDoc = document.getElementById("update");

async function getData() {
  let myData = await fetch(url);
  const temp = await myData.json();
  temp.map((s) => {
    myDoc.appendChild(mapObject(s));
  });
  const listItems = document.querySelectorAll(".list li");
  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

const setPriceStatus = async () => {
  let temp = await getPrices(0, 0, true);
  console.log(formatTime(temp.min.start_timestamp));
  const statusH2 = document.getElementById("costEstimation");
  const formattedTime = formatTime(temp.min.start_timestamp);
  statusH2.textContent = `The cheapest time to run your tasks would be at ${formattedTime.time} on the ${formattedTime.date}`;
};

const run = async () => {
  getData();
  setPriceStatus();
  //console.log(formatTime(1636329600000));
};

run();
