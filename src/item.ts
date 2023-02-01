import * as mongodb from "mongodb";

export interface Item {
  // photo: mongodb.BSONType;
  name: string;
  description: string;
  price: number;
  quantity: number;
  gender: "women" | "men" | "kids";
  type: "shoe" | "slippers";
  filePath: string;
  _id?: mongodb.ObjectId;
}
