import { joinRoom, handleDisconnect, handleRequestInitialState } from './handlers/roomHandlers.js';
import { updateLanguage, syncDocUpdate } from './handlers/docHandlers.js';

export function registerSocketEvents(io) {
  io.on('connection', (socket) => {
    console.log(`WebSocket Connected: ${socket.id}`);

    socket.on('join_room', joinRoom);
    socket.on('request_initial_state', handleRequestInitialState);
    socket.on('disconnect', handleDisconnect);

    socket.on('update_room_language', updateLanguage);
    socket.on('sync_doc_update', syncDocUpdate);
  });
}
