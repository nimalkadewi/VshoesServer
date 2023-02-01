import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { ObjectId } from "mongodb";

export const cartRouter = express.Router();
cartRouter.use(express.json());

cartRouter.get("/", async (_req, res) => {
  try {
    const carts = await collections.carts
      .aggregate([
        {
          $lookup: {
            from: "items",
            localField: "itemId",
            foreignField: "_id",
            as: "item_details",
          },
        },
      ])
      .toArray()
      .then((data) => data)
      .catch((e) => console.log(e));

    if (carts) {
      res.status(200).send(carts);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const cart = req.body;
    cart.itemId = new ObjectId(cart.itemId);
    const result = await collections.carts.insertOne(cart);

    if (result.acknowledged) {
      res.status(201).send(`Created a new cart: ID ${result.insertedId}.`);
    } else {
      res.status(500).send("Failed to create a new cart.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});
