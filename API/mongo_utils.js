import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.school_uri);

export async function connect() {
  try {
    await client.connect();
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
