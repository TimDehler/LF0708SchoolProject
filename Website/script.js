const url = "http://localhost:3000/data";

const myDoc = document.getElementById("container");
const updateContainer = document.getElementById("update");

async function getData() {
  let myData = await fetch(url);
  const temp = await myData.json();
  temp.map((s) => {
    mapObject(s, myDoc);
  });
  const listItems = document.querySelectorAll(".list li");
  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

const mapObject = (obj, whomToAppendTo) => {
  let ulList = document.createElement("ul");
  ulList.setAttribute("class", "list");

  let liElement = document.createElement("li");
  let span = liElement.appendChild(document.createElement("span"));
  span.setAttribute("class", "id");
  span.innerHTML = "ID: " + obj._id;

  let div = liElement.appendChild(document.createElement("div"));
  div.setAttribute("class", "details");

  let start_time_span = div.appendChild(document.createElement("span"));
  start_time_span.setAttribute("class", "name");
  start_time_span.innerHTML = "Start time: " + obj.start_time;

  let end_time_span = div.appendChild(document.createElement("span"));
  end_time_span.setAttribute("class", "name");
  end_time_span.innerHTML = "End time: " + obj.end_time;

  let time_taken_span = div.appendChild(document.createElement("span"));
  time_taken_span.setAttribute("class", "name");
  time_taken_span.innerHTML = "Time taken: " + obj.time_taken;

  for (let col in obj.colors_sorted) {
    let color_span_red = div.appendChild(document.createElement("span"));
    color_span_red.setAttribute("class", "name");
    color_span_red.innerHTML =
      "Color: " +
      obj.colors_sorted[col].color +
      " Amount: " +
      obj.colors_sorted[col].amount;
  }

  let avg_temperature_span = div.appendChild(document.createElement("span"));
  avg_temperature_span.setAttribute("class", "name");
  avg_temperature_span.innerHTML =
    "Average process temperature: " + obj.avg_temperature + "°C";

  let max_temperature_span = div.appendChild(document.createElement("span"));
  max_temperature_span.setAttribute("class", "name");
  max_temperature_span.innerHTML =
    "Max process temperature: " + obj.max_temperature + "°C";

  let min_temperature_span = div.appendChild(document.createElement("span"));
  min_temperature_span.setAttribute("class", "name");
  min_temperature_span.innerHTML =
    "Min process temperature: " + obj.min_temperature + "°C";

  let avg_humidity_span = div.appendChild(document.createElement("span"));
  avg_humidity_span.setAttribute("class", "name");
  avg_humidity_span.innerHTML =
    "Average process humidity: " + obj.avg_humidity + "%";

  let max_humidity_span = div.appendChild(document.createElement("span"));
  max_humidity_span.setAttribute("class", "name");
  max_humidity_span.innerHTML =
    "Max process humidity: " + obj.max_humidity + "%";

  let min_humidity_span = div.appendChild(document.createElement("span"));
  min_humidity_span.setAttribute("class", "name");
  min_humidity_span.innerHTML =
    "Min process humidity: " + obj.min_humidity + "%";

  ulList.appendChild(liElement);
  whomToAppendTo.appendChild(ulList);
};

getData();
