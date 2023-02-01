import * as mongodb from "mongodb";

interface OrderItem {
  itemId: mongodb.ObjectId;
  quantity: number;
}

export interface Order {
  _id?: mongodb.ObjectId;
  items: Array<OrderItem>;
  userId: mongodb.ObjectId;
  price: number;
}
