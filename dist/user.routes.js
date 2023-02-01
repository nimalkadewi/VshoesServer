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
exports.userRouter = void 0;
const express = __importStar(require("express"));
const mongodb = __importStar(require("mongodb"));
const database_1 = require("./database");
exports.userRouter = express.Router();
exports.userRouter.use(express.json());
exports.userRouter.get("/", (_req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const user = yield database_1.collections.users.find({}).toArray();
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })
);
exports.userRouter.get("/:id", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
      const id =
        (_a = req === null || req === void 0 ? void 0 : req.params) === null ||
        _a === void 0
          ? void 0
          : _a.id;
      const query = { _id: new mongodb.ObjectId(id) };
      const user = yield database_1.collections.users.findOne(query);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send(`Failed to find an user: ID ${id}`);
      }
    } catch (error) {
      res
        .status(404)
        .send(
          `Failed to find an user: ID ${
            (_b = req === null || req === void 0 ? void 0 : req.params) ===
              null || _b === void 0
              ? void 0
              : _b.id
          }`
        );
    }
  })
);
exports.userRouter.post("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const user = req.body;
      const result = yield database_1.collections.users.insertOne(user);
      if (result.acknowledged) {
        res.status(201).send(`Added a new User: ID ${result.insertedId}.`);
      } else {
        res.status(500).send("Failed to Add a new User.");
      }
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  })
);
//# sourceMappingURL=user.routes.js.map
