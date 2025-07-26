import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { useState } from 'react';

type Props = { code: string };

const CodeEditor = ({ code }: Props) => {
  const [copied, setCopied] = useState(false);
  const extension = [javascript({ jsx: true, typescript: true })];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='relative'>
      <button
        onClick={copyToClipboard}
        className='absolute top-2 right-2 z-10 rounded bg-gray-700 p-2 text-white transition-colors hover:bg-gray-600'
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <svg
            className='h-4 w-4'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        ) : (
          <svg
            className='h-4 w-4'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' />
            <path d='M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z' />
          </svg>
        )}
      </button>
      <CodeMirror
        value={code}
        theme='dark'
        width='100%'
        extensions={extension}
        className='h-full w-full'
        editable={false}
      />
    </div>
  );
};

export default CodeEditor;
