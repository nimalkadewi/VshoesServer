import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { ObjectId } from "mongodb";

export const order_fRouter = express.Router();
order_fRouter.use(express.json());

order_fRouter.post("/", async (req, res) => {
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

    bodyData.itemId = new ObjectId(bodyData.itemId);
    const result = await collections.items.findOne(bodyData.itemId);
    const updatedQuantity = result.quantity - bodyData.quantity;

    const updateItems = await collections.items.updateOne(
      {
        _id: bodyData.itemId,
      },
      { $set: { quantity: updatedQuantity } }
    );

    if (updateItems && updateItems.matchedCount) {
      console.log(`Updated an item: ID ${bodyData.itemId}`);
    }

    /*console.log(itemArray[i].itemId);*/

    bodyData.userId = new ObjectId(bodyData.userId);
    // console.log(bodyData.userId);

    const insertOrder = await collections.orders_f.insertOne(bodyData);
    const removeCart = await collections.carts.deleteOne({
      _id: bodyData.itemId,
    });

    if (insertOrder.acknowledged &&  removeCart.acknowledged) {
      console.log(`Created a new order: ID ${insertOrder.insertedId}.`);
      res.status(200).send("Done");
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
