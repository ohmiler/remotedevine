'use client';

import { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    File,
    Folder,
    FolderOpen,
    FilePlus,
    FolderPlus,
    Trash2,
    Edit2
} from 'lucide-react';
import { useFilesStore } from '@/store';
import { VirtualFile } from '@/types';

interface FileTreeItemProps {
    file: VirtualFile;
    depth: number;
}

function FileTreeItem({ file, depth }: FileTreeItemProps) {
    const [isExpanded, setIsExpanded] = useState(depth === 0);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(file.name);
    const [isHovered, setIsHovered] = useState(false);

    const {
        selectedPath,
        setSelectedPath,
        openFile,
        createFile,
        deleteFile,
        renameFile
    } = useFilesStore();

    const isSelected = selectedPath === file.path;
    const isFolder = file.type === 'folder';
    const isRoot = file.path === '/';

    const handleClick = () => {
        setSelectedPath(file.path);
        if (isFolder) {
            setIsExpanded(!isExpanded);
        } else {
            openFile(file.path);
        }
    };

    const handleCreateFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        const name = prompt('Enter file name:');
        if (name) {
            createFile(file.path, name, 'file');
            setIsExpanded(true);
        }
    };

    const handleCreateFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        const name = prompt('Enter folder name:');
        if (name) {
            createFile(file.path, name, 'folder');
            setIsExpanded(true);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Delete "${file.name}"?`)) {
            deleteFile(file.path);
        }
    };

    const handleRename = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsRenaming(true);
        setNewName(file.name);
    };

    const handleRenameSubmit = () => {
        if (newName && newName !== file.name) {
            renameFile(file.path, newName);
        }
        setIsRenaming(false);
    };

    const getFileIconColor = () => {
        if (isFolder) return '#eab308';
        const ext = file.name.split('.').pop()?.toLowerCase();
        const colors: Record<string, string> = {
            php: '#a78bfa',
            js: '#fbbf24',
            ts: '#3b82f6',
            css: '#06b6d4',
            html: '#f97316',
            json: '#22c55e',
            sql: '#ef4444',
            md: '#9ca3af',
        };
        return colors[ext || ''] || '#9ca3af';
    };

    return (
        <div>
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    paddingLeft: `${depth * 12 + 8}px`,
                    cursor: 'pointer',
                    backgroundColor: isSelected
                        ? 'rgba(139, 92, 246, 0.2)'
                        : isHovered
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'transparent',
                    color: isSelected ? 'white' : '#d1d5db',
                    borderRadius: '4px',
                    margin: '1px 4px',
                    fontSize: '13px',
                    userSelect: 'none',
                }}
            >
                {isFolder && (
                    <span style={{ width: '16px', display: 'flex', alignItems: 'center' }}>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}

                <span style={{ display: 'flex', alignItems: 'center', color: getFileIconColor() }}>
                    {isFolder ? (
                        isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
                    ) : (
                        <File size={16} />
                    )}
                </span>

                {isRenaming ? (
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSubmit();
                            if (e.key === 'Escape') setIsRenaming(false);
                        }}
                        style={{
                            flex: 1,
                            background: '#374151',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: 'none',
                            outline: 'none',
                            color: 'white',
                            fontSize: '13px',
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {file.name}
                    </span>
                )}

                {isHovered && !isRenaming && !isRoot && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {isFolder && (
                            <>
                                <button
                                    onClick={handleCreateFile}
                                    style={{
                                        padding: '4px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#9ca3af',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    title="New File"
                                >
                                    <FilePlus size={14} />
                                </button>
                                <button
                                    onClick={handleCreateFolder}
                                    style={{
                                        padding: '4px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#9ca3af',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    title="New Folder"
                                >
                                    <FolderPlus size={14} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleRename}
                            style={{
                                padding: '4px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Rename"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: '4px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#f87171',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {isFolder && isExpanded && file.children && (
                <div>
                    {file.children
                        .sort((a, b) => {
                            if (a.type !== b.type) {
                                return a.type === 'folder' ? -1 : 1;
                            }
                            return a.name.localeCompare(b.name);
                        })
                        .map((child) => (
                            <FileTreeItem key={child.id} file={child} depth={depth + 1} />
                        ))}
                </div>
            )}
        </div>
    );
}

export function FileExplorer() {
    const { root, createFile } = useFilesStore();

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1f2937',
            color: '#d1d5db',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: '1px solid #374151',
            }}>
                <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280',
                }}>
                    Explorer
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                        onClick={() => {
                            const name = prompt('Enter file name:');
                            if (name) createFile('/', name, 'file');
                        }}
                        style={{
                            padding: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        title="New File"
                    >
                        <FilePlus size={16} />
                    </button>
                    <button
                        onClick={() => {
                            const name = prompt('Enter folder name:');
                            if (name) createFile('/', name, 'folder');
                        }}
                        style={{
                            padding: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        title="New Folder"
                    >
                        <FolderPlus size={16} />
                    </button>
                </div>
            </div>

            {/* File Tree */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 0',
            }}>
                {root.children?.map((file) => (
                    <FileTreeItem key={file.id} file={file} depth={0} />
                ))}
            </div>
        </div>
    );
}
