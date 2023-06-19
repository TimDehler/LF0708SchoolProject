const url = "http://localhost:3000/data";

async function getData() {
  const myDoc = document.getElementById("container");

  let myData = await fetch(url);
  const temp = await myData.json();

  let ulList = document.createElement("ul");

  temp.map((cust) => {
    let liElement = document.createElement("li");
    //liElement.appendChild(document.createTextNode(JSON.stringify(cust)));
    liElement.appendChild(document.createTextNode("Name: " + cust.Name + " "));
    liElement.appendChild(document.createTextNode("Age: " + cust.Age));
    ulList.appendChild(liElement);
  });
  myDoc.appendChild(ulList);
}

getData();
