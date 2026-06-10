import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nameštaj sa Stilom — Premium Nameštaj',
  description: 'Ugaone garniture, bračni kreveti i kreveti na razvlačenje. Premium nameštaj za vaš dom.',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
