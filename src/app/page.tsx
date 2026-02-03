import Link from 'next/link';
import { Code2, Zap, Database, Download, Cloud, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Code2 size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>PHP Playground</h1>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Online PHP IDE</p>
            </div>
          </div>
          <Link
            href="/editor"
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Open Editor
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '20px',
            color: '#a78bfa',
            fontSize: '14px',
            marginBottom: '32px',
          }}>
            ✨ Free & Open Source
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            <span style={{ color: 'white' }}>Code PHP</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Directly in Your Browser
            </span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#9ca3af',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Write, run, and share PHP code instantly. No installation required.
            Perfect for learning, prototyping, and quick experiments.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
          }}>
            <Link
              href="/editor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '16px',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              <Zap size={20} />
              Start Coding Now
            </Link>
            <a
              href="https://github.com/ohmiler/remotedevine"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '16px 32px',
                border: '1px solid #374151',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '16px',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: 'rgba(139,92,246,0.03)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '16px',
            }}>
              Everything You Need
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#9ca3af',
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              A complete PHP development environment in your browser.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: '28px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  background: feature.bgColor,
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#9ca3af',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            padding: '60px 40px',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 700,
              marginBottom: '16px',
            }}>
              Ready to Start Coding?
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '500px',
              margin: '0 auto 32px',
            }}>
              Jump into the editor and start writing PHP code immediately.
              Your projects are saved automatically.
            </p>
            <Link
              href="/editor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                backgroundColor: 'white',
                color: '#7c3aed',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '16px',
                textDecoration: 'none',
              }}
            >
              <Code2 size={20} />
              Open Editor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
      }}>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          Built with ❤️ using Next.js, Monaco Editor, and php-wasm
        </p>
        <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '8px' }}>
          © {new Date().getFullYear()} PHP Playground. Open Source.
        </p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Code2 size={24} color="white" />,
    title: 'Monaco Editor',
    description: 'The same powerful editor that powers VS Code, with PHP syntax highlighting.',
    bgColor: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  },
  {
    icon: <Zap size={24} color="white" />,
    title: 'Instant Execution',
    description: 'Run your PHP code directly in the browser. No server setup required.',
    bgColor: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    icon: <Database size={24} color="white" />,
    title: 'SQL Database',
    description: 'Built-in SQLite database with MySQL-compatible syntax.',
    bgColor: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  },
  {
    icon: <Download size={24} color="white" />,
    title: 'Export Projects',
    description: 'Download your complete project as a ZIP file.',
    bgColor: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: <Cloud size={24} color="white" />,
    title: 'Cloud Storage',
    description: 'Save your projects to the cloud and access them anywhere.',
    bgColor: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    icon: <Users size={24} color="white" />,
    title: 'Share & Collaborate',
    description: 'Share your projects with a public link.',
    bgColor: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  },
];
