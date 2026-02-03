'use client';

import {
    Play,
    Download,
    RotateCcw,
    Database,
    Terminal,
    Loader2
} from 'lucide-react';
import { useEditorStore, useFilesStore } from '@/store';
import JSZip from 'jszip';
import { VirtualFile } from '@/types';

interface EditorToolbarProps {
    onRun: () => void;
    onToggleSQL: () => void;
    showSQL: boolean;
}

export function EditorToolbar({ onRun, onToggleSQL, showSQL }: EditorToolbarProps) {
    const { isRunning, toggleConsole, isConsoleOpen } = useEditorStore();
    const { root, resetProject } = useFilesStore();

    const handleDownload = async () => {
        const zip = new JSZip();

        const addFilesToZip = (file: VirtualFile, folder: JSZip) => {
            if (file.type === 'file' && file.content !== undefined) {
                folder.file(file.name, file.content);
            } else if (file.type === 'folder' && file.children) {
                const newFolder = file.path === '/' ? folder : folder.folder(file.name)!;
                file.children.forEach((child) => addFilesToZip(child, newFolder));
            }
        };

        addFilesToZip(root, zip);

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'php-project.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        if (confirm('Reset project to default? All changes will be lost.')) {
            resetProject();
        }
    };

    const buttonBase: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    };

    const iconButtonBase: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        background: '#374151',
        color: '#d1d5db',
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            backgroundColor: '#1f2937',
            borderBottom: '1px solid #374151',
            height: '48px',
            flexShrink: 0,
        }}>
            {/* Left side - Run controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    onClick={onRun}
                    disabled={isRunning}
                    style={{
                        ...buttonBase,
                        background: isRunning
                            ? '#4b5563'
                            : 'linear-gradient(135deg, #22c55e, #059669)',
                        color: 'white',
                        opacity: isRunning ? 0.7 : 1,
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isRunning ? (
                        <>
                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Running...</span>
                        </>
                    ) : (
                        <>
                            <Play size={16} />
                            <span>Run</span>
                        </>
                    )}
                </button>

                <div style={{ width: '1px', height: '24px', backgroundColor: '#4b5563', margin: '0 4px' }} />

                <button
                    onClick={onToggleSQL}
                    style={{
                        ...buttonBase,
                        background: showSQL ? 'rgba(139, 92, 246, 0.2)' : '#374151',
                        color: showSQL ? '#a78bfa' : '#d1d5db',
                        border: showSQL ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid transparent',
                    }}
                >
                    <Database size={16} />
                    <span>SQL</span>
                </button>

                <button
                    onClick={toggleConsole}
                    style={{
                        ...buttonBase,
                        background: isConsoleOpen ? 'rgba(59, 130, 246, 0.2)' : '#374151',
                        color: isConsoleOpen ? '#60a5fa' : '#d1d5db',
                        border: isConsoleOpen ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
                    }}
                >
                    <Terminal size={16} />
                    <span>Console</span>
                </button>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    onClick={handleReset}
                    style={iconButtonBase}
                    title="Reset project"
                >
                    <RotateCcw size={16} />
                </button>

                <button
                    onClick={handleDownload}
                    style={{
                        ...buttonBase,
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        color: 'white',
                    }}
                >
                    <Download size={16} />
                    <span>Download ZIP</span>
                </button>
            </div>
        </div>
    );
}
