export default function PlaybackHeader({ roomId, activeAuthor, onExit }) {
  return (
    <header className='h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shadow-md'>
      <div className='flex items-center space-x-4'>
        <button
          onClick={onExit}
          className='text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition cursor-pointer'
        >
          ← Exit Player
        </button>
        <div>
          <h1 className='text-md font-semibold text-slate-200'>Session Playback Deck</h1>
          <p className='text-xs text-slate-500 font-mono'>Room UUID: {roomId}</p>
        </div>
      </div>
      <div className='flex items-center space-x-3'>
        <span className='text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800'>
          Active Typist: <span className='text-indigo-400 font-bold'>{activeAuthor || 'None'}</span>
        </span>
      </div>
    </header>
  );
}
