'use client';

import Link from 'next/link';
import { Code2, Github } from 'lucide-react';

export function Navbar() {
    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: 'linear-gradient(90deg, #111827, rgba(88, 28, 135, 0.3), #111827)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
            height: '48px',
            flexShrink: 0,
        }}>
            {/* Logo */}
            <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
            }}>
                <div style={{
                    padding: '6px',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Code2 size={18} color="white" />
                </div>
                <div>
                    <h1 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'white',
                        margin: 0,
                    }}>
                        PHP Playground
                    </h1>
                </div>
            </Link>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                    href="https://github.com/ohmiler/remotedevine"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        padding: '6px',
                        color: '#9ca3af',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Github size={18} />
                </a>
            </div>
        </nav>
    );
}
