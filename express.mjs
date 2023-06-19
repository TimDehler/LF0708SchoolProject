import * as utils from "./mongo_utils.js";
import express from "express";

const app = express();

await utils.connect();

app.get("/", (req, res) => {
  res.send("Success! Your api is running!");
});

app.get("/data", async (req, res) => {
  res.send(
    await utils.getAllDocumentsForDatabaseCollection(
      "testdbs",
      "testcollection"
    )
  );
});

app.listen(3000, () => {
  console.log("The server listens to port 3000");
});
