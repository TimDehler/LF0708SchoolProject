import { mapObject } from "./utils.mjs";

const url = "http://localhost:3000/data";

const myDoc = document.getElementById("update");

async function getData() {
  let myData = await fetch(url);
  const temp = await myData.json();
  console.log("called: " + temp);
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

const run = () => {
  getData();
};

run();
