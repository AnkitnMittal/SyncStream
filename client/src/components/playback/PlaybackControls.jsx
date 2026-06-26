export default function PlaybackControls({
  eventsLength,
  currentStep,
  isPlaying,
  onTogglePlay,
  onStepChange,
  onPause,
}) {
  return (
    <footer className='bg-slate-900 border-t border-slate-800 p-6 space-y-4'>
      <div className='flex items-center space-x-4'>
        <button
          onClick={onTogglePlay}
          disabled={eventsLength === 0}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition shadow-md cursor-pointer ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isPlaying ? 'Pause' : 'Play Replay'}
        </button>

        <input
          type='range'
          min='0'
          max={eventsLength}
          value={currentStep}
          onChange={(e) => {
            onPause();
            onStepChange(Number(e.target.value));
          }}
          className='flex-1 accent-indigo-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer border border-slate-800'
        />

        <span className='text-xs font-mono text-slate-400 min-w-20 text-right'>
          {currentStep} / {eventsLength} frames
        </span>
      </div>
    </footer>
  );
}
