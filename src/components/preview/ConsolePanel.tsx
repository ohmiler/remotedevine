'use client';

import { useEditorStore } from '@/store';
import { Trash2, Terminal, AlertCircle, Info, Database } from 'lucide-react';

export function ConsolePanel() {
    const { consoleMessages, clearConsole, isConsoleOpen } = useEditorStore();

    if (!isConsoleOpen) {
        return null;
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <AlertCircle size={14} color="#f87171" />;
            case 'info':
                return <Info size={14} color="#60a5fa" />;
            case 'sql':
                return <Database size={14} color="#a78bfa" />;
            default:
                return <Terminal size={14} color="#4ade80" />;
        }
    };

    const getMessageStyle = (type: string): React.CSSProperties => {
        const base: React.CSSProperties = {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '4px',
            borderLeft: '2px solid',
        };

        switch (type) {
            case 'error':
                return { ...base, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeftColor: '#ef4444' };
            case 'info':
                return { ...base, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderLeftColor: '#3b82f6' };
            case 'sql':
                return { ...base, backgroundColor: 'rgba(139, 92, 246, 0.1)', borderLeftColor: '#8b5cf6' };
            default:
                return { ...base, backgroundColor: 'rgba(34, 197, 94, 0.1)', borderLeftColor: '#22c55e' };
        }
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#111827',
            borderTop: '1px solid #374151',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: '1px solid #374151',
                backgroundColor: '#1f2937',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#9ca3af',
                }}>
                    <Terminal size={14} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Console</span>
                    <span style={{
                        fontSize: '11px',
                        backgroundColor: '#374151',
                        padding: '2px 8px',
                        borderRadius: '10px',
                    }}>
                        {consoleMessages.length}
                    </span>
                </div>
                <button
                    onClick={clearConsole}
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
                    title="Clear console"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px',
                fontFamily: "'Fira Code', Consolas, monospace",
                fontSize: '12px',
            }}>
                {consoleMessages.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#6b7280',
                    }}>
                        <p>Run your PHP code to see output here</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {consoleMessages.map((msg, index) => (
                            <div key={index} style={getMessageStyle(msg.type)}>
                                <span style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon(msg.type)}</span>
                                <pre style={{
                                    flex: 1,
                                    whiteSpace: 'pre-wrap',
                                    color: '#d1d5db',
                                    overflowX: 'auto',
                                    margin: 0,
                                }}>
                                    {msg.content}
                                </pre>
                                <span style={{
                                    fontSize: '10px',
                                    color: '#6b7280',
                                    flexShrink: 0,
                                }}>
                                    {msg.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
