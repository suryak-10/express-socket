import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from "socket.io";
import { registerSocketHandlers } from './socket';

const app = express();
const port = process.env.PORT || 1000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust the CORS policy as needed
    },
});

registerSocketHandlers(io);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello surya' + Math.random());
});

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});