'use client';

import { X } from 'lucide-react';
import { useFilesStore } from '@/store';

export function FileTabs() {
    const { openFiles, activeFile, setActiveFile, closeFile, getFile } = useFilesStore();

    if (openFiles.length === 0) {
        return null;
    }

    const getFileIcon = (path: string) => {
        const ext = path.split('.').pop()?.toLowerCase();
        const icons: Record<string, string> = {
            php: '🐘',
            js: '📜',
            ts: '💠',
            css: '🎨',
            html: '🌐',
            json: '📋',
            sql: '🗃️',
            md: '📝',
        };
        return icons[ext || ''] || '📄';
    };

    return (
        <div className="flex bg-[#252526] border-b border-gray-700 overflow-x-auto">
            {openFiles.map((path) => {
                const file = getFile(path);
                const isActive = activeFile === path;

                return (
                    <div
                        key={path}
                        className={`
              flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-gray-700
              transition-colors duration-150 min-w-[120px] max-w-[200px]
              ${isActive
                                ? 'bg-[#1e1e1e] text-white border-t-2 border-t-purple-500'
                                : 'text-gray-400 hover:bg-[#2d2d2d]'
                            }
            `}
                        onClick={() => setActiveFile(path)}
                    >
                        <span className="text-sm">{getFileIcon(path)}</span>
                        <span className="flex-1 truncate text-sm">{file?.name || path}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeFile(path);
                            }}
                            className="p-0.5 hover:bg-white/10 rounded opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
