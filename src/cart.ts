import * as mongodb from "mongodb";

export interface Cart {
    _id?: mongodb.ObjectId;
    itemId: mongodb.ObjectId;
}