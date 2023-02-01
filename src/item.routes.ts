import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const itemRouter = express.Router();
itemRouter.use(express.json());

itemRouter.get("/", async (_req, res) => {
  try {
    const item = await collections.items.find({}).toArray();
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

itemRouter.get("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const item = await collections.items.findOne(query);

    if (item) {
      res.status(200).send(item);
    } else {
      res.status(404).send(`Failed to find an item: ID ${id}`);
    }
  } catch (error) {
    res.status(404).send(`Failed to find an item: ID ${req?.params?.id}`);
  }
});

itemRouter.post("/", async (req, res) => {
  try {
    const item = req.body;
    console.log(item);
    const result = await collections.items.insertOne(item);

    if (result.acknowledged) {
      console.log(`Added a new Item: ID ${result.insertedId}.`)
    } else {
      console.log("Failed to Add a new item.")
    }
  } catch (error) {
    console.error(error);
  }
});

itemRouter.put("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const item = req.body;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await collections.items.updateOne(query, { $set: item });

    if (result && result.matchedCount) {
      res.status(200).send(`Updated an item: ID ${id}.`);
    } else if (!result.matchedCount) {
      res.status(404).send(`Failed to find an item: ID ${id}`);
    } else {
      res.status(304).send(`Failed to update an item: ID ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

itemRouter.delete("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await collections.items.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Removed an item: ID ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove an item: ID ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Failed to find an item: ID ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
