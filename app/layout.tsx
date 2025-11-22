import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RealEstate Rizz',
  description: 'A Farcaster mini app that turns your profile into a ridiculous onchain house.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}