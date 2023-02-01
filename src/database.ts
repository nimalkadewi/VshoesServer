import * as mongodb from "mongodb";
import { Item } from "./item";
import { User } from "./user";
import { Order } from "./order";
import { Cart } from "./cart";
import { OrderItem_F } from "./order_f";

export const collections: {
  items?: mongodb.Collection<Item>;
  users?: mongodb.Collection<User>;
  orders?: mongodb.Collection<Order>;
  carts?: mongodb.Collection<Cart>;
  orders_f?: mongodb.Collection<OrderItem_F>;
} = {};

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);
  await client.connect();

  const db = client.db("shoeStore");
  const db1 = client.db("shoeStore");
  const db_order = client.db("shoeStore");
  const db_order_f = client.db("shoeStore");
  const db_cart = client.db("shoeStore");

  await applySchemaValidation(db);
  await validateUser(db1);
  await validateOrder(db_order);
  await validateCart(db_cart);
  await validateOrder_f(db_order_f);

  const employeesCollection = db.collection<Item>("items");
  const usersCollection = db1.collection<User>("users");
  const ordersCollection = db_order.collection<Order>("orders");
  const cartsCollection = db_cart.collection<Cart>("carts");
  const orders_fCollection = db_order_f.collection<OrderItem_F>("orders_f");

  collections.items = employeesCollection;
  collections.users = usersCollection;
  collections.orders = ordersCollection;
  collections.carts = cartsCollection;
  collections.orders_f = orders_fCollection;
}

async function validateOrder_f(db: mongodb.Db) {
  const jsonSchema = {
    bsonType: "object",
    required: ["itemId", "quantity", "userId"],
    additionalProperties: false,
    properties: {
      _id: {},
      itemId: {
        bsonType: "ObjectId",
        description: "'itemId' is required and is a ObjectId",
      },
      userId: {
        bsonType: "ObjectId",
        description: "'userId' is required and is a ObjectId",
      },
      quantity: {
        bsonType: "number",
        description: "'quantity' is required and is a number",
      },
    },
  };
  await db
    .command({
      collMod: "orders_f",
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("orders_f", { validator: jsonSchema });
      }
    });
}

async function validateCart(db: mongodb.Db) {
  const jsonSchema = {
    bsonType: "object",
    required: ["itemId"],
    additionalProperties: false,
    properties: {
      _id: {},
      itemId: {
        bsonType: "ObjectId",
        description: "'itemId' is required and is a ObjectId",
      },
    },
  };
  await db
    .command({
      collMod: "carts",
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("carts", { validator: jsonSchema });
      }
    });
}

async function validateOrder(db: mongodb.Db) {
  const jsonSchema = {
    bsonType: "object",
    required: ["itemId", "quantity", "items", "userId", "price"],
    additionalProperties: false,
    properties: {
      _id: {},
      itemId: {
        bsonType: "ObjectId",
        description: "'itemId' is required and is a ObjectId",
      },
      quantity: {
        bsonType: "number",
        description: "'quantity' is required and is a number",
      },
      items: {
        bsonType: "Array",
        description: "'items' is required and is a Array",
      },
      userId: {
        bsonType: "ObjectId",
        description: "'userId' is required and is a ObjectId",
      },
      price: {
        bsonType: "number",
        description: "'price' is required and is a number",
      },
    },
  };
  await db
    .command({
      collMod: "orders",
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("orders", { validator: jsonSchema });
      }
    });
}

async function applySchemaValidation(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "price", "quantity", "gender", "type"],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: "string",
          description: "'name' is required and is a string",
        },
        description: {
          bsonType: "string",
          description: "'description' is required and is a string",
          minLength: 5,
        },
        price: {
          bsonType: "number",
          description: "'price' is required and is a number",
          minLength: 5,
        },
        quantity: {
          bsonType: "number",
          description: "'quantity' is required and is a number",
          minLength: 5,
        },
        gender: {
          bsonType: "string",
          description:
            "'gender' is required and is one of 'women', 'men', or 'kids'",
          enum: ["women", "men", "kids"],
        },
        type: {
          bsonType: "string",
          description: "'type' is required and is one of 'shoe' or 'slippers'",
          enum: ["shoe", "slippers"],
        },
      },
    },
  };

  await db
    .command({
      collMod: "items",
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("items", { validator: jsonSchema });
      }
    });
}

async function validateUser(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "first_name",
        "last_name",
        "email",
        "password",
        "address",
        "phone_number",
        "role",
        "username",
      ],
      additionalProperties: false,
      properties: {
        _id: {},
        first_name: {
          bsonType: "string",
          description: "'first_name' is required and is a string",
          minLength: 5,
        },
        last_name: {
          bsonType: "string",
          description: "'last_name' is required and is a string",
          minLength: 5,
        },
        email: {
          bsonType: "string",
          description: "'email' is required and is a string",
          minLength: 5,
        },
        password: {
          bsonType: "string",
          description: "'password' is required and is a string",
          minLength: 6,
        },
        address: {
          bsonType: "string",
          description: "'address' is required and is a string",
          minLength: 5,
        },
        phone_number: {
          bsonType: "number",
          description: "'phone_number' is required and is a number",
          minLength: 10,
        },
        role: {
          bsonType: "string",
          description: "'role' is required and is a string",
          minLength: 5,
        },
        username: {
          bsonType: "string",
          description: "'username' is required and is a string",
          minLength: 5,
        },
      },
    },
  };

  await db
    .command({
      collMod: "users",
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("users", { validator: jsonSchema });
      }
    });
}
