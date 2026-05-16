import "./globals.css"

export const metadata = {
  title: "Bento Indonesia",
  description: "Link in bio ala Bento.me",
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
