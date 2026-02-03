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
    const [showActions, setShowActions] = useState(false);

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

    const getFileIcon = () => {
        if (isFolder) {
            return isExpanded ? (
                <FolderOpen size={16} className="text-yellow-500" />
            ) : (
                <Folder size={16} className="text-yellow-500" />
            );
        }

        const ext = file.name.split('.').pop()?.toLowerCase();
        const iconColors: Record<string, string> = {
            php: 'text-purple-400',
            js: 'text-yellow-400',
            ts: 'text-blue-400',
            css: 'text-blue-500',
            html: 'text-orange-500',
            json: 'text-green-400',
            sql: 'text-red-400',
            md: 'text-gray-400',
        };

        return <File size={16} className={iconColors[ext || ''] || 'text-gray-400'} />;
    };

    return (
        <div>
            <div
                className={`
          flex items-center gap-1 px-2 py-1 cursor-pointer select-none
          hover:bg-white/5 rounded-sm transition-colors duration-150
          ${isSelected ? 'bg-purple-500/20 text-white' : 'text-gray-300'}
        `}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={handleClick}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                {isFolder && (
                    <span className="w-4 flex-shrink-0">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}

                <span className="flex-shrink-0">{getFileIcon()}</span>

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
                        className="flex-1 bg-gray-700 px-1 rounded text-sm outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="flex-1 truncate text-sm">{file.name}</span>
                )}

                {showActions && !isRenaming && !isRoot && (
                    <div className="flex items-center gap-1 opacity-60 hover:opacity-100">
                        {isFolder && (
                            <>
                                <button
                                    onClick={handleCreateFile}
                                    className="p-1 hover:bg-white/10 rounded"
                                    title="New File"
                                >
                                    <FilePlus size={14} />
                                </button>
                                <button
                                    onClick={handleCreateFolder}
                                    className="p-1 hover:bg-white/10 rounded"
                                    title="New Folder"
                                >
                                    <FolderPlus size={14} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleRename}
                            className="p-1 hover:bg-white/10 rounded"
                            title="Rename"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400"
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
                            // Folders first, then files
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
        <div className="h-full flex flex-col bg-[#252526] text-gray-300">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Explorer
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            const name = prompt('Enter file name:');
                            if (name) createFile('/', name, 'file');
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="New File"
                    >
                        <FilePlus size={16} />
                    </button>
                    <button
                        onClick={() => {
                            const name = prompt('Enter folder name:');
                            if (name) createFile('/', name, 'folder');
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="New Folder"
                    >
                        <FolderPlus size={16} />
                    </button>
                </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-auto py-2">
                {root.children?.map((file) => (
                    <FileTreeItem key={file.id} file={file} depth={0} />
                ))}
            </div>
        </div>
    );
}
