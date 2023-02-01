import * as mongodb from "mongodb";

export interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  address: string;
  phone_number: number;
  role: string;
  _id?: mongodb.ObjectId;
}
