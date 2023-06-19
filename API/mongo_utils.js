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
  } catch (e) {
    console.log(e);
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

export async function getAllCollectionsForDatabase(db) {
  try {
    client
      .db(db)
      .listCollections()
      .toArray()
      .then((cols) => console.log("Collections: ", cols));
  } catch (e) {
    console.log(e);
  }
}

export async function getAllDocumentsForDatabaseCollection(db, collection) {
  let temp = [];
  try {
    for await (const doc of client.db(db).collection(collection).find()) {
      temp.push(doc);
    }
    return temp;
  } catch (e) {
    console.log(e);
  }
}

export async function insertUserInDBSCollection(db, collection, name, age) {
  try {
    const doc = { name: name, age: age };
    await client.db(db).collection(collection).insertOne(doc);
  } catch (e) {
    console.log(e);
  }
}
