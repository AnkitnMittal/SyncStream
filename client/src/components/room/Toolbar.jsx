export default function Toolbar({ language, setLanguage }) {
  return (
    <div className='h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shadow-sm'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center space-x-2'>
          <label
            htmlFor='language-select'
            className='text-xs font-semibold text-slate-400 uppercase tracking-wider'
          >
            Language:
          </label>
          <select
            id='language-select'
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className='bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1 focus:outline-none focus:border-indigo-500 font-medium'
          >
            <option value='javascript'>JavaScript</option>
            <option value='typescript'>TypeScript</option>
            <option value='python'>Python</option>
            <option value='html'>HTML / CSS</option>
          </select>
        </div>
      </div>

      <div className='flex items-center space-x-3'>
        <div className='text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 font-mono'>
          Status: <span className='text-emerald-400 font-semibold animate-pulse'>Sync Active</span>
        </div>
      </div>
    </div>
  );
}
