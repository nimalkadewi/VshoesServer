require("dotenv").config();

import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import jwt from "jsonwebtoken";
import authenticateToken from "./middleware/authMiddleware";

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", async (req, res) => {
  try {
    /*const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };*/
    const user = await collections.users.find({}).toArray();

    if (user) {
      res.status(200).send(user);
    } else {
      /*res.status(404).send(`Failed to find an user: ID ${id}`);*/
    }
  } catch (error) {
    /*res.status(404).send(`Failed to find an user: ID ${req?.params?.id}`);*/
    res.status(500).send(error.message);
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const result = await collections.users.insertOne(user);

    if (result.acknowledged) {
      const accessToken = jwt.sign(
        {
          email: user.email,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessToken: accessToken });
      /*res.status(201).send(`Added a new User: ID ${result.insertedId}.`);*/
      console.log(`Added a new User: ID ${result.insertedId}.`);
    } else {
      res.status(500).send("Failed to Add a new User.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

userRouter.get("/login", authenticateToken, async (req: any, res: any) => {
  try {
    console.log(req.user);
    const users = await collections.users.findOne({
      email: req.user.email,
    });

    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = req.body;

    const userEmail = user.email;
    const userPassword = user.password;

    const result = await collections.users.findOne({
      email: userEmail,
      password: userPassword,
    });

    if (result) {
      const accessToken = jwt.sign(
        {
          email: result.email,
          role: result.role,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      // res.json({ accessToken: accessToken });

      // sessionStorage.setItem("user", result._id.toString());
      // sessionStorage.setItem("token", accessToken);
      // console.log(result);
      res.status(200).send(result);

      /*if (result.role == 'admin') {
        res.redirect("http://127.0.0.1:4200/admin");
      } else {
        res.redirect("http://127.0.0.1:4200/");
      }*/
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});
