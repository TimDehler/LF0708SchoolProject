const axios = require("axios");
const url = "";

axios
  .get(url)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
