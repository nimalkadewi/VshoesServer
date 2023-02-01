import * as mongodb from "mongodb";

export interface OrderItem_F {
    itemId: mongodb.ObjectId;
    quantity: number;
    userId: mongodb.ObjectId;
    _id?: mongodb.ObjectId;
}