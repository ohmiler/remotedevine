'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Table2, Trash2, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/store';

interface SQLEditorProps {
    isOpen: boolean;
}

// Type for sql.js Database
interface SQLDatabase {
    exec: (query: string) => { columns: string[]; values: unknown[][] }[];
    run: (query: string) => void;
}

export function SQLEditor({ isOpen }: SQLEditorProps) {
    const [query, setQuery] = useState(`-- Welcome to SQL Editor! 🗃️
-- This uses sql.js (SQLite compiled to WebAssembly)
-- Syntax is compatible with MySQL for most operations

-- Example: Create a users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert some data
INSERT INTO users (name, email, age) VALUES 
  ('John Doe', 'john@example.com', 25),
  ('Jane Smith', 'jane@example.com', 30),
  ('Bob Wilson', 'bob@example.com', 28);

-- Query the data
SELECT * FROM users;
`);
    const [results, setResults] = useState<{ columns: string[]; rows: unknown[][] } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [db, setDb] = useState<SQLDatabase | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { theme, addConsoleMessage } = useEditorStore();

    // Initialize sql.js when component mounts - load from CDN
    useEffect(() => {
        const initSQL = async () => {
            if (db || isLoading) return;

            setIsLoading(true);

            try {
                // Load sql.js from CDN
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.min.js';
                script.async = true;

                await new Promise<void>((resolve, reject) => {
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load sql.js'));
                    document.head.appendChild(script);
                });

                // Wait for initSqlJs to be available
                // @ts-expect-error - initSqlJs is loaded from CDN
                const SQL = await window.initSqlJs({
                    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
                });

                const database = new SQL.Database();
                setDb(database);
                addConsoleMessage('info', '✅ SQL Database initialized (SQLite in-memory)');
            } catch (err) {
                console.error('Failed to initialize sql.js:', err);
                addConsoleMessage('error', '❌ Failed to initialize SQL database');
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen && !db && !isLoading) {
            initSQL();
        }
    }, [isOpen, db, isLoading, addConsoleMessage]);

    const executeQuery = () => {
        if (!db) {
            setError('Database not initialized');
            return;
        }

        setIsRunning(true);
        setError(null);
        setResults(null);

        try {
            // Split queries by semicolon and execute each
            const queries = query
                .split(';')
                .map((q) => q.trim())
                .filter((q) => q && !q.startsWith('--'));

            let lastResult: { columns: string[]; rows: unknown[][] } | null = null;

            for (const q of queries) {
                if (q) {
                    try {
                        const result = db.exec(q);
                        if (result.length > 0) {
                            lastResult = {
                                columns: result[0].columns,
                                rows: result[0].values,
                            };
                        }
                        addConsoleMessage('sql', `✅ ${q.substring(0, 50)}${q.length > 50 ? '...' : ''}`);
                    } catch (err: unknown) {
                        const message = err instanceof Error ? err.message : String(err);
                        throw new Error(`Error in query: ${q}\n${message}`);
                    }
                }
            }

            if (lastResult) {
                setResults(lastResult);
                addConsoleMessage('sql', `📊 Query returned ${lastResult.rows.length} row(s)`);
            } else {
                addConsoleMessage('sql', '✅ Query executed successfully (no results to display)');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
            addConsoleMessage('error', `❌ SQL Error: ${message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const clearDatabase = () => {
        if (!db) return;

        if (confirm('Clear all tables? This cannot be undone.')) {
            try {
                // Get all tables
                const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
                if (tables.length > 0) {
                    tables[0].values.forEach((row) => {
                        db.run(`DROP TABLE IF EXISTS ${row[0]}`);
                    });
                }
                setResults(null);
                addConsoleMessage('info', '🗑️ Database cleared');
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                addConsoleMessage('error', `❌ Error clearing database: ${message}`);
            }
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] border-l border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#252526]">
                <div className="flex items-center gap-2 text-gray-400">
                    <Table2 size={16} className="text-purple-400" />
                    <span className="text-sm font-medium">SQL Editor</span>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                        SQLite
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={clearDatabase}
                        className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400 transition-colors"
                        title="Clear database"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Query Editor */}
            <div className="h-48 border-b border-gray-700">
                <Editor
                    height="100%"
                    language="sql"
                    value={query}
                    theme={theme}
                    onChange={(value) => setQuery(value || '')}
                    options={{
                        fontSize: 13,
                        fontFamily: "'Fira Code', Consolas, monospace",
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 8, bottom: 8 },
                    }}
                />
            </div>

            {/* Run button */}
            <div className="px-4 py-2 border-b border-gray-700 bg-[#252526]">
                <button
                    onClick={executeQuery}
                    disabled={isRunning || !db}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200 w-full justify-center
            ${isRunning || !db
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        }
          `}
                >
                    {isRunning ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Running...</span>
                        </>
                    ) : (
                        <>
                            <Play size={16} />
                            <span>Run Query</span>
                        </>
                    )}
                </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto p-4">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm mb-4">
                        <pre className="whitespace-pre-wrap">{error}</pre>
                    </div>
                )}

                {results && (
                    <div className="overflow-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-800">
                                    {results.columns.map((col, i) => (
                                        <th
                                            key={i}
                                            className="px-4 py-2 text-left text-gray-300 font-medium border border-gray-700"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-800/50">
                                        {row.map((cell, j) => (
                                            <td
                                                key={j}
                                                className="px-4 py-2 text-gray-400 border border-gray-700"
                                            >
                                                {cell === null ? (
                                                    <span className="text-gray-600 italic">NULL</span>
                                                ) : (
                                                    String(cell)
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-2 text-xs text-gray-500">
                            {results.rows.length} row(s) returned
                        </div>
                    </div>
                )}

                {!error && !results && db && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <Table2 size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Write a query and click &quot;Run Query&quot; to see results</p>
                        </div>
                    </div>
                )}

                {!db && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <Loader2 size={48} className="mx-auto mb-4 animate-spin opacity-50" />
                            <p>Initializing database...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
