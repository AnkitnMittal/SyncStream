import { useRoomForm } from '../hooks/useRoomForm.js';

export default function FormComponent() {
  const { formData, handleInputChange, createNewRoom, joinExistingRoom } = useRoomForm();

  return (
    <div className='flex w-full max-w-md flex-col items-center justify-center gap-4 p-4 sm:p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl'>
      <form onSubmit={joinExistingRoom} className='w-full space-y-4'>
        <div>
          <label
            htmlFor='username'
            className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1'
          >
            Your Name
          </label>
          <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleInputChange}
            placeholder='e.g., itsquixel'
            className='w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-100'
          />
        </div>
        <div className='border-t border-slate-800 pt-4 space-y-3'>
          <button
            type='button'
            onClick={createNewRoom}
            className='w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition shadow-md'
          >
            Create Secure Coding Canvas Room
          </button>

          <div>
            <label
              htmlFor='password'
              className='block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1'
            >
              Optional Room Password / PIN
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Leave blank for open access'
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-100'
            />
          </div>
        </div>

        <div className='relative my-6 flex py-2 items-center'>
          <div className='grow border-t border-slate-800'></div>
          <span className='shrink mx-4 text-xs font-bold uppercase tracking-widest text-slate-600 select-none'>
            OR JOIN EXISTING
          </span>
          <div className='grow border-t border-slate-800'></div>
        </div>

        <div className='space-y-3'>
          <div>
            <label
              htmlFor='roomId'
              className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1'
            >
              Room ID
            </label>
            <input
              type='text'
              id='roomId'
              name='roomId'
              value={formData.roomId}
              onChange={handleInputChange}
              placeholder='Paste unique Room UUID'
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:border-indigo-500 text-slate-100'
            />
          </div>

          <button
            type='submit'
            className='w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-lg text-sm transition shadow-sm'
          >
            Join Room via Credentials
          </button>
        </div>
      </form>
    </div>
  );
}
