'use client';

import { useRef } from 'react';
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

        editor.addCommand(
            2097 | 49,
            () => {
                // Auto-saved on change
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
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111827',
                color: '#9ca3af',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                    <p style={{ fontSize: '16px', marginBottom: '8px' }}>Select a file to start editing</p>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        Click on a file in the explorer to open it
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, height: '100%' }}>
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
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        backgroundColor: '#111827',
                        color: '#9ca3af',
                        gap: '12px',
                    }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            border: '2px solid #8b5cf6',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }} />
                        <span>Loading editor...</span>
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
