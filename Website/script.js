const url = "http://localhost:3000/data";

async function getData() {
  const myDoc = document.getElementById("container");

  let myData = await fetch(url);
  const temp = await myData.json();

  let ulList = document.createElement("ul");
  ulList.setAttribute("class", "list");

  temp.map((cust) => {
    let liElement = document.createElement("li");
    let span = liElement.appendChild(document.createElement("span"));
    span.setAttribute("class", "id");
    span.innerHTML = cust._id;
    let div = liElement.appendChild(document.createElement("div"));
    div.setAttribute("class", "details");
    let name_span = div.appendChild(document.createElement("span"));
    name_span.setAttribute("class", "name");
    name_span.innerHTML = cust.Name;
    let age_span = div.appendChild(document.createElement("span"));
    name_span.setAttribute("class", "age");
    age_span.innerHTML = cust.Age;

    ulList.appendChild(liElement);
  });
  myDoc.appendChild(ulList);

  const listItems = document.querySelectorAll(".list li");

  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

getData();
