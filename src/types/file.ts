// Virtual File System Types
export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: VirtualFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FileSystemState {
  root: VirtualFile;
  selectedPath: string | null;
  openFiles: string[];
  activeFile: string | null;
}
