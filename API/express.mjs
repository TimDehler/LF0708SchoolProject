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
<<<<<<< HEAD
import { provideData } from "./mqtt.mjs";
=======
import { provideData } from "../Website/IFrame/mqtt.mjs";
import "dotenv/config";
>>>>>>> 91bcab3f9c2927d87da64c175a2ac734f7d36d0a

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbs = process.env.database;
const col = process.env.collection;

await connect();

app.get("/", (req, res) => {
  res.send("Success! Your api is running!");
});

app.get("/data", async (req, res) => {
  res.send(await getAllDocumentsForDatabaseCollection(dbs, col));
});

app.get("/mqtt-data", (req, res) => {
  res.send(provideData());
});

app.get("/listCollections", async (req, res) => {
  res.send(await getAllCollectionsForDatabase("test"));
});

// app.post("/createNewDoc", async (req, res) => {
//   console.log(req.headers.name, req.headers.age);
//   const { name, age } = req.body;
//   console.log(name, age);
//   res.send(
//     /*     await insertUserInDBSCollection(
//       "testdatenbank",
//       "testcollection",
//       req.params.Name,
//       req.params.Age
//     ) */
//     { name, age }
//   );
// });

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
