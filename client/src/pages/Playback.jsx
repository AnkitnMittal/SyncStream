import { useParams, useNavigate } from 'react-router-dom';

import PlaybackHeader from '../components/playback/PlaybackHeader';
import EditorContainer from '../components/playback/EditorContainer';
import PlaybackControls from '../components/playback/PlaybackControls';

import { usePlaybackSession } from '../hooks/usePlaybackSession';

export default function Playback() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const {
    events,
    playbackLanguage,
    currentStep,
    setCurrentStep,
    isPlaying,
    setIsPlaying,
    activeAuthor,
    isLoading,
    editorRef,
  } = usePlaybackSession(roomId);

  if (isLoading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-slate-950 font-mono text-slate-400'>
        Assembling Chronological Mutation Tracks...
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen w-screen bg-slate-950 text-slate-100 select-none'>
      <PlaybackHeader roomId={roomId} activeAuthor={activeAuthor} onExit={() => navigate('/')} />

      <EditorContainer editorRef={editorRef} language={playbackLanguage} />

      <PlaybackControls
        eventsLength={events.length}
        currentStep={currentStep}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepChange={(step) => setCurrentStep(step)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
