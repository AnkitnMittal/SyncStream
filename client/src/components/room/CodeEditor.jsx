import Editor from '@monaco-editor/react';

export default function CodeEditor({ onMount, language }) {
  function handleEditorDidMount(editor) {
    editor.focus();

    if (onMount) {
      onMount(editor);
    }
  }

  return (
    <div className='flex-1 w-full h-full overflow-hidden bg-[#1e1e1e]'>
      <Editor
        height='100%'
        language={language}
        theme='vs-dark'
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'Courier New', monospace",
          minimap: { enabled: true },
          automaticLayout: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 16, bottom: 16 },
          tabSize: 2,
        }}
        loading={
          <div className='h-full w-full flex items-center justify-center bg-slate-950 text-sm font-mono text-slate-400'>
            Initializing Monaco Runtime Engines...
          </div>
        }
      />
    </div>
  );
}
