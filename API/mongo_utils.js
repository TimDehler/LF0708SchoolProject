// Create a MongoClient with a MongoClientOptions object to set the Stable API version
import { MongoClient } from "mongodb";
import "dotenv/config";
const client = new MongoClient(process.env.uri);

export async function connect() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Client was connected!");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function cutConnection() {
  await client.close();
  console.log("Client was closed!");
}

export async function getAllDatabases() {
  try {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  } catch (e) {
    console.log(e);
  }
}

/* async function getAllCollectionsForDatabase(db) {
  try {
    const dataBase = client.db(db);
    collectionsList = dataBase.listCollections();
    console.log(collectionsList);
  } catch (e) {
    console.log(e);
  }
} */

export async function getAllDocumentsForDatabaseCollection(db, collection) {
  let temp = [];
  try {
    for await (const doc of client.db(db).collection(collection).find()) {
      temp.push(doc);
      console.dir(doc);
    }
    return temp;
  } catch (e) {
    console.log(e);
  }
}

async function run() {
  try {
    if (await connect()) {
      //await getAllDatabases();
      await getAllDocumentsForDatabaseCollection("testdbs", "testcollection");
    }
    await cutConnection();
  } catch (e) {
    console.log(e);
  }
}
