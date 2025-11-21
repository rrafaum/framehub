import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const sora = Sora ({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"]
})

export const metadata: Metadata = {
  title: "FrameHub: Onde todos os frames se encontram",
  description: "Encontre, explore e organize seus filmes e séries favoritos. O FrameHub é o seu catálogo de cinema pessoal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={sora.className}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
