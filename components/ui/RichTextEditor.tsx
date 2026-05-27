"use client";

import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Start typing here...", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef(value);

  // Synchronize internal editor content with outer value
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      const safeVal = value === "N/A" ? "" : value;
      editorRef.current.innerHTML = safeVal;
      lastHtmlRef.current = safeVal;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html !== lastHtmlRef.current) {
        lastHtmlRef.current = html;
        const cleanHtml = editorRef.current.innerText.trim() === "" && !html.includes('<img') && !html.includes('<iframe') ? "" : html;
        onChange(cleanHtml);
      }
    }
  };

  const applyFormat = (command: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      try {
        document.execCommand('styleWithCSS', false, 'true');
      } catch (e) { }
      document.execCommand(command, false, '');
      handleInput();
    }
  };

  return (
    <div className={`relative flex flex-col border border-stone-300 rounded-md bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 ${className}`}>
      {/* Rich Text Toolbar - Bold only */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-50/80 border-b border-stone-200 select-none">
        
        <div className="flex items-center border border-stone-300 rounded bg-white shadow-sm overflow-hidden">
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}
            className="flex items-center justify-center w-8 h-8 hover:bg-stone-100 transition-colors"
            title="Bold"
          >
            <span className="font-extrabold text-stone-800 text-[13px] font-sans">B</span>
          </button>
        </div>

      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rich-editor-content flex-1 min-h-[120px] p-3 text-sm text-stone-800 focus:outline-none overflow-y-auto whitespace-pre-wrap prose prose-stone max-w-none"
        data-placeholder={placeholder}
        style={{ minHeight: '120px' }}
      />
    </div>
  );
}
