import {
  connect,
  getAllCollectionsForDatabase,
  getAllDocumentsForDatabaseCollection,
  insertUserInDBSCollection,
  getAllDatabases,
} from "./mongo_utils.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

await connect();

app.get("/", (req, res) => {
  res.send("Success! Your api is running!");
});

app.get("/data", async (req, res) => {
  res.send(
    await getAllDocumentsForDatabaseCollection("testdbs", "testcollection")
  );
});

app.get("/listCollections", async (req, res) => {
  res.send(await getAllCollectionsForDatabase("testdbs"));
});

app.get("/createNewDoc/:Name/:Age", async (req, res) => {
  res.send(
    await insertUserInDBSCollection(
      "testdbs",
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
