import fs from 'fs';
import path from 'path';

const ROOMS_DIR = path.join(__dirname, 'rooms');

export const ensureRoomsDirExists = () => {
    if (!fs.existsSync(ROOMS_DIR)) {
        fs.mkdirSync(ROOMS_DIR);
    }
};

type JsonFile = {
    roomId: string,
    data: any[],
}

export const getRoomFilePath = (roomId: string): string => {
    return path.join(ROOMS_DIR, `${roomId}.json`);
};

export const readRoomDataFromFile = (roomId: string): JsonFile => {
    const roomFilePath = getRoomFilePath(roomId);
    try {
        if (fs.existsSync(roomFilePath)) {
            const data = fs.readFileSync(roomFilePath, 'utf-8');
            return JSON.parse(data);
        } else {
            return { data: [], roomId }; // Return an empty array if the file does not exist
        }
    } catch (err) {
        console.error(`Error reading data for room ${roomId}:`, err);
        return { data: [], roomId };
    }
};

export const writeRoomDataToFile = (roomId: string, data: JsonFile) => {
    const roomFilePath = getRoomFilePath(roomId);
    try {
        fs.writeFileSync(roomFilePath, JSON.stringify(data, null, 2));
        console.log(`Room data for ${roomId} saved to file`);
    } catch (err) {
        console.error(`Error writing data for room ${roomId}:`, err);
    }
};