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
                return <AlertCircle size={14} className="text-red-400" />;
            case 'info':
                return <Info size={14} className="text-blue-400" />;
            case 'sql':
                return <Database size={14} className="text-purple-400" />;
            default:
                return <Terminal size={14} className="text-green-400" />;
        }
    };

    const getMessageStyle = (type: string) => {
        switch (type) {
            case 'error':
                return 'bg-red-500/10 border-l-2 border-red-500';
            case 'info':
                return 'bg-blue-500/10 border-l-2 border-blue-500';
            case 'sql':
                return 'bg-purple-500/10 border-l-2 border-purple-500';
            default:
                return 'bg-green-500/10 border-l-2 border-green-500';
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] border-t border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#252526]">
                <div className="flex items-center gap-2 text-gray-400">
                    <Terminal size={16} />
                    <span className="text-sm font-medium">Console</span>
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                        {consoleMessages.length}
                    </span>
                </div>
                <button
                    onClick={clearConsole}
                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    title="Clear console"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-2 font-mono text-sm">
                {consoleMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Run your PHP code to see output here</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {consoleMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-2 px-3 py-2 rounded ${getMessageStyle(msg.type)}`}
                            >
                                <span className="flex-shrink-0 mt-0.5">{getIcon(msg.type)}</span>
                                <pre className="flex-1 whitespace-pre-wrap text-gray-300 overflow-x-auto">
                                    {msg.content}
                                </pre>
                                <span className="text-xs text-gray-500 flex-shrink-0">
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
