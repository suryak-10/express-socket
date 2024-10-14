import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust the CORS policy as needed
    },
});

console.log(io);

io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    // Example of receiving a message from the client
    socket.on("message", (msg) => {
        console.log("Message received:", msg);

        // Broadcasting a message to all connected clients
        io.emit("message", `Broadcasted message: ${msg}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello surya' + Math.random());
});

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});