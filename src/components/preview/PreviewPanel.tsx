'use client';

import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react';
import { useState } from 'react';

interface PreviewPanelProps {
    html: string;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

const deviceSizes: Record<DeviceSize, { width: string; icon: React.ReactNode }> = {
    mobile: { width: '375px', icon: <Smartphone size={14} /> },
    tablet: { width: '768px', icon: <Tablet size={14} /> },
    desktop: { width: '100%', icon: <Monitor size={14} /> },
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
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#111827',
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
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Preview</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Device size toggles */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#374151',
                        borderRadius: '6px',
                        padding: '2px',
                    }}>
                        {(Object.keys(deviceSizes) as DeviceSize[]).map((size) => (
                            <button
                                key={size}
                                onClick={() => setDevice(size)}
                                style={{
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: device === size ? '#8b5cf6' : 'transparent',
                                    color: device === size ? 'white' : '#9ca3af',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                title={size.charAt(0).toUpperCase() + size.slice(1)}
                            >
                                {deviceSizes[size].icon}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleRefresh}
                        style={{
                            padding: '6px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        title="Refresh preview"
                    >
                        <RefreshCw size={14} />
                    </button>

                    <button
                        onClick={handleOpenInNewTab}
                        style={{
                            padding: '6px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        title="Open in new tab"
                    >
                        <ExternalLink size={14} />
                    </button>
                </div>
            </div>

            {/* Preview iframe */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                backgroundColor: '#0f172a',
                padding: '16px',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div
                    style={{
                        width: deviceSizes[device].width,
                        height: '100%',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: device !== 'desktop' ? '4px solid #374151' : 'none',
                    }}
                >
                    {html ? (
                        <iframe
                            key={key}
                            srcDoc={fullHtml}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                            sandbox="allow-scripts"
                            title="PHP Output Preview"
                        />
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🖥️</div>
                                <p style={{ color: '#4b5563' }}>Click &quot;Run&quot; to see your PHP output</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
