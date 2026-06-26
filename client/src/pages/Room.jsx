import { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Sidebar from '../components/room/Sidebar';
import Toolbar from '../components/room/Toolbar';
import CodeEditor from '../components/room/CodeEditor';

import { useRoomSession } from '../hooks/useRoomSession';
import { useCollaborativeEditor } from '../hooks/useCollaborativeEditor';
import { useSocketService } from '../context/SocketContext';

export default function Room() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  const [editorInstance, setEditorInstance] = useState(null);
  const [fallbackName] = useState(() => `Developer-${Math.floor(Math.random() * 1000)}`);

  const { username, password } = useMemo(() => {
    const urlUsername = searchParams.get('username');

    return {
      username: state?.username || urlUsername || fallbackName,
      password: state?.password || searchParams.get('password') || '',
    };
  }, [state, searchParams, fallbackName]);

  useEffect(() => {
    if (!roomId) {
      navigate('/', { replace: true });
    }
  }, [roomId, navigate]);

  const { language, participants, handleLanguageChange } = useRoomSession(
    roomId,
    username,
    password,
    navigate,
  );

  const { socket } = useSocketService();

  useCollaborativeEditor(socket, roomId, editorInstance);

  const clientMappedParticipants = useMemo(() => {
    return participants.map((p) => ({
      ...p,
      isYou: p.id === socket?.id,
    }));
  }, [participants, socket?.id]);

  return (
    <div className='flex h-screen w-screen overflow-hidden bg-slate-950 select-none'>
      <Sidebar participants={clientMappedParticipants} />

      <main className='flex-1 flex flex-col h-full overflow-hidden'>
        <Toolbar language={language} setLanguage={handleLanguageChange} />

        <div className='flex-1 w-full h-full overflow-hidden bg-[#1e1e1e]'>
          <CodeEditor language={language} onMount={setEditorInstance} />
        </div>
      </main>
    </div>
  );
}
