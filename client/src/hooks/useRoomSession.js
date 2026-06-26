import { useState, useEffect, useCallback } from 'react';
import { useSocketService } from '../context/SocketContext';

export function useRoomSession(roomId, username, password, navigate) {
  const { emitEvent, registerListener, connectSocket, disconnectSocket } = useSocketService();
  const [language, setLanguage] = useState('javascript');
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    connectSocket();
    emitEvent('join_room', { roomId, password, username });

    return () => {
      disconnectSocket();
    };
  }, [roomId, username, password]);

  useEffect(() => {
    const cleanups = [];

    const handleRosterSync = (roster) => {
      setParticipants(
        roster.map((user) => ({
          id: user.id,
          name: user.name,
          isYou: false,
        })),
      );
    };

    const handlePeerJoined = (peer) => {
      setParticipants((prev) =>
        prev.some((p) => p.id === peer.id) ? prev : [...prev, { ...peer, isYou: false }],
      );
    };

    const handlePeerLeft = (peer) => {
      setParticipants((prev) => prev.filter((p) => p.id !== peer.id));
    };

    const handleLanguageChanged = ({ language: peerLanguage }) => {
      setLanguage(peerLanguage);
    };

    const handleJoinError = (err) => {
      alert(err.message);
      navigate('/');
    };

    const eventBindingMap = [
      { event: 'room_roster_sync', handler: handleRosterSync },
      { event: 'peer_joined', handler: handlePeerJoined },
      { event: 'peer_left', handler: handlePeerLeft },
      { event: 'room_language_changed', handler: handleLanguageChanged },
      { event: 'join_error', handler: handleJoinError },
    ];

    eventBindingMap.forEach(({ event, handler }) => {
      const unbind = registerListener(event, handler);
      if (unbind) cleanups.push(unbind);
    });

    return () => {
      cleanups.forEach((unbind) => unbind());
    };
  }, [navigate]);

  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage);
      emitEvent('update_room_language', { language: newLanguage });
    },
    [emitEvent],
  );

  return { language, participants, handleLanguageChange };
}
