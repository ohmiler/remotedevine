import { create } from 'zustand';
import { ConsoleMessage, EditorTab } from '@/types';

interface EditorStore {
    // Tabs
    tabs: EditorTab[];
    activeTab: string | null;

    // Theme
    theme: 'vs-dark' | 'light';
    fontSize: number;

    // Console
    consoleMessages: ConsoleMessage[];
    isConsoleOpen: boolean;

    // Panel sizes
    sidebarWidth: number;
    previewWidth: number;
    consoleHeight: number;

    // Running state
    isRunning: boolean;

    // Actions
    setTheme: (theme: 'vs-dark' | 'light') => void;
    setFontSize: (size: number) => void;

    addConsoleMessage: (type: ConsoleMessage['type'], content: string) => void;
    clearConsole: () => void;
    toggleConsole: () => void;

    setSidebarWidth: (width: number) => void;
    setPreviewWidth: (width: number) => void;
    setConsoleHeight: (height: number) => void;

    setIsRunning: (running: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    tabs: [],
    activeTab: null,
    theme: 'vs-dark',
    fontSize: 14,
    consoleMessages: [],
    isConsoleOpen: true,
    sidebarWidth: 250,
    previewWidth: 400,
    consoleHeight: 200,
    isRunning: false,

    setTheme: (theme) => set({ theme }),
    setFontSize: (fontSize) => set({ fontSize }),

    addConsoleMessage: (type, content) => set((state) => ({
        consoleMessages: [
            ...state.consoleMessages,
            { type, content, timestamp: new Date() },
        ],
    })),

    clearConsole: () => set({ consoleMessages: [] }),
    toggleConsole: () => set((state) => ({ isConsoleOpen: !state.isConsoleOpen })),

    setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
    setPreviewWidth: (previewWidth) => set({ previewWidth }),
    setConsoleHeight: (consoleHeight) => set({ consoleHeight }),

    setIsRunning: (isRunning) => set({ isRunning }),
}));
