import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title:
    "Roastback - Show me what you've got. I'll tell you who you are today.",
  description:
    '"Upload a photo, get roasted by AI, and hit back with one sharp reply. RoastBack.app has zero mercy and always gets the last word."',
  metadataBase: new URL('https://kolbinski.github.io/roastback/'),
  openGraph: {
    title: 'Roastback',
    description:
      '"Upload a photo, get roasted by AI, and hit back with one sharp reply. RoastBack.app has zero mercy and always gets the last word."',
    url: 'https://kolbinski.github.io/roastback/',
    siteName: 'Roastback',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Roastback - AI photo roast app',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roastback',
    description:
      '"Upload a photo, get roasted by AI, and hit back with one sharp reply. RoastBack.app has zero mercy and always gets the last word."',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
