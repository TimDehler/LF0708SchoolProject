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
import { provideData } from "./mqtt.mjs";

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

app.get("/mqtt-data", (req, res) => {
  res.send(provideData());
});

app.listen(3000, () => {
  console.log("The server listens to port 3000");
});
