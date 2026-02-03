'use client';

import {
    Play,
    Download,
    RotateCcw,
    Sun,
    Moon,
    Settings,
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
    const { theme, setTheme, isRunning, toggleConsole, isConsoleOpen } = useEditorStore();
    const { root, resetProject } = useFilesStore();

    const handleDownload = async () => {
        const zip = new JSZip();

        // Recursively add files to zip
        const addFilesToZip = (file: VirtualFile, folder: JSZip) => {
            if (file.type === 'file' && file.content !== undefined) {
                folder.file(file.name, file.content);
            } else if (file.type === 'folder' && file.children) {
                const newFolder = file.path === '/' ? folder : folder.folder(file.name)!;
                file.children.forEach((child) => addFilesToZip(child, newFolder));
            }
        };

        addFilesToZip(root, zip);

        // Generate and download zip
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

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700">
            {/* Left side - Run controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onRun}
                    disabled={isRunning}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200 shadow-lg
            ${isRunning
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-green-500/25'
                        }
          `}
                >
                    {isRunning ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Running...</span>
                        </>
                    ) : (
                        <>
                            <Play size={18} />
                            <span>Run</span>
                        </>
                    )}
                </button>

                <div className="w-px h-6 bg-gray-700 mx-2" />

                <button
                    onClick={onToggleSQL}
                    className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
            ${showSQL
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
          `}
                >
                    <Database size={16} />
                    <span>SQL</span>
                </button>

                <button
                    onClick={toggleConsole}
                    className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
            ${isConsoleOpen
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
          `}
                >
                    <Terminal size={16} />
                    <span>Console</span>
                </button>
            </div>

            {/* Right side - Settings */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
                    className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    title={theme === 'vs-dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                >
                    {theme === 'vs-dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button
                    onClick={handleReset}
                    className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    title="Reset project"
                >
                    <RotateCcw size={18} />
                </button>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                >
                    <Download size={18} />
                    <span>Download ZIP</span>
                </button>
            </div>
        </div>
    );
}
