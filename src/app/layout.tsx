import type { Metadata } from 'next';
import './globals.css';
import { PersonaProvider } from '@/context/PersonaContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Preloader } from '@/components/animations/Preloader';
import { CustomCursor } from '@/components/animations/CustomCursor';
import { WebGLBackground } from '@/components/animations/WebGLBackground';
import { SmoothScroll } from '@/components/animations/SmoothScroll';

export const metadata: Metadata = {
  title: 'PGFinder | Find the Perfect PG Near Your College',
  description: 'Search student housing by distance, price, and amenities. Verified listings, no brokers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-transparent text-on-surface font-body-md antialiased min-h-screen flex flex-col relative overflow-x-hidden">
        <Preloader />
        <CustomCursor />
        <WebGLBackground />
        <SmoothScroll>
          <PersonaProvider>
            <Navbar />
            <main className="flex-grow bg-white/70 backdrop-blur-md rounded-3xl m-4 md:m-8 p-4 md:p-8 shadow-level-2 min-h-screen">
              {children}
            </main>
            <Footer />
          </PersonaProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
