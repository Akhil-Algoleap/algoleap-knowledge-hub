import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Algoleap Knowledge Hub',
  description: 'Internal searchable catalog of Algoleap files and artifacts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen relative`}>
        {/* No background glows for light theme */}
        
        {children}
      </body>
    </html>
  )
}
