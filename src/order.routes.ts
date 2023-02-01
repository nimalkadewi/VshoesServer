import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { ObjectId } from "mongodb";

export const orderRouter = express.Router();
orderRouter.use(express.json());

orderRouter.get("/", async (_req, res) => {
  try {
    const order = await collections.orders
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "customer",
          },
        },
      ])
      .toArray()
      .then((data) => data)
      .catch((e) => console.log(e));

    if (order) {
      res.status(200).send(order);
    }
  } catch (error) {
    console.log(error);
  }
});

orderRouter.post("/", async (req, res) => {
  /*try {
            const order = req.body;
            const result = await collections.employees.insertOne(order);
    
            if (result.acknowledged) {
                res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
            } else {
                res.status(500).send("Failed to create a new employee.");
            }
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
        }*/

  try {
    let bodyData = req?.body;

    /*const item_number = new ObjectId(bodyData.item_number);*/

    const itemArray = bodyData.items;

    for (let i = 0; i < itemArray.length; i++) {
      const itemId = new ObjectId(itemArray[i].itemId);
      bodyData.items[i].itemId = itemId;
      const result = await collections.items.findOne(itemId);
      const updatedQuantity = result.quantity - itemArray[i].quantity;

      const updateItems = await collections.items.updateOne(
        {
          _id: itemId,
        },
        { $set: { quantity: updatedQuantity } }
      );

      if (updateItems && updateItems.matchedCount) {
        console.log(`Updated an item: ID ${itemId}`);
      }

      /*console.log(itemArray[i].itemId);*/
    }

    bodyData.userId = new ObjectId(bodyData.userId);
    // console.log(bodyData.userId);

    const insertOrder = await collections.orders.insertOne(bodyData);

    if (insertOrder.acknowledged) {
      console.log(`Created a new order: ID ${insertOrder.insertedId}.`);
    }

    /*let result = await collections.items.findOne(item_number);
        const updatedQuantity = result.quantity - bodyData.quantity;
    
        const updateItems = await collections.items.updateOne(
          {
            _id: item_number,
          },
          { $set: { quantity: updatedQuantity } }
        );
    
        const insertOrder = await collections.orders.insertOne(bodyData);
    
        if (updateItems && updateItems.matchedCount && insertOrder.acknowledged) {
          res
            .status(200)
            .send(
              `Updated an item: ID ${item_number}.\n Created a new order: ID ${insertOrder.insertedId}.`
            );
        } else if (!updateItems.matchedCount) {
          res.status(404).send(`Failed to find an item: ID ${item_number}`);
        } else {
          res.status(304).send(`Failed to update an item: ID ${item_number}`);
        }*/
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});
