const url = "http://localhost:3000/data";

async function getData() {
  let myData = await fetch(url);
  console.log(myData);
  console.log(myData.body);
  const myDoc = document.getElementById("container");
  const temp = await myData.json();

  let ulList = document.createElement("ul");

  temp.map((cust) => {
    let liElement = document.createElement("li");
    liElement.appendChild(document.createTextNode(JSON.stringify(cust)));
    ulList.appendChild(liElement);
  });

  myDoc.appendChild(ulList);
}

getData();
