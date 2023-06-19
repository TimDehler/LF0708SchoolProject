import axios from "axios";

const postData = {
  name: "Post",
  age: "3",
};

const headers = {
  "Content-Type": "application/json",
  name: "John Doe",
  age: "25",
};

axios
  .post("http://localhost:3000/createNewDoc/", postData, { headers })
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
