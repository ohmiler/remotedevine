// Project Types
export interface Project {
    id: string;
    name: string;
    description?: string;
    files: string; // JSON stringified VirtualFile
    database?: Uint8Array; // sql.js database export
    isPublic: boolean;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    files: string;
    category: string;
}
