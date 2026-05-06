import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Добрые лапки",
  description: "Городской приют для животных",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className={`${nunito.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
