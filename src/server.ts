import { orderRouter } from "./order.routes";
import { userRouter } from "./user.routes";
import { itemRouter } from "./item.routes";
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { createServer } from "http";
import { Server } from "socket.io";
import {cartRouter} from "./cart.routes";
import {order_fRouter} from "./order_f.routes";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());

    app.use("/items", itemRouter);
    app.use("/users", userRouter);
    app.use("/orders", orderRouter);
    app.use("/orders_f", order_fRouter);
    app.use("/carts", cartRouter);

    // start the Express server

    // let app = express();
    const httpServer = createServer(app);

    const io = new Server(httpServer, {});

    const ns = io.of("/chat");

    ns.on("connection", (socket: any) => {
      socket.on("join", (data: any) => {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit("user joined");
      });

      socket.on("message", (data: any) => {
        io.in(data.room).emit("New message", {
          user: data.user,
          message: data.message,
        });
      });
    });
    httpServer.listen(5200, () => {
      console.log(`Server running at http://localhost:5200...`);
    });
  })
  .catch((error) => console.error(error));
