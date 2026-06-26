import { v4 as uuidv4 } from 'uuid';
import Room from '../models/Room.js';

export const roomService = {
  async provisionRoom(password) {
    const roomId = uuidv4();
    return await Room.create({
      _id: roomId,
      password: password || null,
      documentState: null,
    });
  },

  async validateRoomAccess(roomId, password, requestedUsername) {
    const room = await this.findRoomById(roomId);

    if (!room) {
      throw new Error('Room not found.');
    }
    if (room.password && room.password !== password) {
      throw new Error('Authentication failed.');
    }

    return requestedUsername || `Developer-${Math.floor(Math.random() * 1000)}`;
  },

  async findRoomById(roomId) {
    return await Room.findById(roomId);
  },

  async updateRoomLanguage(roomId, language) {
    return await Room.findByIdAndUpdate(roomId, { language });
  },
};
