import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/providers/ThemeProvider'
import { initializeStorageWithSeedData } from '@/lib/services/seed-data'
import { UserProvider } from '@/context/UserContext'

export const metadata: Metadata = {
  title: 'DotSkillsHub - E-Commerce SaaS Platform',
  description: 'Multi-tenant E-Commerce SaaS platform for managing subscriptions and stores',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

// Initialize seed data on server side
if (typeof window === 'undefined') {
  initializeStorageWithSeedData()
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
      <UserProvider>
          <ThemeProvider>
          {children}
        </ThemeProvider>
      </UserProvider>
        {/* {process.env.NODE_ENV === 'production' && <Analytics />} */}
      </body>
    </html>
  )
}
