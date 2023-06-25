import { getPrices } from "./awattar.mjs";
import { formatTime, mapObject } from "./utils.mjs";

const url = "http://localhost:3000/data";

const myDoc = document.getElementById("update");

async function getData() {
  await fetch(url)
    .then((response) => response.json())
    .then((data) =>
      data.map((s) => {
        myDoc.appendChild(mapObject(s));
      })
    )
    .catch((error) => console.log(error));

  const listItems = document.querySelectorAll(".list li");
  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

const setPriceStatus = async () => {
  let temp = await getPrices(0, 0, true);
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
