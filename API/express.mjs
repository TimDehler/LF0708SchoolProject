import {
  connect,
  getAllCollectionsForDatabase,
  getAllDocumentsForDatabaseCollection,
  insertUserInDBSCollection,
  getAllDatabases,
} from "../API/mongo_utils.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(bodyParser.json());

await connect();

app.get("/", (req, res) => {
  res.send("Success! Your api is running!");
});

app.get("/data", async (req, res) => {
  res.send(
    await getAllDocumentsForDatabaseCollection(
      process.env.database,
      process.env.collection
    )
  );
});

app.get("/listCollections", async (req, res) => {
  res.send(await getAllCollectionsForDatabase("test"));
});

app.get("/createNewDoc/:Name/:Age", async (req, res) => {
  res.send(
    await insertUserInDBSCollection(
      "testdatenbank",
      "testcollection",
      req.params.Name,
      req.params.Age
    )
  );
});

app.get("/getAllDatabases", async (req, res) => {
  res.send(await getAllDatabases());
});

app.listen(3000, () => {
  console.log("The server listens to port 3000");
});
