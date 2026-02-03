'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout';
import { CodeEditor, FileExplorer, FileTabs, EditorToolbar } from '@/components/editor';
import { ConsolePanel, PreviewPanel } from '@/components/preview';
import { useFilesStore, useEditorStore } from '@/store';
import { Loader2 } from 'lucide-react';

// Dynamic import SQLEditor to avoid SSR issues with sql.js
const SQLEditor = dynamic(
    () => import('@/components/database/SQLEditor').then((mod) => mod.SQLEditor),
    {
        ssr: false,
        loading: () => (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111827',
                color: '#9ca3af',
            }}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        ),
    }
);

export default function EditorPage() {
    const [showSQL, setShowSQL] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const { getFileContent } = useFilesStore();
    const { setIsRunning, addConsoleMessage, clearConsole, isConsoleOpen } = useEditorStore();

    const runPHP = useCallback(() => {
        setIsRunning(true);
        clearConsole();
        addConsoleMessage('info', '🚀 Running PHP...');

        setTimeout(() => {
            try {
                const phpContent = getFileContent('/index.php');

                if (!phpContent) {
                    addConsoleMessage('error', '❌ No index.php file found');
                    setIsRunning(false);
                    return;
                }

                const output = simulatePHP(phpContent);

                setPreviewHtml(output);
                addConsoleMessage('output', '✅ Execution completed');
                addConsoleMessage('info', `📄 Output: ${output.length} characters`);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                addConsoleMessage('error', `❌ Error: ${message}`);
            } finally {
                setIsRunning(false);
            }
        }, 500);
    }, [getFileContent, setIsRunning, addConsoleMessage, clearConsole]);

    useEffect(() => {
        const timer = setTimeout(() => {
            runPHP();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#111827',
            overflow: 'hidden',
        }}>
            {/* Navbar */}
            <Navbar />

            {/* Toolbar */}
            <EditorToolbar
                onRun={runPHP}
                onToggleSQL={() => setShowSQL(!showSQL)}
                showSQL={showSQL}
            />

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
            }}>
                {/* File Explorer */}
                <div style={{
                    width: '240px',
                    flexShrink: 0,
                    borderRight: '1px solid #374151',
                }}>
                    <FileExplorer />
                </div>

                {/* Editor + Preview */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {/* Tabs */}
                    <FileTabs />

                    {/* Editor and Preview */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        overflow: 'hidden',
                    }}>
                        {/* Code Editor */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}>
                            <CodeEditor />
                        </div>

                        {/* Preview Panel */}
                        <div style={{
                            width: '400px',
                            flexShrink: 0,
                            borderLeft: '1px solid #374151',
                        }}>
                            <PreviewPanel html={previewHtml} />
                        </div>

                        {/* SQL Editor (conditionally shown) */}
                        {showSQL && (
                            <div style={{
                                width: '400px',
                                flexShrink: 0,
                                borderLeft: '1px solid #374151',
                            }}>
                                <SQLEditor isOpen={showSQL} />
                            </div>
                        )}
                    </div>

                    {/* Console Panel */}
                    {isConsoleOpen && (
                        <div style={{
                            height: '180px',
                            flexShrink: 0,
                        }}>
                            <ConsolePanel />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple PHP simulation for demo (replace with php-wasm in production)
function simulatePHP(code: string): string {
    let output = '';

    const phpMatch = code.match(/<\?php([\s\S]*?)(?:\?>|$)/);
    if (!phpMatch) {
        return code;
    }

    const phpCode = phpMatch[1];
    const variables: Record<string, string | string[]> = {};

    // Extract simple variable assignments
    const varMatches = phpCode.matchAll(/\$(\w+)\s*=\s*["']([^"']*)["'];/g);
    for (const match of varMatches) {
        variables[match[1]] = match[2];
    }

    // Extract array assignments
    const arrayMatches = phpCode.matchAll(/\$(\w+)\s*=\s*\[(.*?)\];/gs);
    for (const match of arrayMatches) {
        const items = match[2].match(/["']([^"']+)["']/g)?.map(s => s.replace(/["']/g, '')) || [];
        variables[match[1]] = items;
    }

    // Simple date() simulation
    const year = new Date().getFullYear().toString();
    variables['year'] = year;

    // Extract echo statements
    const echoMatches = phpCode.matchAll(/echo\s+["']([^"']*)["'];|echo\s+["']([^"]*)\$(\w+)([^"']*)["'];/g);
    for (const match of echoMatches) {
        if (match[1]) {
            output += match[1];
        } else if (match[2] !== undefined) {
            let text = match[2];
            const varName = match[3];
            const after = match[4] || '';
            if (variables[varName] !== undefined) {
                text += variables[varName];
            } else {
                text += `$${varName}`;
            }
            text += after;
            output += text;
        }
    }

    // Handle foreach loops
    const foreachMatch = phpCode.match(/foreach\s*\(\$(\w+)\s+as\s+\$(\w+)\)\s*\{([^}]+)\}/);
    if (foreachMatch) {
        const arrayName = foreachMatch[1];
        const loopBody = foreachMatch[3];

        const arr = variables[arrayName];
        if (Array.isArray(arr)) {
            for (const item of arr) {
                const loopEchoMatch = loopBody.match(/echo\s+["']<(\w+)>\$\w+<\/\1>["'];/);
                if (loopEchoMatch) {
                    const tag = loopEchoMatch[1];
                    output += `<${tag}>${item}</${tag}>`;
                }
            }
        }
    }

    // Handle simple function calls
    const funcMatch = phpCode.match(/function\s+(\w+)\s*\(\$(\w+)\)\s*\{[^}]*return\s+["']([^"']*)["']\s*\.\s*\$\2\s*\.\s*["']([^"']*)["'];?\s*\}/);
    if (funcMatch) {
        const funcName = funcMatch[1];
        const prefix = funcMatch[3];
        const suffix = funcMatch[4];

        const callMatch = phpCode.match(new RegExp(`echo\\s+["']<p>["']\\s*\\.\\s*${funcName}\\s*\\(["']([^"']+)["']\\)\\s*\\.\\s*["']</p>["'];`));
        if (callMatch) {
            output += `<p>${prefix}${callMatch[1]}${suffix}</p>`;
        }
    }

    if (!output.trim()) {
        output = `<div style="padding: 20px; font-family: system-ui;">
      <h1 style="color: #8b5cf6;">🐘 PHP Playground</h1>
      <p>Your PHP code is ready!</p>
      <p style="color: #888;">Note: This is a simplified PHP simulator for demo purposes.</p>
      <p style="color: #888;">Full PHP support via php-wasm will be added in the next phase.</p>
      <hr style="border-color: #333; margin: 20px 0;">
      <h3>Your code:</h3>
      <pre style="background: #1e1e1e; color: #9cdcfe; padding: 16px; border-radius: 8px; overflow: auto;">${escapeHtml(code)}</pre>
    </div>`;
    }

    return output;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
