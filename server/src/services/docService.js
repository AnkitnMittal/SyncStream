import * as Y from 'yjs';
import Room from '../models/Room.js';
import PlaybackEvent from '../models/PlaybackEvent.js';
import { roomService } from './roomService.js';

const activeRooms = new Map();
const SNAPSHOT_TIMEOUT_MS = 10000;

export const docService = {
  async getInitialDocumentState(roomId) {
    const room = await roomService.findRoomById(roomId);

    if (room && room.documentState && room.documentState.length > 0) {
      return Buffer.from(room.documentState);
    }
    return null;
  },

  async getPlaybackStream(roomId) {
    return await PlaybackEvent.find({ roomId }).sort({ timestamp: 1 });
  },

  async saveDocumentDelta(roomId, username, update) {
    const binaryData = Buffer.isBuffer(update) ? update : Buffer.from(update);

    await PlaybackEvent.create({
      roomId,
      username,
      updateData: binaryData,
    });

    if (!activeRooms.has(roomId)) {
      const room = await roomService.findRoomById(roomId);
      const yDoc = new Y.Doc();

      if (room && room.documentState) {
        Y.applyUpdate(yDoc, room.documentState);
      }
      activeRooms.set(roomId, { doc: yDoc, timeout: null });
    }

    const roomState = activeRooms.get(roomId);
    Y.applyUpdate(roomState.doc, binaryData);

    if (roomState.timeout) clearTimeout(roomState.timeout);

    roomState.timeout = setTimeout(() => {
      this.forceSaveSnapshot(roomId);
    }, SNAPSHOT_TIMEOUT_MS);
  },

  async forceSaveSnapshot(roomId) {
    const roomState = activeRooms.get(roomId);
    if (!roomState) return;

    if (roomState.timeout) clearTimeout(roomState.timeout);

    try {
      const compressedState = Y.encodeStateAsUpdate(roomState.doc);

      await Room.findByIdAndUpdate(roomId, {
        documentState: Buffer.from(compressedState),
      });

      console.log(`[Snapshot Created] Room ${roomId} compressed binary snapshot saved.`);

      activeRooms.delete(roomId);
    } catch (err) {
      console.error('Failed to save compressed room state:', err);
    }
  },
};
