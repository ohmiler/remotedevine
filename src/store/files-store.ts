import { create } from 'zustand';
import { VirtualFile } from '@/types';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Default project structure
const createDefaultProject = (): VirtualFile => ({
    id: generateId(),
    name: 'project',
    path: '/',
    type: 'folder',
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
        {
            id: generateId(),
            name: 'index.php',
            path: '/index.php',
            type: 'file',
            content: `<?php
// Welcome to PHP Playground! 🚀
// Write your PHP code here and click "Run" to execute.

echo "<h1>Hello, PHP Playground!</h1>";
echo "<p>Start coding your PHP project here.</p>";

// Example: Variables
$name = "Developer";
$year = date("Y");

echo "<p>Welcome, $name! It's $year.</p>";

// Example: Array
$fruits = ["Apple", "Banana", "Orange"];

echo "<h2>My Fruits:</h2>";
echo "<ul>";
foreach ($fruits as $fruit) {
    echo "<li>$fruit</li>";
}
echo "</ul>";

// Example: Function
function greet($name) {
    return "Hello, " . $name . "!";
}

echo "<p>" . greet("World") . "</p>";
?>
`,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: generateId(),
            name: 'styles.css',
            path: '/styles.css',
            type: 'file',
            content: `/* CSS Styles for your PHP project */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

.container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

h1 {
  color: #667eea;
  border-bottom: 3px solid #764ba2;
  padding-bottom: 10px;
}

h2 {
  color: #764ba2;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 8px 16px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}
`,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: generateId(),
            name: 'config',
            path: '/config',
            type: 'folder',
            children: [
                {
                    id: generateId(),
                    name: 'database.php',
                    path: '/config/database.php',
                    type: 'file',
                    content: `<?php
// Database Configuration
// Note: This uses sql.js (SQLite) in the browser

$db_config = [
    'driver' => 'sqlite',
    'database' => ':memory:',
    'charset' => 'utf8mb4',
];

// Example: Create a table
/*
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/
?>
`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
});

interface FilesStore {
    root: VirtualFile;
    selectedPath: string | null;
    openFiles: string[];
    activeFile: string | null;

    // Actions
    setSelectedPath: (path: string | null) => void;
    openFile: (path: string) => void;
    closeFile: (path: string) => void;
    setActiveFile: (path: string | null) => void;

    // File operations
    getFile: (path: string) => VirtualFile | null;
    getFileContent: (path: string) => string;
    updateFileContent: (path: string, content: string) => void;
    createFile: (parentPath: string, name: string, type: 'file' | 'folder') => void;
    deleteFile: (path: string) => void;
    renameFile: (path: string, newName: string) => void;

    // Project operations
    resetProject: () => void;
    loadProject: (root: VirtualFile) => void;
    exportProject: () => VirtualFile;
}

// Helper to find file by path
const findFile = (root: VirtualFile, path: string): VirtualFile | null => {
    if (root.path === path) return root;
    if (root.children) {
        for (const child of root.children) {
            const found = findFile(child, path);
            if (found) return found;
        }
    }
    return null;
};

// Helper to find parent folder
const findParent = (root: VirtualFile, path: string): VirtualFile | null => {
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
    return findFile(root, parentPath);
};

// Helper to update file in tree (immutable)
const updateFileInTree = (
    root: VirtualFile,
    path: string,
    updater: (file: VirtualFile) => VirtualFile
): VirtualFile => {
    if (root.path === path) {
        return updater(root);
    }
    if (root.children) {
        return {
            ...root,
            children: root.children.map((child) => updateFileInTree(child, path, updater)),
        };
    }
    return root;
};

// Helper to delete file from tree
const deleteFileFromTree = (root: VirtualFile, path: string): VirtualFile => {
    if (root.children) {
        return {
            ...root,
            children: root.children
                .filter((child) => child.path !== path)
                .map((child) => deleteFileFromTree(child, path)),
        };
    }
    return root;
};

export const useFilesStore = create<FilesStore>((set, get) => ({
    root: createDefaultProject(),
    selectedPath: '/index.php',
    openFiles: ['/index.php'],
    activeFile: '/index.php',

    setSelectedPath: (path) => set({ selectedPath: path }),

    openFile: (path) => {
        const { openFiles } = get();
        if (!openFiles.includes(path)) {
            set({ openFiles: [...openFiles, path], activeFile: path });
        } else {
            set({ activeFile: path });
        }
    },

    closeFile: (path) => {
        const { openFiles, activeFile } = get();
        const newOpenFiles = openFiles.filter((f) => f !== path);
        const newActiveFile = activeFile === path
            ? newOpenFiles[newOpenFiles.length - 1] || null
            : activeFile;
        set({ openFiles: newOpenFiles, activeFile: newActiveFile });
    },

    setActiveFile: (path) => set({ activeFile: path }),

    getFile: (path) => findFile(get().root, path),

    getFileContent: (path) => {
        const file = findFile(get().root, path);
        return file?.content || '';
    },

    updateFileContent: (path, content) => {
        set((state) => ({
            root: updateFileInTree(state.root, path, (file) => ({
                ...file,
                content,
                updatedAt: new Date(),
            })),
        }));
    },

    createFile: (parentPath, name, type) => {
        const newPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
        const newFile: VirtualFile = {
            id: generateId(),
            name,
            path: newPath,
            type,
            content: type === 'file' ? '' : undefined,
            children: type === 'folder' ? [] : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        set((state) => ({
            root: updateFileInTree(state.root, parentPath, (folder) => ({
                ...folder,
                children: [...(folder.children || []), newFile],
                updatedAt: new Date(),
            })),
        }));
    },

    deleteFile: (path) => {
        const { openFiles, activeFile, closeFile } = get();

        // Close file if open
        if (openFiles.includes(path)) {
            closeFile(path);
        }

        set((state) => ({
            root: deleteFileFromTree(state.root, path),
            selectedPath: state.selectedPath === path ? null : state.selectedPath,
        }));
    },

    renameFile: (path, newName) => {
        const file = findFile(get().root, path);
        if (!file) return;

        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`;

        set((state) => ({
            root: updateFileInTree(state.root, path, (f) => ({
                ...f,
                name: newName,
                path: newPath,
                updatedAt: new Date(),
            })),
            openFiles: state.openFiles.map((p) => (p === path ? newPath : p)),
            activeFile: state.activeFile === path ? newPath : state.activeFile,
            selectedPath: state.selectedPath === path ? newPath : state.selectedPath,
        }));
    },

    resetProject: () => set({
        root: createDefaultProject(),
        selectedPath: '/index.php',
        openFiles: ['/index.php'],
        activeFile: '/index.php',
    }),

    loadProject: (root) => set({
        root,
        selectedPath: null,
        openFiles: [],
        activeFile: null,
    }),

    exportProject: () => get().root,
}));
