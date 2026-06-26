import { roomService } from '../../services/roomService.js';
import { docService } from '../../services/docService.js';

export async function joinRoom({ roomId, password, username }) {
  const socket = this;
  const io = socket.server;

  try {
    const validatedUsername = await roomService.validateRoomAccess(roomId, password, username);

    socket.roomId = roomId;
    socket.username = validatedUsername;
    await socket.join(roomId);

    const activeSockets = await io.in(roomId).fetchSockets();
    const roster = activeSockets.map(({ id, username }) => ({
      id,
      name: username || 'Anonymous',
    }));

    socket.emit('room_roster_sync', roster);
    socket.to(roomId).emit('peer_joined', {
      id: socket.id,
      name: socket.username,
    });
  } catch (err) {
    console.error(`Error handling join operation for room ${roomId}:`, err);
    socket.emit('join_error', { message: 'Error joining room.' });
  }
}

export async function handleRequestInitialState({ roomId }) {
  const socket = this;
  try {
    const stateBuffer = await docService.getInitialDocumentState(roomId);
    if (stateBuffer) {
      socket.emit('sync_initial_state', stateBuffer);
    }
  } catch (err) {
    console.error(`Error sending initial doc state for room ${roomId}:`, err);
  }
}

export function handleDisconnect() {
  const socket = this;
  if (socket.roomId) {
    const roomId = socket.roomId;

    socket.to(roomId).emit('peer_left', {
      id: socket.id,
      name: socket.username || 'Anonymous',
    });

    socket.leave(roomId);

    const remainingUsers = socket.nsp.adapter.rooms.get(roomId)?.size || 0;
    if (remainingUsers === 0) {
      console.log(`Room ${roomId} is now empty. Forcing state snapshot...`);
      docService.forceSaveSnapshot(roomId);
    }
  }

  console.log(`WebSocket Session Disconnected Cleanly: ${socket.id}`);
}
