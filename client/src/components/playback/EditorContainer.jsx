import Editor from '@monaco-editor/react';

export default function EditorContainer({ editorRef, language }) {
  return (
    <div className='flex-1 w-full bg-[#1e1e1e] overflow-hidden'>
      <Editor
        height='100%'
        language={language}
        theme='vs-dark'
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        options={{
          readOnly: true,
          fontSize: 14,
          fontFamily: "'Fira Code', monospace",
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
}
