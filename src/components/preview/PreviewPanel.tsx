'use client';

import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react';
import { useState } from 'react';

interface PreviewPanelProps {
    html: string;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

const deviceSizes: Record<DeviceSize, { width: string; icon: React.ReactNode }> = {
    mobile: { width: '375px', icon: <Smartphone size={16} /> },
    tablet: { width: '768px', icon: <Tablet size={16} /> },
    desktop: { width: '100%', icon: <Monitor size={16} /> },
};

export function PreviewPanel({ html }: PreviewPanelProps) {
    const [key, setKey] = useState(0);
    const [device, setDevice] = useState<DeviceSize>('desktop');

    const handleRefresh = () => {
        setKey((k) => k + 1);
    };

    const handleOpenInNewTab = () => {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(html);
            newWindow.document.close();
        }
    };

    // Create a complete HTML document if not provided
    const fullHtml = html.includes('<!DOCTYPE') || html.includes('<html')
        ? html
        : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PHP Output</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      margin: 0;
      background: #fff;
      color: #333;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#252526]">
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm font-medium">Preview</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Device size toggles */}
                    <div className="flex items-center bg-gray-700 rounded-lg p-1">
                        {(Object.keys(deviceSizes) as DeviceSize[]).map((size) => (
                            <button
                                key={size}
                                onClick={() => setDevice(size)}
                                className={`p-1.5 rounded transition-colors ${device === size
                                        ? 'bg-purple-500 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                                title={size.charAt(0).toUpperCase() + size.slice(1)}
                            >
                                {deviceSizes[size].icon}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        title="Refresh preview"
                    >
                        <RefreshCw size={16} />
                    </button>

                    <button
                        onClick={handleOpenInNewTab}
                        className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        title="Open in new tab"
                    >
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>

            {/* Preview iframe */}
            <div className="flex-1 overflow-auto bg-gray-900 p-4 flex justify-center">
                <div
                    style={{ width: deviceSizes[device].width }}
                    className={`h-full bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${device !== 'desktop' ? 'border-4 border-gray-700' : ''
                        }`}
                >
                    {html ? (
                        <iframe
                            key={key}
                            srcDoc={fullHtml}
                            className="w-full h-full border-0"
                            sandbox="allow-scripts"
                            title="PHP Output Preview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🖥️</div>
                                <p className="text-gray-600">Click &quot;Run&quot; to see your PHP output</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
