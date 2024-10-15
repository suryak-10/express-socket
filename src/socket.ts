import { Server, Socket } from 'socket.io';
import { ensureRoomsDirExists, readRoomDataFromFile, writeRoomDataToFile } from './room';


const ROOM_ID = '1234';
const joinEvent = "join";
const leaveEvent = "leave";
const commonEvents = [joinEvent, leaveEvent];

const roomdata: Record<string, any[]> = {}

export const registerSocketHandlers = (io: Server) => {
    ensureRoomsDirExists();
    io.on("connection", (socket: Socket) => {
        console.log("A user connected:", socket.id);

        socket.on(joinEvent, (data) => {
            const { roomId, ...rest } = JSON.parse(data);
            socket.join(roomId);
            const oldRoomData = readRoomDataFromFile(roomId);
            if (!roomdata[roomId]) {
                roomdata[roomId] = [...oldRoomData.data];
            } else {
                roomdata[roomId] = [...oldRoomData.data, ...roomdata[roomId]];
            }
        })

        socket.on('chat', (data) => {
            const { roomId, ...rest } = JSON.parse(data);
            io.to(roomId).emit('chat', rest);
        });

        // socket.onAny((event, data) => {
        //     const { roomId, ...rest } = JSON.parse(data);
        //     console.log(roomId, data);
        //     if (roomId == undefined || commonEvents.includes(event)) return;
        //     io.to(roomId).emit(event, rest);
        //     roomdata[roomId].push({ event, data: rest });
        // })

        // Leave room
        socket.on(leaveEvent, (data) => {
            const { roomId, ...rest } = JSON.parse(data);
            console.log(roomdata[roomId]);
            socket.leave(roomId);
            writeRoomDataToFile(roomId, { roomId, data: roomdata[roomId] });
            socket.to(roomId).emit('message', `${socket.id} has left the room`);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`${socket.id} left room: ${ROOM_ID}`);
            socket.to(ROOM_ID).emit('message', `${socket.id} has left the room`);
            console.log("User disconnected:", socket.id);
        });
    });

};
