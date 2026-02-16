'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  title: string;
  code: string;
}

export default function CodeBlock({ title, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={`Copy ${title} to clipboard`}
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-600" />
              <span className="text-green-600">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-3 text-xs font-mono text-gray-800 overflow-x-auto max-h-60 bg-white">
        <code>{code}</code>
      </pre>
    </div>
  );
}
