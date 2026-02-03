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
        <div style={{
            display: 'flex',
            backgroundColor: '#1f2937',
            borderBottom: '1px solid #374151',
            overflowX: 'auto',
            flexShrink: 0,
        }}>
            {openFiles.map((path) => {
                const file = getFile(path);
                const isActive = activeFile === path;

                return (
                    <div
                        key={path}
                        onClick={() => setActiveFile(path)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            borderRight: '1px solid #374151',
                            minWidth: '120px',
                            maxWidth: '200px',
                            backgroundColor: isActive ? '#111827' : 'transparent',
                            color: isActive ? 'white' : '#9ca3af',
                            borderTop: isActive ? '2px solid #8b5cf6' : '2px solid transparent',
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>{getFileIcon(path)}</span>
                        <span style={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '13px',
                        }}>
                            {file?.name || path}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeFile(path);
                            }}
                            style={{
                                padding: '2px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: 0.6,
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
