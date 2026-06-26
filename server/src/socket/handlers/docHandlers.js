import { roomService } from '../../services/roomService.js';
import { docService } from '../../services/docService.js';

export async function updateLanguage({ language }) {
  const socket = this;
  const roomId = socket.roomId;

  if (!roomId) return;

  try {
    await roomService.updateRoomLanguage(roomId, language);

    socket.to(roomId).emit('room_language_changed', { language });
  } catch (err) {
    console.error('Failed to update room language state:', err);
  }
}

export async function syncDocUpdate({ update }) {
  const socket = this;
  const roomId = socket.roomId;

  if (!roomId) return;

  const binaryUpdate = Array.isArray(update) ? Buffer.from(update) : update;

  socket.to(roomId).emit('sync_doc_update', { update: binaryUpdate });

  try {
    await docService.saveDocumentDelta(roomId, socket.username, binaryUpdate);
  } catch (err) {
    console.error('Failed to log distributed data steps:', err);
  }
}
