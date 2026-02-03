// Editor Types
export interface EditorTab {
    path: string;
    name: string;
    isDirty: boolean;
}

export interface EditorState {
    tabs: EditorTab[];
    activeTab: string | null;
    theme: 'vs-dark' | 'light';
    fontSize: number;
}

export interface PHPResult {
    output: string;
    errors: string[];
    exitCode: number;
}

export interface SQLResult {
    columns: string[];
    rows: unknown[][];
    rowsAffected: number;
    error?: string;
}

export interface ConsoleMessage {
    type: 'output' | 'error' | 'info' | 'sql';
    content: string;
    timestamp: Date;
}
