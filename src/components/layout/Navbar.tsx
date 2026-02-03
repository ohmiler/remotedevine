'use client';

import Link from 'next/link';
import { Code2, Github, User, LogIn } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-gray-900 via-purple-900/50 to-gray-900 border-b border-purple-500/20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                    <Code2 size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        PHP Playground
                    </h1>
                    <p className="text-xs text-gray-400">Online PHP IDE</p>
                </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
                <Link
                    href="/editor"
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                    Editor
                </Link>
                <Link
                    href="/projects"
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                    Projects
                </Link>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <Github size={20} />
                </a>

                {/* Auth buttons (placeholder for now) */}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-700">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                        <LogIn size={16} />
                        <span>Login</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/25">
                        <User size={16} />
                        <span>Sign Up</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
