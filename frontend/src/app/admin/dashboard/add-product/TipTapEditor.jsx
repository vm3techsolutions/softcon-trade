// components/TiptapEditor.tsx or .js
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const TiptapEditor = ({ onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing...</p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Send updated content to parent
    },
  });

  if (!editor) return null;

  return (
    <div className="p-4 space-y-4 border rounded-lg">
      {/* Toolbar */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          • List
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="border p-2 min-h-[150px]" />
    </div>
  );
};

export default TiptapEditor;
