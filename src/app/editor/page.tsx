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
            <div className="h-full flex items-center justify-center bg-[#1e1e1e] text-gray-400">
                <Loader2 className="animate-spin" size={24} />
            </div>
        ),
    }
);

export default function EditorPage() {

    const [showSQL, setShowSQL] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const { activeFile, getFileContent, root } = useFilesStore();
    const { setIsRunning, addConsoleMessage, clearConsole, isConsoleOpen } = useEditorStore();

    // Simple PHP interpreter simulation (for demo purposes)
    // In production, you would use php-wasm
    const runPHP = useCallback(() => {
        setIsRunning(true);
        clearConsole();
        addConsoleMessage('info', '🚀 Running PHP...');

        setTimeout(() => {
            try {
                // Get the main PHP file content
                const phpContent = getFileContent('/index.php');

                if (!phpContent) {
                    addConsoleMessage('error', '❌ No index.php file found');
                    setIsRunning(false);
                    return;
                }

                // Simple PHP simulation - in production use php-wasm
                let output = simulatePHP(phpContent);

                setPreviewHtml(output);
                addConsoleMessage('output', '✅ Execution completed');
                addConsoleMessage('info', `📄 Output: ${output.length} characters`);
            } catch (error: any) {
                addConsoleMessage('error', `❌ Error: ${error.message}`);
            } finally {
                setIsRunning(false);
            }
        }, 500);
    }, [getFileContent, setIsRunning, addConsoleMessage, clearConsole]);

    // Auto-run on initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            runPHP();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-screen flex flex-col bg-[#1e1e1e]">
            {/* Navbar */}
            <Navbar />

            {/* Toolbar */}
            <EditorToolbar
                onRun={runPHP}
                onToggleSQL={() => setShowSQL(!showSQL)}
                showSQL={showSQL}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* File Explorer */}
                <div className="w-64 flex-shrink-0 border-r border-gray-700">
                    <FileExplorer />
                </div>

                {/* Editor + Preview */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <FileTabs />

                    {/* Editor and Preview */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Code Editor */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <CodeEditor />
                        </div>

                        {/* Preview Panel */}
                        <div className="w-[400px] flex-shrink-0 border-l border-gray-700">
                            <PreviewPanel html={previewHtml} />
                        </div>

                        {/* SQL Editor (conditionally shown) */}
                        {showSQL && (
                            <div className="w-[400px] flex-shrink-0">
                                <SQLEditor isOpen={showSQL} />
                            </div>
                        )}
                    </div>

                    {/* Console Panel */}
                    {isConsoleOpen && (
                        <div className="h-48 flex-shrink-0">
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

    // Extract content between <?php and ?> or to end
    const phpMatch = code.match(/<\?php([\s\S]*?)(?:\?>|$)/);
    if (!phpMatch) {
        return code; // Return as HTML if no PHP
    }

    const phpCode = phpMatch[1];

    // Simple variable extraction
    const variables: Record<string, any> = {};

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

    // Extract echo statements and process them
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
        const itemVar = foreachMatch[2];
        const loopBody = foreachMatch[3];

        const arr = variables[arrayName];
        if (Array.isArray(arr)) {
            for (const item of arr) {
                // Extract echo in loop body
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

        // Find function calls
        const callMatch = phpCode.match(new RegExp(`echo\\s+["']<p>["']\\s*\\.\\s*${funcName}\\s*\\(["']([^"']+)["']\\)\\s*\\.\\s*["']</p>["'];`));
        if (callMatch) {
            output += `<p>${prefix}${callMatch[1]}${suffix}</p>`;
        }
    }

    // If no output was generated, return a simple message
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
