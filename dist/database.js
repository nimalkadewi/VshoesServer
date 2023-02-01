"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.collections = void 0;
const mongodb = __importStar(require("mongodb"));
exports.collections = {};
function connectToDatabase(uri) {
  return __awaiter(this, void 0, void 0, function* () {
    const client = new mongodb.MongoClient(uri);
    yield client.connect();
    const db = client.db("shoeStore");
    // const db1 = client.db("shoeStore");
    yield applySchemaValidation(db);
    // await validateUser(db1);
    const employeesCollection = db.collection("items");
    // const usersCollection = db1.collection<User>("users");
    exports.collections.items = employeesCollection;
    // collections.users = usersCollection;
  });
}
exports.connectToDatabase = connectToDatabase;
function applySchemaValidation(db) {
  return __awaiter(this, void 0, void 0, function* () {
    const jsonSchema = {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "name",
          "description",
          "price",
          "quantity",
          "gender",
          "type",
        ],
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
            description:
              "'type' is required and is one of 'shoe' or 'slippers'",
            enum: ["shoe", "slippers"],
          },
        },
      },
    };
    yield db
      .command({
        collMod: "items",
        validator: jsonSchema,
      })
      .catch((error) =>
        __awaiter(this, void 0, void 0, function* () {
          if (error.codeName === "NamespaceNotFound") {
            yield db.createCollection("items", { validator: jsonSchema });
          }
        })
      );
  });
}
function validateUser(db) {
  return __awaiter(this, void 0, void 0, function* () {
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
        },
      },
    };
    yield db
      .command({
        collMod: "users",
        validator: jsonSchema,
      })
      .catch((error) =>
        __awaiter(this, void 0, void 0, function* () {
          if (error.codeName === "NamespaceNotFound") {
            yield db.createCollection("users", { validator: jsonSchema });
          }
        })
      );
  });
}
//# sourceMappingURL=database.js.map
