import Link from 'next/link';
import { Code2, Zap, Database, Download, Cloud, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/25">
              <Code2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PHP Playground</h1>
              <p className="text-sm text-gray-400">Online PHP IDE</p>
            </div>
          </div>

          {/* Hero content */}
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Code PHP
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Directly in Your Browser
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Write, run, and share PHP code instantly. No installation required.
              Perfect for learning, prototyping, and quick experiments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/editor"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <Zap size={20} className="group-hover:animate-pulse" />
                Start Coding Now
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:border-purple-500/50 hover:text-white transition-all duration-300"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-4 text-white">
          Everything You Need
        </h3>
        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          A complete PHP development environment in your browser. No setup, no hassle.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <h3 className="text-4xl font-bold text-white mb-4">
              Ready to Start Coding?
            </h3>
            <p className="text-purple-100 mb-8 max-w-xl mx-auto">
              Jump into the editor and start writing PHP code immediately.
              Your projects are saved automatically.
            </p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <Code2 size={20} />
              Open Editor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>
            Built with ❤️ using Next.js, Monaco Editor, and php-wasm
          </p>
          <p className="mt-2 text-sm">
            © {new Date().getFullYear()} PHP Playground. Open Source.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Code2 size={24} className="text-white" />,
    title: 'Monaco Editor',
    description: 'The same powerful editor that powers VS Code, with PHP syntax highlighting and IntelliSense.',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  },
  {
    icon: <Zap size={24} className="text-white" />,
    title: 'Instant Execution',
    description: 'Run your PHP code directly in the browser. No server setup required.',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
  },
  {
    icon: <Database size={24} className="text-white" />,
    title: 'SQL Database',
    description: 'Built-in SQLite database with MySQL-compatible syntax for learning SQL.',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
  {
    icon: <Download size={24} className="text-white" />,
    title: 'Export Projects',
    description: 'Download your complete project as a ZIP file, ready to deploy to any PHP hosting.',
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
  },
  {
    icon: <Cloud size={24} className="text-white" />,
    title: 'Cloud Storage',
    description: 'Save your projects to the cloud and access them from anywhere.',
    color: 'bg-gradient-to-br from-indigo-500 to-violet-500',
  },
  {
    icon: <Users size={24} className="text-white" />,
    title: 'Share & Collaborate',
    description: 'Share your projects with a public link. Perfect for tutorials and code reviews.',
    color: 'bg-gradient-to-br from-rose-500 to-red-500',
  },
];
