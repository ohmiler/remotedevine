'use client';

import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useFilesStore, useEditorStore } from '@/store';

export function CodeEditor() {
    const { activeFile, getFileContent, updateFileContent } = useFilesStore();
    const { theme, fontSize } = useEditorStore();
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

    const content = activeFile ? getFileContent(activeFile) : '';
    const language = getLanguageFromPath(activeFile || '');

    const handleEditorMount: OnMount = (editor) => {
        editorRef.current = editor;

        // Add keyboard shortcuts
        editor.addCommand(
            // Ctrl+S to save (we just mark as saved since it's auto-saved)
            2097 /* KeyMod.CtrlCmd */ | 49 /* KeyCode.KeyS */,
            () => {
                // Already auto-saved on change
            }
        );
    };

    const handleChange = (value: string | undefined) => {
        if (activeFile && value !== undefined) {
            updateFileContent(activeFile, value);
        }
    };

    if (!activeFile) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] text-gray-400">
                <div className="text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-lg">Select a file to start editing</p>
                    <p className="text-sm mt-2 text-gray-500">
                        Click on a file in the explorer to open it
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full">
            <Editor
                height="100%"
                language={language}
                value={content}
                theme={theme}
                onChange={handleChange}
                onMount={handleEditorMount}
                options={{
                    fontSize,
                    fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                    fontLigatures: true,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    lineNumbers: 'on',
                    glyphMargin: true,
                    folding: true,
                    foldingStrategy: 'indentation',
                    showFoldingControls: 'always',
                    bracketPairColorization: { enabled: true },
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    padding: { top: 16, bottom: 16 },
                }}
                loading={
                    <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                            <span>Loading editor...</span>
                        </div>
                    </div>
                }
            />
        </div>
    );
}

function getLanguageFromPath(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();

    const languageMap: Record<string, string> = {
        php: 'php',
        js: 'javascript',
        ts: 'typescript',
        jsx: 'javascript',
        tsx: 'typescript',
        json: 'json',
        html: 'html',
        htm: 'html',
        css: 'css',
        scss: 'scss',
        less: 'less',
        md: 'markdown',
        sql: 'sql',
        xml: 'xml',
        yaml: 'yaml',
        yml: 'yaml',
        sh: 'shell',
        bash: 'shell',
        txt: 'plaintext',
    };

    return languageMap[ext || ''] || 'plaintext';
}
