export default function Sidebar({ participants = [] }) {
  return (
    <aside className='w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full'>
      <div className='p-4 border-b border-slate-800'>
        <h2 className='text-xs font-bold uppercase tracking-wider text-indigo-400'>
          Active Session
        </h2>
        <h1 className='text-lg font-semibold text-slate-100 truncate mt-0.5'>Development Room</h1>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-bold uppercase tracking-wider text-slate-400'>
            Collaborators ({participants.length})
          </span>
        </div>

        <ul className='space-y-2'>
          {participants.map((user) => (
            <li
              key={user.id}
              className='flex items-center space-x-3 bg-slate-800/50 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-800/80 transition duration-150 group'
            >
              <div className='relative'>
                <div className='w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white uppercase shadow-sm'>
                  {(user.name || '?').charAt(0)}
                </div>
                <span className='absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900' />
              </div>

              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-slate-200 truncate group-hover:text-white'>
                  {user.name || 'Anonymous'}{' '}
                  {user.isYou && (
                    <span className='text-xs text-slate-500 italic font-normal ml-1'>(You)</span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
