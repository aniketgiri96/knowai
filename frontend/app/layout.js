import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6" aria-label="Main navigation">
            <a
              href="/"
              className="text-lg font-semibold text-slate-900 no-underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded min-h-[2.5rem] inline-flex items-center"
            >
              KnowAI
            </a>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <a
                href="/"
                className="rounded px-3 py-2 text-sm font-medium text-slate-600 no-underline hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[2.5rem] inline-flex items-center"
              >
                Home
              </a>
              <a
                href="/upload"
                className="rounded px-3 py-2 text-sm font-medium text-slate-600 no-underline hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[2.5rem] inline-flex items-center"
              >
                Upload
              </a>
              <a
                href="/search"
                className="rounded px-3 py-2 text-sm font-medium text-slate-600 no-underline hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[2.5rem] inline-flex items-center"
              >
                Search
              </a>
              <a
                href="/chat"
                className="rounded px-3 py-2 text-sm font-medium text-slate-600 no-underline hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[2.5rem] inline-flex items-center"
              >
                Chat
              </a>
              <a
                href="/login"
                className="rounded px-3 py-2 text-sm font-medium text-blue-600 no-underline hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[2.5rem] inline-flex items-center"
              >
                Login
              </a>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
