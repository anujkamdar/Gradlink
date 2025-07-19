import "dotenv/config";

import connectDB from "./db/index.js";
import { app } from "./app.js";
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://gradlink-neon.vercel.app"],
    credentials: true,
  },
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
