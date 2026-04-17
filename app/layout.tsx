import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mini IPL — 5-Over League',
  description: 'Your private cricket league manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased" style={{ background: '#0a0a0f' }}>
        {children}
      </body>
    </html>
  );
}
